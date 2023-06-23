from flask import request, jsonify
from .models import Customers
from app import app, db
from .services import User_service

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()

    # Create new user
    if User_service.create_new_user(data['email'], data['full_name'], data['password']):
        return jsonify({'message': 'New user created'})
    else:
        return jsonify({'message': 'User already exists'})

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    user = Customers.query.filter_by(email=data['email']).first()

    # Check if email does NOT exist in database
    if not user:
        return jsonify({'message': 'User does not exist'})
    
    # Check if password is correct
    if user.password != data['password']:
        return jsonify({'message': 'Incorrect password'})
    
    # Returns the main menu page
    return jsonify({'message': 'Login successful'})

@app.route('/auth/logout', methods=['POST'])
def logout():
    # might have to introduce tokens
    return jsonify({'message': 'Logout successful'})

@app.route('/auth/delete', methods=['POST'])
def delete():
    data = request.get_json()

    # Check if password is correct
    user = Customers.query.filter_by(email=data['email']).first()
    if user.password != data['password']:
        return jsonify({'message': 'Incorrect password'})
    
    # return confirmation page
    return jsonify({'message': 'Are you sure you want to delete your account?'})

@app.route('/auth/delete/confirm', methods=['POST'])
def delete_confirm():
    data = request.get_json()

    user = Customers.query.filter_by(email=data['email']).first()
    
    # if auth/delete/confirm is true, delete user
    if data['confirm']:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted'})
    
    # Returns the main menu page
    return jsonify({'message': 'User not deleted'})

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
    user.password = data['password']
    user.phone_number = data['phone_number']
    db.session.commit()

    # Returns the main menu page
    return jsonify({'message': 'User updated'})

@app.route('/auth/reset/password', methods=['POST'])
def generate_OTP():
    data = request.get_json()

    # Check if user exists
    if not Customers.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User does not exist'})
    
    # TODO: Generate reset OTP and send email

    # Returns the main menu page
    return jsonify({'message': 'OTP sent to email'})

@app.route('/auth/reset/password/confirm', methods=['POST'])
def reset_password():
    data = request.get_json()

    email = data['email']
    reset_code = data['reset_code']
    new_password = data['new_password']

    # Check if user exists and if the OTP is valid
    if not Customers.query.filter_by(email=email, reset_code=reset_code).first():
        return jsonify({'message': 'Invalid reset code'})

    # Reset password
    Customers.password = new_password
    Customers.reset_code = None
    db.session.commit()

    return jsonify({'message': 'Password reset successful'})

@app.route('/')
def hello():
    return "Welcome to MenuVenu"