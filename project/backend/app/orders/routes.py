from flask import request

from .services import AssistService, TableService, OrderService
from .. import app

@app.route('/orders/req_assist', methods=['POST'])
def req_assist():
    data = data_logger(request)

    return AssistService.request_assist(data)


@app.route('/orders/finish_assist', methods=['POST'])
def finish_assist():
    data = data_logger(request)

    return AssistService.finish_assist(data)


@app.route('/orders/get_assist', methods=['GET'])
def get_assist():
    return AssistService.get_assist()


@app.route('/orders/pay_bill', methods=['POST'])
def pay_bill():
    data = data_logger(request)

    return TableService.pay_bill(data)


@app.route('/orders/get_bill', methods=['POST'])
def get_bill():
    data = data_logger(request)

    return TableService.get_bill(data)


@app.route('/orders/select_table', methods=['POST'])
def select_table():
    data = data_logger(request)

    return TableService.select_table(data)


@app.route('/orders/get_tables', methods=['GET'])
def get_tables():

    return TableService.get_tables()


@app.route('/orders/order_item', methods=['POST'])
def order_item():
    data = data_logger(request)

    return OrderService.order_item(data)


@app.route('/orders/kitchen/prepared', methods=['POST'])
def kitchen_prepared():
    data = data_logger(request)

    return OrderService.kitchen_prepared(data)


@app.route('/orders/get_order_list', methods=['GET'])
def get_order_list():

    return OrderService.get_order_list()


@app.route('/orders/get_ordered_items', methods=['POST'])
def get_ordered_items():
    data = data_logger(request)

    return OrderService.get_ordered_items(data)


@app.route('/orders/waitstaff/served', methods=['POST'])
def waitstaff_served():
    data = data_logger(request)

    return OrderService.waitstaff_served(data)


@app.route('/orders/get_serve_list', methods=['GET'])
def get_serve_list():

    return OrderService.get_serve_list()


def data_logger(request):
    data = request.get_json()
    app.logger.info(f"Received request from frontend: {data}")
    return data
