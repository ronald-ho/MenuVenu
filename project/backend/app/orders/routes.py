from flask import request, Blueprint

from .services import AssistService, TableService, OrderService
from .. import app

orders = Blueprint('orders', __name__)


@orders.route('/req_assist', methods=['POST'])
def req_assist():
    data = data_logger(request)

    return AssistService.request_assist(data)


@orders.route('/finish_assist', methods=['POST'])
def finish_assist():
    data = data_logger(request)

    return AssistService.finish_assist(data)


@orders.route('/get_assist', methods=['GET'])
def get_assist():
    return AssistService.get_assist()


@orders.route('/pay_bill', methods=['POST'])
def pay_bill():
    data = data_logger(request)

    return TableService.pay_bill(data)


@orders.route('/get_bill', methods=['POST'])
def get_bill():
    data = data_logger(request)

    return TableService.get_bill(data)


@orders.route('/select_table', methods=['POST'])
def select_table():
    data = data_logger(request)

    return TableService.select_table(data)


@orders.route('/get_tables', methods=['GET'])
def get_tables():
    return TableService.get_tables()


@orders.route('/order_item', methods=['POST'])
def order_item():
    data = data_logger(request)

    return OrderService.order_item(data)


@orders.route('/kitchen/prepared', methods=['POST'])
def kitchen_prepared():
    data = data_logger(request)

    return OrderService.kitchen_prepared(data)


@orders.route('/get_order_list', methods=['GET'])
def get_order_list():
    return OrderService.get_order_list()


@orders.route('/get_ordered_items', methods=['POST'])
def get_ordered_items():
    data = data_logger(request)

    return OrderService.get_ordered_items(data)


@orders.route('/waitstaff/served', methods=['POST'])
def waitstaff_served():
    data = data_logger(request)

    return OrderService.waitstaff_served(data)


@orders.route('/get_serve_list', methods=['GET'])
def get_serve_list():
    return OrderService.get_serve_list()


def data_logger(request):
    data = request.get_json()
    app.logger.info(f"Received request from frontend: {data}")
    return data
