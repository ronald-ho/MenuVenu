from datetime import datetime, timedelta
from http import HTTPStatus

from flask import jsonify
from sqlalchemy import func, case

from .models import Restaurants
from .. import db
from ..menu.models import Items
from ..orders.models import OrderedItems, Orders


class RestaurantService:
    @staticmethod
    def create_default_restaurant():
        if Restaurants.query.count() == 0:
            new_restaurant = Restaurants(
                name='MenuVenu',
                phone='0422222222'
            )

            new_restaurant.set_manager_password('MenuVenu')
            new_restaurant.set_staff_password('MenuVenu')

            db.session.add(new_restaurant)


class ItemPopularityService:
    @staticmethod
    def get_item_popularity():
        subquery = db.session.query(
            OrderedItems.item,
            db.func.count(OrderedItems.item).label('popularity')
        ).group_by(OrderedItems.item).subquery()

        return db.session.query(
            subquery.c.item,
            subquery.c.popularity,
            Items.name.label('name'),
            Items.category.label('category'),
            Items.price.label('price'),
            Items.net.label('net')
        ).join(Items, Items.id == subquery.c.item).order_by(db.desc(subquery.c.popularity)).all()


class ItemFilter:
    def __init__(self, filter_by, category, item_popularity_service=None):
        self.filter_by = filter_by
        self.category = category
        self.items_popularity_service = item_popularity_service or ItemPopularityService()
        self.filters = {
            'popularity': self.get_popularity,
            'gross': self.get_income('gross_income'),
            'net': self.get_income('net_income'),
        }

    def filter_items(self):
        items_popularity = self.items_popularity_service.get_item_popularity()
        processed_data = self.process_query(items_popularity)

        filter_function = self.filters.get(self.filter_by)
        if not filter_function:
            return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Filter not found'})

        return filter_function(processed_data)

    def process_query(self, items_popularity):
        response_data = [{
            'item_id': item_id,
            'popularity': popularity,
            'name': name,
            'category': category,
            'gross_income': (popularity or 0) * (price or 0),
            'net_income': (popularity or 0) * (net or 0)
        } for item_id, popularity, name, category, price, net in items_popularity]

        if self.category:
            response_data = list(filter(lambda item: item.get('category') == self.category, response_data))

        return response_data

    def get_income(self, income_type):
        def inner(data):
            return jsonify({'status': HTTPStatus.OK, 'list': sorted(data, key=lambda x: x[income_type], reverse=True)})

        return inner

    def get_popularity(self, data):
        return jsonify({'status': HTTPStatus.OK, 'list': data})


class OrderLogger:
    def __init__(self, time_span, item_id=None):
        self.time_span = time_span
        self.end_time = datetime.now()
        self.start_time = TimeConversion.validate_time_span(time_span)
        self.item_id = item_id

    def get_order_log(self):
        order_log = db.session.query(
            Orders.id.label('order_id'),
            OrderedItems.id.label('ordered_item_id'),
            Items.id.label('item_id'),
            Items.name.label('item_name'),
            func.count(OrderedItems.item).label('item_popularity'),
            case((OrderedItems.redeemed == True, 0), else_=Items.price).label('item_price'),
            case((OrderedItems.redeemed == True, 0 - Items.price), else_=Items.net).label('item_net'),
            OrderedItems.redeemed.label('item_redeemed'),
            Items.category.label('category_id'),
            OrderedItems.order_time.label('time')
        ) \
            .join(OrderedItems, Orders.id == OrderedItems.order) \
            .join(Items, OrderedItems.item == Items.id) \
            .filter(
            Orders.order_date >= self.start_time,
            Orders.order_date <= self.end_time,
            Orders.paid == True,
            Items.id == self.item_id  # EXTRA FILTER
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


class TimeConversion:
    @staticmethod
    def convert_time_span(time_span):
        end_time = datetime.now()

        time_mapping = {
            'day': end_time - timedelta(days=1),
            'week': end_time - timedelta(days=7),
            'month': end_time - timedelta(days=30),
            'year': end_time - timedelta(days=365),
            'all': datetime.min
        }

        return time_mapping.get(time_span)

    @staticmethod
    def validate_time_span(time_span):
        start_time = TimeConversion.convert_time_span(time_span)
        if not start_time:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'invalid range'})
        return start_time
