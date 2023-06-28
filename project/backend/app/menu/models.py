import random
from dataclasses import dataclass

from app import db


@dataclass
class Items(db.Model):
    item_id     = db.Column(db.Integer, primary_key = True)
    name           = db.Column(db.String(120), unique = True, nullable = False)
    description       = db.Column(db.String(255), nullable = True)
    image = db.Column(db.String(255), nullable = True)
    price        = db.Column(db.Numeric(6,2), nullable = False)
    #category   = db.Column(db.Integer, db.ForeignKey(Categories.category_id))
    calories  = db.Column(db.Integer, nullable = True)
    #ingredients = in the CONTAINS relation menuitem -> CONTAINS -> ingredients 
    position     = db.Column(db.Integer, unique = True, nullable = False)
    points          = db.Column(db.Integer, nullable = True) 

     
    def to_dict(self):
        return {
            'item_id': self.item_id,
            'name' self.name,
            'description': self.description,
            'image': self.image,
            'price': self.price,
            'calories': self.calories,
            'points': self.points
        }