import time
from datetime import datetime
from http import HTTPStatus

import pytz
import requests
from flask import jsonify

from ..menu.models import Items
from ..orders.models import Orders, OrderedItems

from .. import app


class FitnessService:

    @staticmethod
    def get_expended_calories(google_token):

        if google_token is None:
            return 0

        headers = {
            'Authorization': f'Bearer {google_token}',
            'Content-Type': 'application/json'
        }

        sydney_tz = pytz.timezone('Australia/Sydney')

        now = datetime.now(sydney_tz)
        today = datetime(now.year, now.month, now.day, tzinfo=sydney_tz)

        start_time = int(today.timestamp() * 1000)
        current_time = int(now.timestamp() * 1000)

        body = {
            'aggregateBy': [{
                'dataTypeName': 'com.google.calories.expended'
            }],
            'bucketByTime': {
                'durationMillis': current_time - start_time
            },
            'startTimeMillis': start_time,
            'endTimeMillis': current_time
        }

        response = requests.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', headers=headers,
                                 json=body)

        bucket = response.json()['bucket'][0]['dataset'][0]['point']

        if len(bucket) == 0:
            return 0

        return round(bucket[0]['value'][0]['fpVal'])

    @staticmethod
    def create_and_store_nutrition(google_token, order_date, table_number):
        from ..orders.services import OrderService

        data_stream_id = FitnessService.create_new_nutrition_data_source(google_token)

        order = Orders.query.filter_by(paid=False).filter_by(table=table_number).first()

        ordered_item_list = OrderedItems.query.filter_by(order=order.id)

        ordered_items = []

        for ordered_item in ordered_item_list:
            item = Items.query.filter_by(id=ordered_item.item).first()
            ordered_items.append(item.name)

        start_time = int(order_date.timestamp() * 1e9)
        end_time = time.time_ns()

        error_foods = []
        food_info_list = []

        for food in ordered_items:

            food_id_list = FitnessService.parse_food_name(food)

            if food_id_list is None:
                error_foods.append(food)

            food_nutrition_info = FitnessService.get_food_nutrition_info(food_id_list)

            app.logger.info(f"Food nutrition info: {food_nutrition_info}")

            if food_nutrition_info is None:
                error_foods.append(food)
            else:
                food_info_list.append((food_nutrition_info, food))

        FitnessService.add_nutrition_data(google_token, start_time, end_time, data_stream_id, food_info_list)

        if len(error_foods) > 0:
            return jsonify(
                {'status': HTTPStatus.BAD_REQUEST, 'message': 'Some food items were not automatically added, '
                                                              'please add them manually', 'foods': error_foods})

        return jsonify({'status': HTTPStatus.OK, 'message': 'Nutrition data added'})

    @staticmethod
    def create_new_nutrition_data_source(token):
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

        body = {
            "dataStreamName": "MenuVenu",
            "type": "raw",
            "application": {
                "name": "MenuVenu"
            },
            "dataType": {
                "name": "com.google.nutrition"
            }
        }

        response = requests.post('https://www.googleapis.com/fitness/v1/users/me/dataSources', headers=headers,
                                 json=body)

        if response.status_code == 409:
            return "raw:com.google.nutrition:155679089529:MenuVenu"

        return response.json()['dataStreamId']

    @staticmethod
    def parse_food_name(food_name):
        params = {
            'app_id': '22a6c878',
            'app_key': '2c9b35883410bc96e8fcee4f06137996',
            'ingr': food_name
        }

        response = requests.get('https://api.edamam.com/api/food-database/v2/parser', params=params)

        app.logger.info(f"\n\n\n\n\nPARSING Food name: {food_name}\n\n\n\n\n")

        food_id_list = []

        if len(response.json()['parsed']) > 0:
            food_id_list.append(response.json()['parsed'][0]['food']['foodId'])

        for hint in response.json()['hints']:
            food = hint['food']
            if food_name.lower() == food['label'].lower() or food_name.lower() in food['knownAs'].lower():
                food_id_list.append(food['foodId'])

        return food_id_list

    @staticmethod
    def get_food_nutrition_info(food_id_list):

        nutrients_found = False

        for food_id in food_id_list:
            params = {
                'app_id': '22a6c878',
                'app_key': '2c9b35883410bc96e8fcee4f06137996'
            }

            body = {
                "ingredients": [
                    {
                        "quantity": 1,
                        "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_unit",
                        "foodId": food_id
                    }
                ]
            }

            response = requests.post('https://api.edamam.com/api/food-database/v2/nutrients', params=params, json=body)

            if response.json()['totalNutrients']:
                total_nutrients = response.json()['totalNutrients']

                food_data = {
                    'calories': response.json().get('calories', 0),
                    'fat_total': total_nutrients.get('FAT', {}).get('quantity', 0),
                    'cholesterol': total_nutrients.get('CHOLE', {}).get('quantity', 0),
                    'sodium': total_nutrients.get('NA', {}).get('quantity', 0),
                    'potassium': total_nutrients.get('K', {}).get('quantity', 0),
                    'carbs_total': total_nutrients.get('CHOCDF', {}).get('quantity', 0),
                    'sugar': total_nutrients.get('SUGAR', {}).get('quantity', 0),
                    'protein': total_nutrients.get('PROCNT', {}).get('quantity', 0)
                }

                app.logger.info(f"GET FOOD NUTRITIONAL DATA: \n\n\n\n\n{food_data}\n\n\n\n\n")

                nutrients_found = True

                return food_data

        if not nutrients_found:
            return None

    @staticmethod
    def add_nutrition_data(token, start_time, end_time, data_source_id, food_info_list):
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

        nutrient_items = []

        for food_data, food_name in food_info_list:
            nutrient_items.append({
                "startTimeNanos": start_time,
                "endTimeNanos": end_time,
                "dataTypeName": "com.google.nutrition",
                "value": [
                    {
                        "mapVal": [
                            {
                                "key": "fat.total",
                                "value": {"fpVal": food_data['fat_total']}
                            },
                            {
                                "key": "protein",
                                "value": {"fpVal": food_data['protein']}
                            },
                            {
                                "key": "carbs.total",
                                "value": {"fpVal": food_data['carbs_total']}
                            },
                            {
                                "key": "cholesterol",
                                "value": {"fpVal": food_data['cholesterol']}
                            },
                            {
                                "key": "calories",
                                "value": {"fpVal": food_data['calories']}
                            },
                            {
                                "key": "sugar",
                                "value": {"fpVal": food_data['sugar']}
                            },
                            {
                                "key": "potassium",
                                "value": {"fpVal": food_data['potassium']}
                            },
                            {
                                "key": "sodium",
                                "value": {"fpVal": food_data['sodium']}
                            }
                        ]
                    },
                    {
                        "intVal": FitnessService.get_meal_type()
                    },
                    {
                        "strVal": food_name
                    }
                ]
            })

        body = {
            "minStartTimeNs": start_time,
            "maxEndTimeNs": end_time,
            "dataSourceId": data_source_id,
            "point": nutrient_items
        }

        app.logger.info(f"BODY SENT TO GOOGLE FITNESS: \n\n\n\n\n{body}\n\n\n\n\n")

        response = requests.patch(
            f"https://www.googleapis.com/fitness/v1/users/me/dataSources/raw:com.google.nutrition:155679089529:MenuVenu/datasets/{start_time}-{end_time}",
            headers=headers, json=body)

        app.logger.info(f"RESPONSE STATUS CODE: \n\n\n\n\n{response.text}\n\n\n\n\n")

        if response.status_code == 404:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Error adding nutrition data'})

        elif response.status_code == 200:
            return jsonify({'status': HTTPStatus.OK, 'message': 'Food data inputted'})

    @staticmethod
    def get_meal_type():
        current_time = datetime.now()
        if 4 <= current_time.hour < 12:
            return 2
        elif 12 <= current_time.hour < 17:
            return 3
        elif 17 <= current_time.hour < 22:
            return 4
        elif current_time.hour >= 22 or current_time.hour < 4:
            return 5
        else:
            return 1
