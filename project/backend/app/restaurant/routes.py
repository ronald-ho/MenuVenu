from flask import request
from dataclasses import dataclass
from http import HTTPStatus
from flask import jsonify

from sqlalchemy.sql import func

from .. import db
from ..menu.models import Items
from .. import app

# Popularity Profit Money Per week/month/year etc
# Popularity Profit Money Per Category
# Popularity Profit Money Per Ingredient





# Route to get all items sorted by popularity
@app.route('/manager/items/popularity', methods=['GET'])
def all_items_sorted(fil, category_id):
    
    try:
        # Query the OrderedItems table to get the count of each item and sort by popularity
        if fil == "popularity":

            items_popularity = db.session.query(OrderedItems.item, db.func.count(OrderedItems.item).label('popularity')).\
            group_by(OrderedItems.item).\
            order_by(db.desc('popularity')).all()

        # Prepare the response data with item_id and popularity
            response_data = [{'item_id': item_id, 'popularity': popularity} for item_id, popularity in items_popularity]

            return jsonify(response_data), 200

# NOT TESTED
        if fil == "gross"    
            items_popularity = db.session.query(
            OrderedItems.item,
            db.func.count(OrderedItems.item).label('popularity'),
            Items.price.label('price')
        ).join(Items, Items.id == OrderedItems.item). \
            group_by(OrderedItems.item).all()

        # Calculate gross income for each item (popularity * price)
        response_data = [{'item_id': item_id, 'popularity': popularity, 'gross_income': popularity * price}
                         for item_id, popularity, price in items_popularity]

        return jsonify(response_data), 200

        if fil == "net"    
            items_popularity = db.session.query(
            OrderedItems.item,
            db.func.count(OrderedItems.item).label('popularity'),
            Items.price.label('price')
            Items.production.label('production')
        ).join(Items, Items.id == OrderedItems.item). \
            group_by(OrderedItems.item).all()

        # Calculate gross income for each item (popularity * price - production costs)
        response_data = [{'item_id': item_id, 'popularity': popularity, 'net_income': popularity * (price - production)}
                         for item_id, popularity, price in items_popularity]

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Popularity of specific 

@app.route('/manager/statistics/popularity', methods=['GET'])
def item_popularity(item_id, time_frame, ingre):
    try:
        # Query the OrderedItems table to get the count of the given item_id
        popularity_count = db.session.query(OrderedItems).filter_by(item=item_id).count()

        return jsonify({'item_id': item_id, 'popularity': popularity_count}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500