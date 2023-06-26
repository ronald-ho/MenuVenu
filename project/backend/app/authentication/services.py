from flask_mail import Message

# Local imports
from app import db, mail
from .models import Customers


class UserService:
    @staticmethod
    def create_new_user(email, full_name, password):
        if Customers.query.filter_by(email=email).first():
            return False
        
        new_user = Customers(
            email           = email, 
            full_name       = full_name, 
            points          = 0, 
            calories_burnt  = 0, 
            calories_gained = 0
        )

        new_user.set_password(password)
        
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
