from dataclasses import dataclass

from sqlalchemy.sql import func

from .. import db
from ..authentication.models import Customers
from ..menu.models import Items


@dataclass
class DiningTables(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, unique=True, nullable=False)

    def to_dict(self):
        return {
            'table_id': self.id,
            'table_number': self.number
        }


@dataclass
class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    table = db.Column(db.Integer, db.ForeignKey(DiningTables.id))
    order_date = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    paid = db.Column(db.Boolean, default=False)

    ordered_items = db.relationship('OrderedItems', backref='orders')


@dataclass
class OrderedItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order = db.Column(db.Integer, db.ForeignKey(Orders.id))
    order_time = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    customer = db.Column(db.Integer, db.ForeignKey(Customers.id))
    item = db.Column(db.Integer, db.ForeignKey(Items.id))
