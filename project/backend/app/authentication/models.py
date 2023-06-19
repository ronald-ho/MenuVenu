from .. import db
from dataclasses import dataclass

@dataclass
class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String(120), unique = True, nullable = False)
    firstName = db.Column(db.String(120), nullable = False)
    lastName = db.Column(db.String(120), nullable = False)
    password = db.Column(db.String(255), nullable = False)
    isCustomer = db.Column(db.Boolean, nullable = False)
    isStaff = db.Column(db.Boolean, nullable = False)
    isManager = db.Column(db.Boolean, nullable = False)
    
    