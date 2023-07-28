import time
from datetime import datetime
from http import HTTPStatus

import requests
from flask import jsonify, request

from .services import FitnessService
from .. import app, db


@app.route('/fitness/google/auth', methods=['POST'])
def google_auth():
    data = data_logger(request)

    code = data['code']

    payload = {
        'code': code,
        'client_id': '155679089529-vgjnspusl7a28vt5m4r0jsu2o31rvdhq.apps.googleusercontent.com',
        'client_secret': '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',
        'redirect_uri': 'http://localhost:3000/fitness',
        'grant_type': 'authorization_code'
    }

    response = requests.post('https://oauth2.googleapis.com/token', data=payload)
    token = response.json()['access_token']

    return jsonify({'status': HTTPStatus.OK, 'message': 'Google Auth successful', 'token': token})


@app.route('/fitness/get_calories', methods=['POST'])
def get_calories():
    data = data_logger(request)
    token = data['token']

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    now = datetime.now()
    today = datetime(now.year, now.month, now.day)

    current_time = int(time.mktime(now.timetuple()) * 1e3)
    start_time = int(time.mktime(today.timetuple()) * 1e3)

    body = {
        'aggregateBy': [{
            'dataTypeName': 'com.google.calories.expended'
        }],
        'bucketByTime': {
            'durationMillis': 86400000
        },
        'startTimeMillis': start_time,
        'endTimeMillis': current_time
    }

    response = requests.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', headers=headers,
                             json=body)

    calories = response.json()['bucket'][0]['dataset'][0]['point'][0]['value'][0]['fpVal']

    return jsonify({'status': HTTPStatus.OK, 'message': 'Calories retrieved', 'calories': calories})


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
