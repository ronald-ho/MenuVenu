from datetime import datetime
from http import HTTPStatus
import logging

from flask import jsonify, request

from .. import app, db
from .models import DiningTables, OrderedItems, Orders

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#list for tables that need assistance
assistance_flags = []

#list for tables that are occupied
occupied_flags = []

@app.route('/orders/req_assist', methods=['POST'])
def req_assist():

    data = request.get_json()
    logger.info(f"Received assistance request: {data}")

    #get table that needs assistance
    table = DiningTables.query.filter_by(table_number=data['table_number']).first()

    if table.table_number in assistance_flags:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Assistance already requested'})
    else:
        assistance_flags.append(table.table_number)
        return jsonify({'status': HTTPStatus.OK, 'message': 'Assistance requested'})

@app.route('/orders/finish_assist', methods=['POST'])
def finish_assist():
    data = request.get_json()
    logger.info(f"Received assistance completion: {data}")

    #get table where assistance is completed
    table = DiningTables.query.filter_by(table_number=data['table_number']).first()

    if table.table_number not in assistance_flags:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Table did not need assistance'})

    else:
        assistance_flags.remove(table.table_number)
        return jsonify({'status': HTTPStatus.OK, 'message': 'Assistance completed'})

@app.route('/orders/get_assist', methods=['GET'])
def get_assist():

    return jsonify({'status': HTTPStatus.OK, 'assistance_list': assistance_flags})

@app.route('/orders/pay_bill', methods=['POST'])
def pay_bill():

    data = request.get_json()
    logger.info(f"Received pay bill request: {data}")

    #find order associated with table
    table = DiningTables.query.filter_by(table_number=data['table_number']).first()
    order = Orders.query.filter_by(paid = False).filter_by(table_id = table.table_id).first()

    if not order:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Order does not exist'})

    order.paid = True
    db.session.commit()
    occupied_flags.remove(table.table_number)

    return jsonify({'status': HTTPStatus.OK, 'message': 'Order paid'})

@app.route('/orders/get_bill', methods=['POST'])
def get_bill():

    data = request.get_json()
    logger.info(f"Received get bill request: {data}")

    #find order associated with table
    table = DiningTables.query.filter_by(table_number=data['table_number']).first()
    order = Orders.query.filter_by(paid = False).filter_by(table_id = table.table_id).first()
    
    if not order:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Order does not exist'})
    
    return jsonify({'status': HTTPStatus.OK, 'bill': order.total_amount})
    
@app.route('/orders/select_table', methods=['POST'])
def select_table():

    data = request.get_json()
    logger.info(f"Received table selection request: {data}")

    #get table that was selected
    table = DiningTables.query.filter_by(table_number=data['table_number']).first()

    occupied_flags.append(table.table_number)

    #creates a new order for table if it was not occupied yet
    if table.table_number not in occupied_flags:

        new_order = Orders(
            table_id = table.table_number,
            order_date = datetime.now(),
            total_amount = 0,
            paid = False
        )

        db.session.add(new_order)
        db.session.commit()

    return jsonify({'status': HTTPStatus.OK, 'message': 'Table selected'})

@app.route('/orders/get_tables', methods=['GET'])
def get_tables():

    table_list = DiningTables.query.all()

    table_list = [table.to_dict() for table in table_list]

    return jsonify({'status': HTTPStatus.OK, 'table_list': table_list, 'occupied_list': occupied_flags})