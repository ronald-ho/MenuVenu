from .. import db
from dataclasses import dataclass

@dataclass
class Customers(db.Model):
    customer_id     = db.Column(db.Integer, primary_key = True)
    email           = db.Column(db.String(120), unique = True, nullable = False)
    fullName       = db.Column(db.String(120), nullable = False)
    password        = db.Column(db.String(255), nullable = False)
    phone_number    = db.Column(db.String(10), nullable = False)
    points          = db.Column(db.Integer, nullable = False)
    calories_burnt  = db.Column(db.Integer, nullable = False)
    calories_gained = db.Column(db.Integer, nullable = False)
    
    