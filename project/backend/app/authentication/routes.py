from http import HTTPStatus
from flask import request, jsonify
from .models import Customers
from app import app, db
from .services import User_service

# ====================================================================================================
# Register new user

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()

    # Create new user
    if User_service.create_new_user(data['email'], data['full_name'], data['password']):
        return jsonify({'status': HTTPStatus.CREATED, 'message': 'New user created'})
    else:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'User already exists'})

# ====================================================================================================
# Login user

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    user = Customers.query.filter_by(email=data['email']).first()

    # Check if email does NOT exist in database
    if not user:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'User does not exist'})
    
    # Check if password is correct
    if user.password != data['password']:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Incorrect password'})
    
    # Returns the main menu page
    return jsonify({'status': HTTPStatus.OK, 'message': 'Login successful'})

# ====================================================================================================
# Logout user

@app.route('/auth/logout', methods=['POST'])
def logout():
    # might have to introduce tokens
    return jsonify({'status': HTTPStatus.OK, 'message': 'Logout successful'})

# ====================================================================================================
# Delete user

@app.route('/auth/delete', methods=['POST'])
def delete():
    data = request.get_json()

    # Check if password is correct
    user = Customers.query.filter_by(email=data['email']).first()
    if user.password != data['password']:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Incorrect password'})
    
    # Delete user
    db.session.delete(user)
    db.session.commit()
    return jsonify({'status': HTTPStatus.OK, 'message': 'User deleted'})

# ====================================================================================================
# Update user details

@app.route('/auth/update', methods=['POST'])
def update():
    data = request.get_json()

    # Check if password is correct
    user = Customers.query.filter_by(email=data['email']).first()
    # if user.password != data['password']:
    #     return jsonify({'message': 'Incorrect password'})
    
    # save the new data
    user.email = data['email']
    user.full_name = data['full_name']

    db.session.commit()

    # Returns the main menu page
    return jsonify({'status': HTTPStatus.OK, 'message': 'User updated'})

# ====================================================================================================
# Reset password
@app.route('/auth/reset/password/request', methods=['POST'])
def generate_OTP():
    data = request.get_json()

    # Check if user exists
    if not Customers.query.filter_by(email=data['email']).first():
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'User does not exist'})
    
    # TODO: Generate reset OTP and send email

    # Returns the main menu page
    return jsonify({'status': HTTPStatus.OK, 'message': 'OTP sent to email'})

@app.route('/auth/reset/password/code', methods=['POST'])
def verify_OTP():
    data = request.get_json()

    email = data['email']
    reset_code = data['reset_code']

    # Check if user exists and if the OTP is valid
    if not Customers.query.filter_by(email=email, reset_code=reset_code).first():
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Invalid reset code'})
    
    # Returns the reset password page
    return jsonify({'status': HTTPStatus.OK, 'message': 'OTP verified'})

@app.route('/auth/reset/password/confirm', methods=['POST'])
def reset_password():
    data = request.get_json()

    email = data['email']
    new_password = data['new_password']

    user = Customers.query.filter_by(email=email).first()

    # Reset password
    user.password = new_password
    user.reset_code = None
    db.session.commit()

    return jsonify({'status': HTTPStatus.OK, 'message': 'Password reset successful'})