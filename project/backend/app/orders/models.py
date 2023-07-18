from dataclasses import dataclass

from sqlalchemy.sql import func

from .. import db
from ..authentication.models import Customers
from ..menu.models import Items


@dataclass
class DiningTables(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, unique=True, nullable=False)
    assistance = db.Column(db.Boolean, default=False)
    occupied = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'table_id': self.id,
            'table_number': self.number,
            'assistance': self.assistance,
            'occupied': self.occupied
        }


@dataclass
class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    table = db.Column(db.Integer, db.ForeignKey(DiningTables.id))
    order_date = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    points_earned = db.column(db.Integer, nullable = False)
    paid = db.Column(db.Boolean, default=False)


@dataclass
class OrderedItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order = db.Column(db.Integer, db.ForeignKey(Orders.id))
    order_time = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    item = db.Column(db.Integer, db.ForeignKey(Items.id))
    prepared = db.Column(db.Boolean, default=False)
    served = db.Column(db.Boolean, default=False)

    order_details = db.relationship('Orders', backref='ordered_items')
    item_details = db.relationship('Items', backref='ordered_items')

    def to_dict(self):
        order_time = self.order_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')

        return {
            'ordered_item_id': self.id,
            'table_number': self.order_details.table,
            'order_time': order_time,
            'item_name': self.item_details.name,
        }
