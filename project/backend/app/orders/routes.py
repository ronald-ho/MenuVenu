from flask import request

from .services import AssistService, TableService, OrderService
from .. import app

assist_service = AssistService()
table_service = TableService()
order_service = OrderService()


@app.route('/orders/req_assist', methods=['POST'])
def req_assist():
    data = data_logger(request)

    return assist_service.request_assist(data)


@app.route('/orders/finish_assist', methods=['POST'])
def finish_assist():
    data = data_logger(request)

    return assist_service.finish_assist(data)


@app.route('/orders/get_assist', methods=['GET'])
def get_assist():
    return assist_service.get_assist()


@app.route('/orders/pay_bill', methods=['POST'])
def pay_bill():
    data = data_logger(request)

    return table_service.pay_bill(data)


@app.route('/orders/get_bill', methods=['POST'])
def get_bill():
    data = data_logger(request)

    return table_service.get_bill(data)


@app.route('/orders/select_table', methods=['POST'])
def select_table():
    data = data_logger(request)

    return table_service.select_table(data)


@app.route('/orders/get_tables', methods=['GET'])
def get_tables():

    return table_service.get_tables()


@app.route('/orders/order_item', methods=['POST'])
def order_item():
    data = data_logger(request)

<<<<<<< HEAD
    # get item that was ordered
    item = Items.query.filter_by(name=data['name']).first()

    # get order that is associated with table
    order = Orders.query.filter_by(paid=False).filter_by(table=data['table_id']).first()

    customer = Customers.query.filter_by(id=data['customer_id'])

    # add cost of item to order total if customer did not redeem points and add any points earnable
    if not data['redeem']:

        order.total_amount = order.total_amount + item.price

        customer.points += item.points_earned

    # reduce points from customer total if customer did redeem points and has enough points (customers cannot earn points if using points purchase)
    else:
        if customer.points > item.points_to_redeem:
            customer.points -= item.points_to_redeem
        else:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Customer does not have enough points'})

    new_ordered_item = OrderedItems(
        order=order.id,
        customer=data['customer_id'],
        order_time=datetime.now(),
        item=item.id
    )

    db.session.add(new_ordered_item)
    db.session.commit()

    flag = {
        'name': item.name,
        'table_number': data['table_id']
    }

    kitchen_flags.append(flag)

    return jsonify({'status': HTTPStatus.OK, 'message': 'Item ordered'})
=======
    return order_service.order_item(data)
>>>>>>> 1b5203ce0527861fafa26a2cc276e12ffdb426f9


@app.route('/orders/kitchen/prepared', methods=['POST'])
def kitchen_prepared():
    data = data_logger(request)

    return order_service.kitchen_prepared(data)


@app.route('/orders/get_order_list', methods=['GET'])
def get_order_list():

    return order_service.get_order_list()


@app.route('/orders/get_ordered_items', methods=['POST'])
def get_ordered_items():
    data = data_logger(request)

<<<<<<< HEAD
    # get current order associated with table
    order = Orders.query.filter_by(paid=False).filter_by(table=data['table']).first()

    # get ordered items associated with order
    ordered_item_list = OrderedItems.query.filter_by(order=order.id)

    item_list = []

    # for each ordered item, get the relevant menu item
    for ordered_item in ordered_item_list:
        item = Items.query.filter_by(id=ordered_item.item).first()
        item_list.append(item.to_dict())

    return jsonify({'status': HTTPStatus.OK, 'ordered_list': item_list})
=======
    return order_service.get_ordered_items(data)
>>>>>>> 1b5203ce0527861fafa26a2cc276e12ffdb426f9


@app.route('/orders/waitstaff/served', methods=['POST'])
def waitstaff_served():
    data = data_logger(request)

    return order_service.waitstaff_served(data)


@app.route('/orders/get_serve_list', methods=['GET'])
def get_serve_list():

    return order_service.get_serve_list()


def data_logger(request):
    data = request.get_json()
    app.logger.info(f"Received request from frontend: {data}")
    return data
