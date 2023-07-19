import random
from dataclasses import dataclass
from datetime import datetime, timedelta

from .. import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


@dataclass
class Customers(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    points = db.Column(db.Integer, nullable=False)
    calories_burnt = db.Column(db.Integer, nullable=False)
    calories_gained = db.Column(db.Integer, nullable=False)
    reset_code = db.Column(db.String(255), nullable=True)
    reset_code_expiry = db.Column(db.DateTime, nullable=True)

    def generate_reset_code(self):
        self.reset_code = random.randint(100000, 999999)
        return self.reset_code

    def set_reset_code(self, reset_code):
        self.reset_code = generate_password_hash(str(reset_code))
        self.reset_code_expiry = datetime.utcnow() + timedelta(minutes=5)

    def check_reset_code(self, reset_code):
        if datetime.utcnow() > self.reset_code_expiry:
            self.reset_code = None
            self.reset_code_expiry = None
            return False
        return check_password_hash(str(self.reset_code), str(reset_code))

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'customer_id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'points': self.points,
            'calories_burnt': self.calories_burnt,
            'calories_gained': self.calories_gained
        }
