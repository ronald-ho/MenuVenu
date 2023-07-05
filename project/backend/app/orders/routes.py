from datetime import datetime
from http import HTTPStatus
import logging

from flask import jsonify, request

from .. import app, db
from .models import DiningTables, OrderedItems, Orders
from app.menu.models import Items
from app.authentication.models import Customers

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#list for tables that need assistance
assistance_flags = []

#list for tables that are occupied
occupied_flags = []

#list for orders that need to be prepared
kitchen_flags = []

#list for orders that are ready to be served
serve_flags = []

@app.route('/orders/req_assist', methods=['POST'])
def req_assist():

    data = request.get_json()
    logger.info(f"Received assistance request: {data}")

    if data['table_number'] in assistance_flags:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Assistance already requested'})
    else:
        assistance_flags.append(data['table_number'])
        return jsonify({'status': HTTPStatus.OK, 'message': 'Assistance requested'})

@app.route('/orders/finish_assist', methods=['POST'])
def finish_assist():
    data = request.get_json()
    logger.info(f"Received assistance completion: {data}")

    if data['table_number'] not in assistance_flags:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Table did not need assistance'})

    else:
        assistance_flags.remove(data['table_number'])
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

        occupied_flags.append(table.table_number)

    return jsonify({'status': HTTPStatus.OK, 'message': 'Table selected'})

@app.route('/orders/get_tables', methods=['GET'])
def get_tables():

    table_list = DiningTables.query.all()

    table_list = [table.to_dict() for table in table_list]

    return jsonify({'status': HTTPStatus.OK, 'table_list': table_list, 'occupied_list': occupied_flags})

@app.route('/orders/order_item', methods=['POST'])
def order_item():
    data = request.get_json()
    logger.info(f"Received order item request: {data}")

    #get item that was ordered
    item = Items.query.filter_by(name = data['name']).first()

    #get order that is associated with table
    order = Orders.query.filter_by(paid = False).filter_by(table_id = data['table_id']).first()

    #add cost of item to order total if customer did not redeem points
    if not data['redeem']:
        order.total_amount = order.total_amount + item.price
        
    #reduce points from customer total if customer did redeem points   
    else:
        customer = Customers.query.filter_by(customer_id = data['customer_id'])
        customer.points = customer.points - item.points

    new_ordered_item = OrderedItems(
        order_id = order.order_id,
        customer_id = data['customer_id'],
        item = item.item_id
    )

    db.session.add(new_ordered_item)
    db.session.commit()

    flag = {
        'name': item.name,
        'table_number': data['table_number']
    }

    kitchen_flags.append(flag)

@app.route('/orders/kitchen/prepared', methods=['POST'])
def kitchen_prepared():
    data = request.get_json()
    logger.info(f"Received prepared item request: {data}")

    prepared_item = {
        'name': data['name'],
        'table_number': data['table_number']
    }

    if prepared_item not in kitchen_flags:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Ordered item not in kitchen list'})
    else:
        kitchen_flags.remove(prepared_item)
        serve_flags.append(prepared_item)
        return jsonify({'status': HTTPStatus.OK, 'message': 'Ordered item prepared and ready to serve'})

@app.route('/orders/get_order_list', methods=['GET'])
def get_order_list():
    
    return jsonify({'status': HTTPStatus.OK, 'order_list': kitchen_flags})

@app.route('/orders/get_ordered_items', methods=['POST'])
def get_ordered_items():
    data = request.get_json()
    logger.info(f"Received get ordered items request: {data}")

    #get current order associated with table
    order = Orders.query.filter_by(paid = False).filter_by(table_number = data['table_number']).first()

    #get ordered items associated with order
    ordered_item_list = OrderedItems.query.filter_by(order_id = order.order_id)

    item_list = []

    #for each ordered item, get the relevant menu item
    for ordered_item in ordered_item_list:
        item = Items.query.filter_by(item_id = ordered_item.item_id).first()
        item_list.append(item.to_dict())

    return item_list

@app.route('/orders/waitstaff/served', methods=['POST'])
def waitstaff_served():
    data = request.get_json()
    logger.info(f"Received served item request: {data}")

    served_item = {
        'name': data['name'],
        'table_number': data['table_number']
    }

    if served_item not in serve_flags:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Served item not in serve list'})
    else:
        serve_flags.remove(served_item)
        return jsonify({'status': HTTPStatus.OK, 'message': 'Item successfully served'})
    
@app.route('/orders/get_serve_list', methods=['GET'])
def get_serve_list():

    return jsonify({'status': HTTPStatus.OK, 'serve_list': serve_flags})
