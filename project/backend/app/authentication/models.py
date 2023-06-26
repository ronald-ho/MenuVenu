import random

from app import db
from dataclasses import dataclass

@dataclass
class Customers(db.Model):
    customer_id     = db.Column(db.Integer, primary_key = True)
    email           = db.Column(db.String(120), unique = True, nullable = False)
    full_name       = db.Column(db.String(120), nullable = False)
    password        = db.Column(db.String(255), nullable = False)
    points          = db.Column(db.Integer, nullable = False)
    calories_burnt  = db.Column(db.Integer, nullable = False)
    calories_gained = db.Column(db.Integer, nullable = False)
    reset_code      = None

    def generate_reset_code(self):
        self.reset_code = random.randint(100000, 999999)
        return self.reset_code
    
    def to_dict(self):
        return {
            'customer_id': self.customer_id,
            'email': self.email,
            'full_name': self.full_name,
            'points': self.points,
            'calories_burnt': self.calories_burnt,
            'calories_gained': self.calories_gained
        }