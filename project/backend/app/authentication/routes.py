import logging
from http import HTTPStatus

from app import app, db
from flask import jsonify, request

from .models import Customers
from .services import MailService, UserService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

reset_dict = {}

# ====================================================================================================
# Register new user

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()

    logger.info(f"Received registration request: {data}")

    # Create new user
    if UserService.create_new_user(data['email'], data['full_name'], data['password']):
        return jsonify({'status': HTTPStatus.CREATED, 'message': 'New user created'})
    else:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'User already exists'})

# ====================================================================================================
# Login user

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    logger.info(f"Received login request: {data}")

    user = Customers.query.filter_by(email=data['email']).first()

    # Check if email does NOT exist in database
    if not user:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'User does not exist'})
    
    # Check if password is correct
    if user.password != data['password']:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Incorrect password'})
    
    # Returns the main menu page
    return jsonify({'status': HTTPStatus.OK, 'message': 'Login successful', 'customer_id': user.customer_id})

# ====================================================================================================
# Logout user

@app.route('/auth/logout', methods=['POST'])
def logout():
    # might have to introduce tokens
    return jsonify({'status': HTTPStatus.OK, 'message': 'Logout successful'})

# ====================================================================================================
# Delete user

@app.route('/auth/delete', methods=['DELETE'])
def delete():
    data = request.get_json()

    logger.info(f"Received delete request: {data}")

    # Check if password is correct
    user = Customers.query.filter_by(customer_id = data['customer_id']).first()
    if user.password != data['password']:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Incorrect password'})
    
    # Delete user
    db.session.delete(user)
    db.session.commit()
    return jsonify({'status': HTTPStatus.OK, 'message': 'User deleted'})

# ====================================================================================================
# Update user details

@app.route('/auth/update', methods=['PUT'])
def update():
    data = request.get_json()

    logger.info(f"Received update request: {data}")

    # Check if password is correct
    user = Customers.query.filter_by(customer_id = data['customer_id']).first()
    
    # save the new data
    user.email = data['new_email']
    user.full_name = data['new_full_name']

    db.session.commit()

    # Returns the main menu page
    return jsonify({'status': HTTPStatus.OK, 'message': 'User updated'})

# ====================================================================================================
# Reset password
@app.route('/auth/reset/password/request', methods=['POST'])
def generate_OTP():
    data = request.get_json()
    logger.info(f"Received reset password request: {data}")

    user = Customers.query.filter_by(email = data['email']).first()

    # Check if user exists
    if not user:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'User does not exist'})
    
    # Generate OTP 
    reset_code = Customers.generate_reset_code(user)

    # Add reset code to dictionary
    reset_dict[reset_code] = data['email']
    logger.info(f"reset_dict: {reset_dict}")

    # Send the OTP to the user's email
    MailService.send_email(data['email'], reset_code)

    # Returns the main menu page
    return jsonify({'status': HTTPStatus.OK, 'message': 'OTP sent to email'})


@app.route('/auth/reset/password/code', methods=['POST'])
def verify_OTP():
    data = request.get_json()

    logger.info(f"Received OTP verification request: {data}")

    email = data['email']
    reset_code = int(data['reset_code'])

    # Check if user exists and if the OTP is valid
    if reset_dict[reset_code] != email:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Invalid reset code'})
    
    # Returns the reset password page
    return jsonify({'status': HTTPStatus.OK, 'message': 'OTP verified'})


@app.route('/auth/reset/password/confirm', methods=['POST'])
def reset_password():
    data = request.get_json()

    logger.info(f"Received password reset request: {data}")

    reset_code = int(data['reset_code'])
    new_password = data['new_password']
    email = reset_dict[reset_code]

    user = Customers.query.filter_by(email = email).first()

    # Reset password
    user.password = new_password
    user.reset_code = None
    db.session.commit()

    return jsonify({'status': HTTPStatus.OK, 'message': 'Password reset successful'})

# ====================================================================================================
# Find user

@app.route('/auth/customer/<customer_id>', methods=['GET'])
def find_user(customer_id):
    logger.info(f"Received find user request: {customer_id}")

    customer = Customers.query.get(customer_id)

    if not customer:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'User does not exist'})
        
    return jsonify({'status': HTTPStatus.OK, 'message': 'User found', 'customer_info': customer.to_dict()})