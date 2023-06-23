from .. import db
from dataclasses import dataclass
from sqlalchemy.sql import func
from app.authentication.models import Customers
from app.menu.models import MenuItems

@dataclass
class DiningTables(db.model):
    table_id =          db.Column(db.Integer, primary_key = True)
    table_number =      db.Column(db.Integer, unique = True, nullable = False)
    is_ocuppied =       db.Column(db.Boolean, default = False)
    needs_assistance =  db.Column(db.Boolean, default = False)

@dataclass
class Orders(db.model):
    order_id = db.Column(db.Integer, primary_key = True)
    table_id = db.Column(db.Integer, db.ForeignKey(DiningTables.table_id), primary_key = True)
    order_date = db.Column(db.DateTime(timezone = True), server_default = func.now(), nullable = False)
    total_amount = db.Column(db.Float, nullable = False)

@dataclass
class OrderedItems(db):
    order_item_id = db.Column(db.Integer, primary_key = True)
    order_id = db.Column(db.Integer, db.ForeignKey(Orders.order_id), primary_key = True)
    customer_id = db.Column(db.Integer, db.ForeignKey(Customers.customer_id), primary_key = True)
    item_id = db.Column(db.Integer, db.ForeignKey(MenuItems.item_id), primary_key = True)
    