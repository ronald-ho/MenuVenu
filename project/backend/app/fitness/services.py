from http import HTTPStatus

import requests
from flask import jsonify


class FitnessService:
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
            return response.json()['error']['message'].split(": ", 1)[1]

        return response.json()['dataStreamId']

    @staticmethod
    def parse_food_name(food_name):
        params = {
            'app_id': '22a6c878',
            'app_key': '2c9b35883410bc96e8fcee4f06137996',
            'ingr': food_name
        }

        response = requests.get('https://api.edamam.com/api/food-database/v2/parser', params=params)

        for hint in response.json()['hints']:
            food = hint['food']
            if food['label'].lower() == food_name.lower() or food['knownAs'].lower() == food_name.lower():
                return food['foodId']

        return None

    @staticmethod
    def get_food_nutrition_info(food_id):
        params = {
            'app_id': '22a6c878',
            'app_key': '2c9b35883410bc96e8fcee4f06137996'
        }

        body = {
            "ingredients": [
                {
                    "quantity": 1,
                    "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_unit",
                    "qualifiers": [
                        "http://www.edamam.com/ontologies/edamam.owl#Qualifier_whole"
                    ],
                    "foodId": food_id
                }
            ]
        }

        response = requests.post('https://api.edamam.com/api/food-database/v2/nutrients', params=params, json=body)
        
        total_nutrients = response.json()['totalNutrients']

        food_data = {
            'calories': response.json()['calories'],
            'fat_total': total_nutrients['FAT']['quantity'],
            'fat_saturated': total_nutrients['FASAT']['quantity'],
            'fat_polyunsaturated': total_nutrients['FAPU']['quantity'],
            'fat_monounsaturated': total_nutrients['FAMS']['quantity'],
            'fat_trans': total_nutrients['FATRN']['quantity'],
            'cholesterol': total_nutrients['CHOLE']['quantity'],
            'sodium': total_nutrients['NA']['quantity'],
            'potassium': total_nutrients['K']['quantity'],
            'carbs_total': total_nutrients['CHOCDF']['quantity'],
            'dietary_fiber': total_nutrients['FIBTG']['quantity'],
            'sugar': total_nutrients['SUGAR']['quantity'],
            'protein': total_nutrients['PROCNT']['quantity']
        }

        return food_data

    @staticmethod
    def add_nutrition_data(token, start_time, end_time, data_source_id, food_name):
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

        food_data = FitnessService.get_food_nutrition_info(food_name)

        body = {
            "minStartTimeNs": start_time,
            "maxEndTimeNs": end_time,
            "dataSourceId": data_source_id,
            "point": [
                {
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
                                    "key": "fat.saturated",
                                    "value": {"fpVal": food_data['fat_saturated']}
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
                                    "key": "dietary_fiber",
                                    "value": {"fpVal": food_data['dietary_fiber']}
                                },
                                {
                                    "key": "potassium",
                                    "value": {"fpVal": food_data['potassium']}
                                }
                            ]
                        },
                        {
                            "intVal": 1
                        },
                        {
                            "strVal": food_name
                        }
                    ]
                }
            ]
        }

        response = requests.post(f'https://www.googleapis.com/fitness/v1/users/me/dataSources/raw:com.google.nutrition:155679089529:MenuVenu/datasets/{start_time}-{end_time}', headers=headers, json=body)

        if response.status_code == 404:
            return response.json()['error']['message'].split(": ", 1)[1]

        elif response.status_code == 200:
            return jsonify({'status': HTTPStatus.OK, 'message': 'Food data inputted'})
