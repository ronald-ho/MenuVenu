from werkzeug.security import generate_password_hash, check_password_hash

from .. import db


class Restaurants(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    manager_password = db.Column(db.String(255), nullable=False)
    staff_password = db.Column(db.String(255), nullable=False)

    def set_manager_password(self, password):
        self.manager_password = generate_password_hash(password)

    def set_staff_password(self, password):
        self.staff_password = generate_password_hash(password)

    def check_manager_password(self, password):
        return check_password_hash(self.manager_password, password)

    def check_staff_password(self, password):
        return check_password_hash(self.staff_password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
        }
