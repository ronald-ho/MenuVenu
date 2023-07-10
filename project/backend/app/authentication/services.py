from http import HTTPStatus

from flask import jsonify
from flask_mail import Message

# Local imports
from .. import db, mail
from .models import Customers


class CustomerService:
    @staticmethod
    def create_new_user(data):

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
