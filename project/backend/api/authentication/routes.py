from http import HTTPStatus

from flask import current_app as app
from flask import jsonify, request, Blueprint

from .services import CustomerService, ResetService, StaffService, ManagerService
from ..utilities import Helper

auth = Blueprint('auth', __name__)


@auth.route('/register', methods=['POST'])
def register_customer():
    data = Helper.data_logger(request)

    return CustomerService.create_new_customer(data)


@auth.route('/login', methods=['POST'])
def login_customer():
    data = Helper.data_logger(request)

    return CustomerService.login_customer(data)


@auth.route('/login/staff/kitchen', methods=['POST'])
def login_kitchen_staff():
    data = Helper.data_logger(request)

    return StaffService.login_kitchen_staff(data)


@auth.route('/login/staff', methods=['POST'])
def login_staff():
    data = Helper.data_logger(request)

    return StaffService.login_staff(data)


@auth.route('/login/manager', methods=['POST'])
def login_manager():
    data = Helper.data_logger(request)

    return ManagerService.login_manager(data)


@auth.route('/logout', methods=['POST'])
def logout_customer():
    # might have to introduce tokens
    return jsonify({'status': HTTPStatus.OK, 'message': 'Logout successful'})


@auth.route('/delete', methods=['DELETE'])
def delete_customer():
    data = Helper.data_logger(request)

    return CustomerService.delete_customer(data)


@auth.route('/update', methods=['PUT'])
def update_customer():
    data = Helper.data_logger(request)

    return CustomerService.update_customer(data)


@auth.route('/reset/password/request', methods=['POST'])
def generate_OTP():
    data = Helper.data_logger(request)

    return ResetService.generate_OTP(data)


@auth.route('/reset/password/code', methods=['POST'])
def verify_OTP():
    data = Helper.data_logger(request)

    return ResetService.verify_OTP(data)


@auth.route('/reset/password/confirm', methods=['POST'])
def reset_password():
    data = Helper.data_logger(request)

    return ResetService.reset_password(data)


@auth.route('/customer/<customer_id>', methods=['GET'])
def find_customer(customer_id):
    app.logger.info(f"Received find user request: {customer_id}")

    return CustomerService.get_customer_details(customer_id)
