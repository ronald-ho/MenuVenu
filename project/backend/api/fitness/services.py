import time
from datetime import datetime
from functools import lru_cache
from http import HTTPStatus

import pytz
import requests
from flask import current_app as app
from flask import jsonify

from ..menu.models import Items
from ..orders.models import Orders, OrderedItems


class FitnessService:

    @staticmethod
    def create_and_store_nutrition(google_token, order_date, table_number):
        # Create a new data stream in google fit to store the nutrition data
        # If the data stream already exists, it will return the existing data stream id
        data_stream_id = NutrientService.create_new_nutrition_data_source(google_token)

        # Get the order for the table
        order = FitnessService.get_order(table_number)

        # Get the names of the ordered items in a list of strings
        ordered_items = FitnessService.get_ordered_items_names(order)

        # Get the start and end time of the order in nanoseconds
        start_time = int(order_date.timestamp() * 1e9)

        # Get the food info list and the list of foods that could not be automatically added
        error_foods, food_info_list = FitnessService.get_food_info_list(ordered_items)

        NutrientService.add_nutrition_data(google_token, start_time, data_stream_id, food_info_list)

        if len(error_foods) > 0:
            return jsonify(
                {'status': HTTPStatus.BAD_REQUEST, 'message': 'Some food items were not automatically added, '
                                                              'please add them manually', 'foods': error_foods})

        return jsonify({'status': HTTPStatus.OK, 'message': 'Nutrition data added'})

    @staticmethod
    def get_headers(google_token):
        return {
            'Authorization': f'Bearer {google_token}',
            'Content-Type': 'application/json'
        }

    @staticmethod
    def get_start_and_end_time():
        now = datetime.now(pytz.timezone('Australia/Sydney'))
        today = datetime(now.year, now.month, now.day, tzinfo=now.tzinfo)

        start_time = int(today.timestamp() * 1000)
        current_time = int(now.timestamp() * 1000)

        return start_time, current_time

    @staticmethod
    def get_body(start_time, current_time):
        return {
            'aggregateBy': [{'dataTypeName': 'com.google.calories.expended'}],
            'bucketByTime': {'durationMillis': current_time - start_time},
            'startTimeMillis': start_time,
            'endTimeMillis': current_time
        }

    @staticmethod
    def get_expended_calories(google_token):
        if google_token is None:
            return 0

        headers = FitnessService.get_headers(google_token)

        start_time, current_time = FitnessService.get_start_and_end_time()

        body = FitnessService.get_body(start_time, current_time)

        response = requests.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                                 headers=headers, json=body)

        if response.status_code == 401:
            return 0

        bucket = response.json()['bucket'][0]['dataset'][0]['point']

        return 0 if len(bucket) == 0 else round(bucket[0]['value'][0]['fpVal'])

    @staticmethod
    def get_order(table_number):
        return Orders.query.filter_by(paid=False).filter_by(table=table_number).first()

    @staticmethod
    def get_ordered_items_names(order):
        ordered_items = []
        ordered_item_list = OrderedItems.query.filter_by(order=order.id)

        for ordered_item in ordered_item_list:
            item = Items.query.filter_by(id=ordered_item.item).first()
            ordered_items.append(item.name)

        return ordered_items

    @staticmethod
    def get_food_info_list(ordered_items):
        error_foods = []
        food_info_list = []

        for food in ordered_items:
            food_id_tuple = NutrientService.parse_food_name(food)

            if food_id_tuple is None:
                error_foods.append(food)
                continue

            food_nutrition_info = NutrientService.get_food_nutrition_info(food_id_tuple)

            if food_nutrition_info is None:
                error_foods.append(food)
                continue

            food_info_list.append((food_nutrition_info, food))

        return error_foods, food_info_list


class NutrientService:

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
    @lru_cache(maxsize=128)
    def parse_food_name(food_name):
        params = {
            'app_id': '22a6c878',
            'app_key': '2c9b35883410bc96e8fcee4f06137996',
            'ingr': food_name
        }

        response = requests.get('https://api.edamam.com/api/food-database/v2/parser', params=params)

        app.logger.info(f"\nPARSING Food name: {food_name}\n")

        food_id_list = []

        if len(response.json()['hints']) == 0 and len(response.json()['parsed']) == 0:
            return None

        for hint in response.json()['hints']:
            food = hint['food']
            measures = hint['measures']
            if food_name.lower() == food['label'].lower() or food_name.lower() in food['knownAs'].lower():
                food_id_list.append((food['foodId'], measures[0]['uri']))

        return tuple(food_id_list)

    @staticmethod
    @lru_cache(maxsize=128)
    def get_food_nutrition_info(food_id_tuple):

        for food_id, measure_uri in list(food_id_tuple):
            params = {
                'app_id': '22a6c878',
                'app_key': '2c9b35883410bc96e8fcee4f06137996'
            }

            body = {
                "ingredients": [
                    {
                        "quantity": 1,
                        "measureURI": measure_uri,
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

                return food_data

        return None

    @staticmethod
    def add_nutrition_data(token, start_time, data_source_id, food_info_list):
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

        nutrient_items = []

        temp_start_time = start_time
        temp_end_time = time.time_ns()

        for food_data, food_name in food_info_list:
            nutrient_items.append({
                "startTimeNanos": temp_start_time,
                "endTimeNanos": temp_end_time,
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
                        "intVal": NutrientService.get_meal_type()
                    },
                    {
                        "strVal": food_name
                    }
                ]
            })

            temp_start_time = temp_end_time
            temp_end_time = time.time_ns()

        body = {
            "minStartTimeNs": start_time,
            "maxEndTimeNs": temp_start_time,
            "dataSourceId": data_source_id,
            "point": nutrient_items
        }

        response = requests.patch(
            "https://www.googleapis.com/fitness/v1/users/me/dataSources/raw:com.google.nutrition:155679089529:MenuVenu/datasets/1",
            headers=headers, json=body)

        if response.status_code == 404:
            app.logger.info("Erorr adding nutrition data")
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Error adding nutrition data'})

        elif response.status_code == 200:
            app.logger.info(f"Nutrition data inputted")
            return jsonify({'status': HTTPStatus.OK, 'message': 'Food data inputted'})

    @staticmethod
    def get_meal_type():
        current_time = datetime.now(pytz.timezone('Australia/Sydney'))
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
