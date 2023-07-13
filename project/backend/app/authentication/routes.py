from http import HTTPStatus

from flask import jsonify, request, Blueprint

# Local imports
from .. import app
from .services import CustomerService, ResetService

auth = Blueprint('auth', __name__)


# ====================================================================================================
# Register new user

@auth.route('/register', methods=['POST'])
def register_customer():
    data = data_logger(request)

    return CustomerService.create_new_customer(data)


# ====================================================================================================
# Login user

@auth.route('/login', methods=['POST'])
def login_customer():
    data = data_logger(request)

    return CustomerService.login_customer(data)


# @auth.route('/login/staff', methods=['POST'])
# def login_staff():
#


# ====================================================================================================
# Logout user

@auth.route('/logout', methods=['POST'])
def logout_customer():
    # might have to introduce tokens
    return jsonify({'status': HTTPStatus.OK, 'message': 'Logout successful'})


# ====================================================================================================
# Delete user

@auth.route('/delete', methods=['DELETE'])
def delete_customer():
    data = data_logger(request)

    return CustomerService.delete_customer(data)


# ====================================================================================================
# Update user details

@auth.route('/update', methods=['PUT'])
def update_customer():
    data = data_logger(request)

    return CustomerService.update_customer(data)


# ====================================================================================================
# Reset password
@auth.route('/reset/password/request', methods=['POST'])
def generate_OTP():
    data = data_logger(request)

    return ResetService.generate_OTP(data)


@auth.route('/reset/password/code', methods=['POST'])
def verify_OTP():
    data = data_logger(request)

    return ResetService.verify_OTP(data)


@auth.route('/reset/password/confirm', methods=['POST'])
def reset_password():
    data = data_logger(request)

    return ResetService.reset_password(data)


# ====================================================================================================
# Find user

@auth.route('/customer/<customer_id>', methods=['GET'])
def find_customer(customer_id):
    app.logger.info(f"Received find user request: {customer_id}")

    return CustomerService.get_customer_details(customer_id)

def data_logger(request):
    data = request.get_json()
    app.logger.info(f"Received request from frontend: {data}")
    return data
