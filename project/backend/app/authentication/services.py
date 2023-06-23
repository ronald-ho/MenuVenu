from .. import db
from .models import Customers

class User_service:
    @staticmethod
    def create_new_user(email, fullName, password, phone_number):
        if Customers.query.filter_by(email=email).first():
            return False
        
        new_user = Customers(
            email           = email, 
            fullName        = fullName, 
            password        = password,
            phone_number    = phone_number, 
            points          = 0, 
            calories_burnt  = 0, 
            calories_gained = 0
        )
        
        db.session.add(new_user)
        db.session.commit()

        return True