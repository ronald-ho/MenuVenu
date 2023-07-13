from http import HTTPStatus

from flask import jsonify
from flask_mail import Message

# Local imports
from .. import db, mail
from .models import Customers


class CustomerService:
    @staticmethod
    def create_new_customer(data):

        email = data['email']
        full_name = data['full_name']
        password = data['password']

        if Customers.query.filter_by(email=email).first():
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'User already exists'})

        new_user = Customers(
            email=email,
            full_name=full_name,
            points=0,
            calories_burnt=0,
            calories_gained=0
        )

        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'status': HTTPStatus.CREATED, 'message': 'New user created'})

    @staticmethod
    def login_customer(data):
        email = data['email']
        password = data['password']

        customer = Customers.query.filter_by(email=email).first()

        # Check if email does NOT exist in database
        if not customer:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'User does not exist'})

        # Check if password is correct
        if not customer.check_password(password):
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Incorrect password'})

        # Returns the main menu page
        return jsonify({'status': HTTPStatus.OK, 'message': 'Login successful', 'customer_id': customer.id})

    @staticmethod
    def delete_customer(data):
        customer_id = data['customer_id']
        password = data['password']

        # Check if password is correct
        user = Customers.query.filter_by(id=customer_id).first()
        if not user.check_password(password):
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Incorrect password'})

        # Delete user
        db.session.delete_customer()
        db.session.commit()
        return jsonify({'status': HTTPStatus.OK, 'message': 'User deleted'})

    @staticmethod
    def update_customer(data):
        customer_id = data['customer_id']
        new_email = data['new_email']
        new_full_name = data['new_full_name']
        new_password = data['new_password']

        user = Customers.query.filter_by(id=customer_id).first()

        # Check if email already exists
        if user.email != new_email and Customers.query.filter_by(email=new_email).first():
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Email already exists'})

        # save the new data
        user.email = new_email
        user.full_name = new_full_name

        if new_password:
            user.set_password(new_password)

        db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'message': 'User updated'})

    @staticmethod
    def get_customer_details(data):
        customer_id = data['customer_id']

        customer = Customers.query.get(customer_id)

        if not customer:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'User does not exist'})

        return jsonify({'status': HTTPStatus.OK, 'message': 'User found', 'customer_info': customer.to_dict()})


class StaffService:
    @staticmethod
    def login_staff(data):
        password = data['password']

        # Check if password is correct


class ResetService:
    @staticmethod
    def generate_OTP(data, reset_dict):
        email = data['email']

        user = Customers.query.filter_by(email=email).first()

        # Check if user exists
        if not user:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'User does not exist'})

        # Generate OTP
        reset_code = Customers.generate_reset_code(user)

        # Add reset code to dictionary
        reset_dict[reset_code] = email

        # Send the OTP to the user's email
        MailService.send_email(email, reset_code)

        # Returns the main menu page
        return jsonify({'status': HTTPStatus.OK, 'message': 'OTP sent to email'})

    @staticmethod
    def verify_OTP(data, reset_dict):
        email = data['email']
        reset_code = int(data['reset_code'])

        # Check if reset code exists
        if reset_code not in reset_dict:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Invalid reset code'})

        # Check if email matches the reset code
        if reset_dict[reset_code] != email:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Invalid reset code'})

        return jsonify({'status': HTTPStatus.OK, 'message': 'OTP verified'})

    @staticmethod
    def reset_password(data, reset_dict):
        email = data['email']
        reset_code = int(data['reset_code'])
        new_password = data['new_password']

        customer = Customers.query.filter_by(email=email).first()

        customer.set_password(new_password)
        db.session.commit()

        reset_dict.pop(reset_code)

        return jsonify({'status': HTTPStatus.OK, 'message': 'Password reset successful'})


class MailService:
    @staticmethod
    def send_email(recipient, reset_code):
        msg = Message(
            'This is your OTP for MenuVenu',
            sender=('MenuVenu', '3900w16amog@gmail.com'),
            recipients=[recipient]
        )
        msg.body = 'Your OTP is: ' + str(reset_code)
        mail.send(msg)
