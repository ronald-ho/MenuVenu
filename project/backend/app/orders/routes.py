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

    assistance_flags.remove(table.table_number)

    return jsonify({'status': HTTPStatus.OK, 'message': 'Assistance completed'})

@app.route('/orders/get_assist', methods=['GET'])
def get_assist():

    return jsonify({'status': HTTPStatus.OK, 'assistance_list': assistance_flags})

@app.route('/orders/bill', methods=['POST'])
def bill():

    data = request.get_json()
    logger.info(f"Received bill request: {data}")

    #find order associated with table
    table = DiningTables.query.filter_by(table_number=data['table_number']).first()
    order = Orders.query.filter_by(paid = False).filter_by(table_id = table.table_id).first()

    if not order:
        return jsonify({'status': HTTPStatus.OK, 'bill': order.total_amount})

    order.paid = True
    db.session.commit()
    occupied_flags.remove(table.table_number)

    return jsonify({'status': HTTPStatus.OK, 'bill': order.total_amount})

@app.route('/orders/select_table', methods=['POST'])
def select_table():

    data = request.get_json()
    logger.info(f"Received table selection request: {data}")

    #get table that was selected
    table = DiningTables.query.filter_by(table_number=data['table_number']).first()

    if table.table_number in occupied_flags:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Table is occupied'})
    else:
        occupied_flags.append(table.table_number)
        return jsonify({'status': HTTPStatus.OK, 'message': 'Table selected'})


@app.route('/orders/get_tables', methods=['GET'])
def get_tables():

    table_list = DiningTables.query.all()
    occupied_list = occupied_flags

    table_list = [table.to_dict() for table in table_list]

    return jsonify({'status': HTTPStatus.OK, 'table_list': table_list, 'occupied_list': occupied_list})