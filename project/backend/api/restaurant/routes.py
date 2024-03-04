from datetime import datetime, timedelta
from http import HTTPStatus

from flask import current_app as app
from flask import jsonify, request, Blueprint
from sqlalchemy.sql import func, case

from .models import Restaurants
from .services import ItemFilter, ItemPopularityService, TimeConversion
from .. import db
from ..menu.models import Items
from ..orders.models import OrderedItems, Orders, DiningTables
from ..utilities import Helper

# Popularity Profit Money Per week/month/year etc
# Popularity Profit Money Per Category
# Popularity Profit Money Per Ingredient

manager = Blueprint('manager', __name__)


def add_new_table(table_number):
    new_table = DiningTables(number=table_number)
    db.session.add(new_table)
    db.session.commit()


@manager.route('/restaurant', methods=['GET'])
def get_restaurant():
    try:
        restaurant = Restaurants.query.first()
        return jsonify({'status': HTTPStatus.OK, 'restaurant': restaurant.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Route to get all items sorted by popularity
@manager.route('/items/popularity', methods=['GET'])
def all_items_sorted():
    filter_type = request.args.get('filter')
    category_id_str = request.args.get('category_id')

    if not category_id_str or not category_id_str.isdigit():
        return jsonify({'error': 'Invalid or missing category_id'}), 400

    category_id = int(category_id_str)

    item_filter = ItemFilter(filter_type, category_id, item_popularity_service=ItemPopularityService())

    try:
        return item_filter.filter_items()
    except Exception as e:
        app.logger.error(f"Error processing items: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@manager.route('/orderlog', methods=['GET'])
def get_orderlog():
    timespan = request.args.get('time')
    end_time = datetime.now()
    start_time = TimeConversion.validate_time_span(timespan)

    try:
        order_log = db.session.query(
            Orders.id.label('order_id'),
            OrderedItems.id.label('ordered_item_id'),
            Items.id.label('item_id'),
            Items.name.label('item_name'),
            case((OrderedItems.redeemed == True, 0),
                 else_=Items.price).label('item_price'),
            OrderedItems.redeemed.label('item_redeemed')
        ) \
            .join(OrderedItems, Orders.id == OrderedItems.order) \
            .join(Items, OrderedItems.item == Items.id) \
            .filter(
            Orders.order_date >= start_time,
            Orders.order_date <= end_time,
            Orders.paid == True,
        ) \
            .group_by(Orders.id,
                      OrderedItems.id,
                      Items.id,
                      Items.name,
                      Items.price,
                      OrderedItems.redeemed) \
            .all()

        order_log_list = [
            {
                'order_id': row.order_id,
                'ordered_item_id': row.ordered_item_id,
                'item_id': row.item_id,
                'item_name': row.item_name,
                'item_price': row.item_price,
                'item_redeemed': row.item_redeemed
            }
            for row in order_log
        ]
        total_income = sum(row['item_price'] for row in order_log_list)
        # total = {timespan: total_income}

        order_log_list = sorted(order_log_list, key=lambda x: x['order_id'])

        return jsonify({'status': HTTPStatus.OK, 'orderlog': order_log_list, 'gross_income': total_income})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@manager.route('/profit_tracker', methods=['GET'])
def get_profit():
    timespan = request.args.get('time')
    fil = request.args.get('filter')
    if request.args.get('category_id'):
        category_id = int(request.args.get('category_id'))
    end_time = datetime.now()
    start_time = TimeConversion.validate_time_span(timespan)

    if fil not in ['gross', 'net', 'popularity']:
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Filter not found'})

    try:
        order_log = db.session.query(
            Orders.id.label('order_id'),
            OrderedItems.id.label('ordered_item_id'),
            Items.id.label('item_id'),
            Items.name.label('item_name'),
            func.count(OrderedItems.item).label('item_popularity'),
            case((OrderedItems.redeemed == True, 0),
                 else_=Items.price).label('item_price'),
            case((OrderedItems.redeemed == True, 0 - Items.price),
                 else_=Items.net).label('item_net'),
            OrderedItems.redeemed.label('item_redeemed'),
            Items.category.label('category_id'),
            OrderedItems.order_time.label('time')
        ) \
            .join(OrderedItems, Orders.id == OrderedItems.order) \
            .join(Items, OrderedItems.item == Items.id) \
            .filter(
            Orders.order_date >= start_time,
            Orders.order_date <= end_time,
            Orders.paid == True,
        ) \
            .group_by(Orders.id,
                      OrderedItems.id,
                      Items.id,
                      Items.name,
                      OrderedItems.redeemed,
                      Items.category,
                      OrderedItems.order_time) \
            .all()

        order_log_list = [
            {
                'order_id': row.order_id,
                'ordered_item_id': row.ordered_item_id,
                'item_id': row.item_id,
                'item_name': row.item_name,
                'item_popularity': row.item_popularity,
                'item_price': row.item_price,
                'item_net': row.item_net,
                'item_redeemed': row.item_redeemed,
                'item_category': row.category_id,
                'time': row.time
            }
            for row in order_log
        ]

        if category_id:
            order_log_list = list(filter(lambda item: item.get('item_category') == category_id, order_log_list))

        per_day = {}

        for order in order_log_list:
            order_date = order['time'].strftime('%Y-%m-%d')
            item_gross = order['item_price']
            item_net = order['item_net']
            item_popularity = order['item_popularity']

            # If the order_date already exists in the dictionary, add the total_amount to the existing value
            if order_date in per_day:
                if fil == 'gross':
                    per_day[order_date] += item_gross
                elif fil == 'net':
                    per_day[order_date] += item_net
                elif fil == 'popularity':
                    per_day[order_date] += item_popularity
            else:
                # If the order_date is not in the dictionary, initialize it with the total_amount
                if fil == 'gross':
                    per_day[order_date] = item_gross
                elif fil == 'net':
                    per_day[order_date] = item_net
                elif fil == 'popularity':
                    per_day[order_date] = item_popularity

        if timespan != 'all':
            first_date = start_time
        else:
            first_order = Orders.query.order_by(Orders.order_date).first()
            first_date = first_order.order_date.replace(tzinfo=None)
        while first_date < end_time:
            if first_date.strftime('%Y-%m-%d') not in per_day:
                per_day[first_date.strftime('%Y-%m-%d')] = 0
            first_date += timedelta(days=1)

        sorted_per_day = dict(sorted(per_day.items()))
        days = list(sorted_per_day.keys())
        items = list(sorted_per_day.values())

        return jsonify({'status': HTTPStatus.OK, 'days': days, 'values': items})




    except Exception as e:
        return jsonify({'error': str(e)}), 500


@manager.route('/update', methods=['PUT'])
def update_restaurant():
    data = Helper.data_logger(request)
    restaurant_id = data['restaurant_id']
    new_name = data['new_name']
    new_phone = data['new_phone']
    new_staff_password = data['new_staff_password']
    new_manager_password = data['new_manager_password']
    if int(data['num_tables']) >= 1:
        num_table = int(data['num_tables'])
    else:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Must have at least 1 table'})

    restaurant = Restaurants.query.filter_by(id=restaurant_id).first()

    # save the new data
    restaurant.name = new_name
    restaurant.phone = new_phone

    if new_staff_password:
        restaurant.set_staff_password(new_staff_password)

    if new_manager_password:
        restaurant.set_manager_password(new_manager_password)

    current_num_tables = DiningTables.query.count()

    # Add or delete tables until it matches num_table
    if current_num_tables < num_table:
        # Add new tables
        for i in range(num_table - current_num_tables):
            add_new_table(current_num_tables + i + 1)
    elif current_num_tables > num_table:
        # Delete extra tables with higher numbers first
        tables_to_delete = DiningTables.query.order_by(DiningTables.number.desc()).limit(
            current_num_tables - num_table).all()

        for table in tables_to_delete:
            orders_with_unpaid = Orders.query.filter_by(table=table.id, paid=False).all()

            if not orders_with_unpaid:
                # Update associated orders to set the table_id to -1 (or any other value)
                for order in Orders.query.filter_by(table=table.id).all():
                    order.table = 1
                    db.session.commit()

            if DiningTables.query.filter_by(id=table.id).first():
                if not table.occupied:
                    db.session.delete(table)
                    db.session.commit()

    # Update the numbers of the remaining tables to be consecutive
    for i, table in enumerate(DiningTables.query.order_by(DiningTables.number).all(), start=1):
        table.number = i

    db.session.commit()

    current_num_tables = DiningTables.query.count()

    occupied_tables = current_num_tables - num_table

    return jsonify({'status': HTTPStatus.OK, 'message': 'Restaurant updated', 'undeletedtables': occupied_tables})


@manager.route('/items/statistics', methods=['GET'])
def item_statistics():
    # Passing in item id
    item_id = request.args.get('id')
    if Items.query.filter_by(id=item_id).first():
        item_query = Items.query.filter_by(id=item_id).first()
    else:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Item does not exist'})

    timespan = request.args.get('time')
    net = 0
    gross = 0
    ranking = 0
    production = 0
    end_time = datetime.now()
    start_time = TimeConversion.validate_time_span(timespan)

    try:
        popularity = db.session.query(func.count(OrderedItems.item)).filter(OrderedItems.item == item_id).scalar()
        unique_pop = db.session.query(func.count(func.distinct(OrderedItems.order))).filter(
            OrderedItems.item == item_id).scalar()
        if popularity:
            if item_query.net:
                net = popularity * item_query.net
            if item_query.production:
                production = popularity * item_query.production
            gross = popularity * item_query.price

        total_orders = db.session.query(func.count(Orders.id)).scalar()
        per_order = float(popularity / total_orders)

        items_popularity = db.session.query(OrderedItems.item, db.func.count(OrderedItems.item).label('popularity')). \
            group_by(OrderedItems.item). \
            order_by(db.desc('popularity')).all()

        for row_number, (item, popularity) in enumerate(items_popularity, start=1):
            if item == item_query.id:
                ranking = row_number
                break

        average_time = db.session.query(
            func.avg(func.extract('epoch', OrderedItems.order_time)).label('average_time')).filter(
            OrderedItems.item == item_query.id).first()

        average_time_seconds = float(average_time.average_time)
        average_datetime = datetime.utcfromtimestamp(average_time_seconds)

        # Extract the time component (hour and minutes) from the datetime object
        average_time = average_datetime.time()
        average_time_str = average_time.strftime('%H:%M:%S')

        order_log = db.session.query(
            Orders.id.label('order_id'),
            OrderedItems.id.label('ordered_item_id'),
            Items.id.label('item_id'),
            Items.name.label('item_name'),
            func.count(OrderedItems.item).label('item_popularity'),
            case((OrderedItems.redeemed == True, 0), else_=Items.price).label('item_price'),
            case((OrderedItems.redeemed == True, 0 - Items.price), else_=Items.net).label('item_net'),
            OrderedItems.redeemed.label('item_redeemed'),
            OrderedItems.order_time.label('time')
        ) \
            .join(OrderedItems, Orders.id == OrderedItems.order) \
            .join(Items, OrderedItems.item == Items.id) \
            .filter(
            Orders.order_date >= start_time,
            Orders.order_date <= end_time,
            Orders.paid == True,
            Items.id == item_id  # EXTRA FILTER
        ) \
            .group_by(
            Orders.id,
            OrderedItems.id,
            Items.id,
            Items.name,
            OrderedItems.redeemed,
            OrderedItems.order_time
        ) \
            .all()

        order_log_list = [
            {
                'order_id': row.order_id,
                'ordered_item_id': row.ordered_item_id,
                'item_id': row.item_id,
                'item_name': row.item_name,
                'item_popularity': row.item_popularity,
                'item_price': row.item_price,
                'item_net': row.item_net,
                'item_redeemed': row.item_redeemed,
                'time': row.time
            }
            for row in order_log
        ]

        per_day = {}

        for order in order_log_list:
            order_date = order['time'].strftime('%Y-%m-%d')
            item_popularity = order['item_popularity']

            # If the order_date already exists in the dictionary, add the total_amount to the existing value
            if order_date in per_day:
                per_day[order_date] += item_popularity
            else:
                # If the order_date is not in the dictionary, initialize it with the total_amount
                per_day[order_date] = item_popularity

        if timespan != 'all':
            first_date = start_time
        else:
            first_order = Orders.query.order_by(Orders.order_date).first()
            first_date = first_order.order_date.replace(tzinfo=None)
        while first_date < end_time:
            if first_date.strftime('%Y-%m-%d') not in per_day:
                per_day[first_date.strftime('%Y-%m-%d')] = 0
            first_date += timedelta(days=1)

        sorted_per_day = dict(sorted(per_day.items()))
        days = list(sorted_per_day.keys())
        popperday = list(sorted_per_day.values())

        return jsonify({'popularity': popularity, 'unique_pop': unique_pop, 'net': net, 'gross': gross,
                        'production': production, 'per_order': per_order, 'ranking': ranking,
                        'avgtime': average_time_str,
                        'days': days, 'popularitybyday': popperday, 'status': HTTPStatus.OK})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
