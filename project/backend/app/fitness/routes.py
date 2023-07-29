import time
from datetime import datetime, timedelta
from http import HTTPStatus

import requests
from flask import jsonify, request

from .services import FitnessService
from .. import app, db
from ..authentication.models import Customers


@app.route('/fitness/token/store', methods=['POST'])
def store_token():
    data = data_logger(request)

    token = data['token']
    customer_id = data['id']

    customer = Customers.query.filter_by(id=customer_id).first()
    customer.google_token = token
    customer.google_token_expire = datetime.utcnow() + timedelta(hours=1)

    db.session.commit()

    return jsonify({'status': HTTPStatus.OK, 'message': 'Token stored'})

@app.route('/fitness/nutrition/data', methods=['POST'])
def log_nutrition_data():
    data = data_logger(request)
    token = data['token']
    food_items = data['food_items']
    order_id = data['order_id']

    order = db.query.filter_by(id=order_id).first()

    if order is None:
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Order not found'})

    start_time = int(order.order_date.timestamp() * 1e9)
    end_time = time.time_ns()

    error_foods = []

    data_stream_id = FitnessService.create_new_nutrition_data_source(token)

    for food in food_items:
        food_name = food['name']

        food_id = FitnessService.parse_food_name(food_name)

        if food_id is None:
            error_foods.append(food_name)

        food_nutrition_info = FitnessService.get_food_nutrition_info(food_id)

        FitnessService.add_nutrition_data(token, start_time, end_time, data_stream_id, food_nutrition_info)

    if len(error_foods) > 0:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Some food items were not automatically added, '
                                                                     'please add them manually', 'foods': error_foods})

    return jsonify({'status': HTTPStatus.OK, 'message': 'Nutrition data added'})


def data_logger(request):
    data = request.get_json()
    app.logger.info(f"Received request from frontend: {data}")
    return data
