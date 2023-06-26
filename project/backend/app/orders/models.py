from .. import db
from dataclasses import dataclass
from sqlalchemy.sql import func
from app.authentication.models import Customers

@dataclass
class DiningTables(db.Model):
    table_id =          db.Column(db.Integer, primary_key = True)
    table_number =      db.Column(db.Integer, unique = True, nullable = False)

    def to_dict(self):
        return {
            'table_id': self.table_id,
            'table_number': self.table_number
        }
    
@dataclass
class Orders(db.Model):
    order_id = db.Column(db.Integer, primary_key = True)
    table_id = db.Column(db.Integer, db.ForeignKey(DiningTables.table_id))
    order_date = db.Column(db.DateTime(timezone = True), server_default = func.now(), nullable = False)
    total_amount = db.Column(db.Float, nullable = False)
    paid = db.Column(db.Boolean, default = False)

@dataclass
class OrderedItems(db.Model):
    order_item_id = db.Column(db.Integer, primary_key = True)
    order_id = db.Column(db.Integer, db.ForeignKey(Orders.order_id))
    customer_id = db.Column(db.Integer, db.ForeignKey(Customers.customer_id))
    # item_id = db.Column(db.Integer, db.ForeignKey(MenuItems.item_id), primary_key = True)