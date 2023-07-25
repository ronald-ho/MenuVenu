from flask import request
from dataclasses import dataclass
from http import HTTPStatus
from flask import jsonify
from datetime import datetime, timedelta
from sqlalchemy.sql import func, case
from builtins import sorted
from .. import db
from ..orders.models import OrderedItems, Orders
from ..menu.models import Items
from .. import app


# Popularity Profit Money Per week/month/year etc
# Popularity Profit Money Per Category
# Popularity Profit Money Per Ingredient





# Route to get all items sorted by popularity
@app.route('/manager/items/popularity', methods=['GET'])
def all_items_sorted():
    
    fil = request.args.get('filter')
    category_id = request.args.get('category_id')

    try:
        # Query the OrderedItems table to get the count of each item and sort by popularity
        if fil == "popularity":

            items_popularity = db.session.query(OrderedItems.item, db.func.count(OrderedItems.item).label('popularity')).\
            group_by(OrderedItems.item).\
            order_by(db.desc('popularity')).all()

        # Prepare the response data with item_id and popularity
            response_data = [{'item_id': item_id, 'popularity': popularity} for item_id, popularity in items_popularity]

            return jsonify({'status': HTTPStatus.OK, 'popularity_list': response_data})


        if fil == "gross":    
            subquery = db.session.query(
                OrderedItems.item,
                db.func.count(OrderedItems.item).label('popularity')
            ).group_by(OrderedItems.item).subquery()

            items_popularity = db.session.query(
                subquery.c.item,
                subquery.c.popularity,
                Items.price.label('price')
            ).join(Items, Items.id == subquery.c.item).all()



        # Calculate gross income for each item (popularity * price)
            response_data = [{'item_id': item_id, 'popularity': popularity, 'gross_income': popularity * price}
                            for item_id, popularity, price in items_popularity]
            response_data = sorted(response_data, key=lambda x: x['gross_income'], reverse = True)

            return jsonify({'status': HTTPStatus.OK, 'gross_list': response_data})

        if fil == "net":    
            subquery = db.session.query(
                OrderedItems.item,
                db.func.count(OrderedItems.item).label('popularity')
            ).group_by(OrderedItems.item).subquery()

            items_popularity = db.session.query(
                subquery.c.item,
                subquery.c.popularity,
                Items.net.label('net')
            ).join(Items, Items.id == subquery.c.item).all()



        # Calculate gross income for each item (popularity * price)
            response_data = [{'item_id': item_id, 'popularity': popularity, 'net_income': popularity * price}
                            for item_id, popularity, price in items_popularity]
            response_data = sorted(response_data, key=lambda x: x['net_income'], reverse = True)

            return jsonify({'status': HTTPStatus.OK, 'net_list': response_data})
        
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Filter not found'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/manager/orderlog', methods=['GET'])
def get_orderlog():
    timespan = request.args.get('time')
    total_income = 0
    end_time = datetime.now()

    try:
        

        if timespan == 'day':
            start_time = end_time - timedelta(days=1)
        elif timespan == 'week':
            start_time = end_time - timedelta(days=7)
        elif timespan == 'month':
            start_time = end_time - timedelta(days=30)
        elif timespan == 'year':
            start_time = end_time - timedelta(days=365)
        elif timespan == 'all':
            start_time = datetime.min
        
        else:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'invalid range'})
            
        order_log = db.session.query(
            Orders.id.label('order_id'),
            OrderedItems.id.label('ordered_item_id'),
            Items.id.label('item_id'),
            Items.name.label('item_name'),
            case((OrderedItems.redeemed == True, 0),\
            else_=Items.price).label('item_price'),             
            OrderedItems.redeemed.label('item_redeemed')
        )\
        .join(OrderedItems, Orders.id == OrderedItems.order)\
        .join(Items, OrderedItems.item == Items.id)\
        .filter(
            Orders.order_date >= start_time,
            Orders.order_date <= end_time,
            Orders.paid == True,
        )\
        .group_by(Orders.id, OrderedItems.id, Items.id, Items.name, Items.price, OrderedItems.redeemed)\
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
        total = {timespan: total_income}
        
        order_log_list = sorted(order_log_list, key = lambda x: x['order_id'])

        return jsonify({'status': HTTPStatus.OK, 'orderlog': order_log_list, 'gross_income': total})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


