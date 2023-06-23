from .. import db, mail
from .models import Customers
from flask_mail import Message

class UserService:
    @staticmethod
    def create_new_user(email, full_name, password):
        if Customers.query.filter_by(email=email).first():
            return False
        
        new_user = Customers(
            email           = email, 
            full_name       = full_name, 
            password        = password,
            points          = 0, 
            calories_burnt  = 0, 
            calories_gained = 0
        )
        
        db.session.add(new_user)
        db.session.commit()

        return True
    
class MailService:
    @staticmethod
    def send_email(recipient, reset_code):
        msg = Message(
            'This is your OTP for MenuVenu',
            sender = '3900w16amog@gmail.com',
            recipients = [recipient]
        )
        msg.body = 'Your OTP is: ' + str(reset_code)
        mail.send(msg)
