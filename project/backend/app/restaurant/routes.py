from flask import request
from dataclasses import dataclass
from http import HTTPStatus
from flask import jsonify

from sqlalchemy.sql import func
from builtins import sorted
from .. import db
from ..orders.models import OrderedItems
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

