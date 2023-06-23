from flask import request, jsonify
from .. import app, db
from services import User_service
from http import HTTPStatus
from models import DiningTables
from models import Orders
from models import OrderedItems

@app.route('orders/req_assist', methods=['POST'])
def req_assist():

    data = request.get_json()

    #get table that needs assistance
    table = DiningTables.query.filter_by(table_number=data['table_number']).first()

    if table.needs_assistance = True:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Assistance already requested'})
    else:
        table.needs_assistance = True
        return jsonify({'status': HTTPStatus.OK, 'message': 'Assistance requested'})

@app.route('orders/finish_assist', methods=['POST'])
def finish_assist():
    data = request.get_json()

    #get table where assistance is completed
    table = DiningTables.query.filter_by(table_number=data['table_number']).first()

    table.needs_assistance = False

    return jsonify({'status': HTTPStatus.OK, 'message': 'Assistance completed'})

@app.route('orders/get_assist', methods=['GET'])
def get_assist():

    #get tables that need assistance
    table_list = DiningTables.query.filter_by(needs_assistance = True)
    
    table_number_list = []
    for table in table_list:
        table_number_list.append(table.table_number)

    return jsonify({'status': HTTPStatus.OK, 'table_number_list': table_number_list})

@app.route('orders/bill', methods=['POST'])
def bill():

    data = request.get_json()

    #find order associated with table
    table = DiningTables.query.filter_by(table_number=data['table_number']).first()
    order = Orders.query.filter_by(paid = False).filter_by(table_id = table.table_id).first()

    order.paid = True

    return jsonify({'status': HTTPStatus.OK, 'bill': order.total_amount})

@app.route('orders/get_tables', methods['GET'])
def get_tables:

    #get all tables
    table_list = DiningTables.query.select()

    return jsonify({'status': HTTPStatus.OK, 'table_list': table_list})