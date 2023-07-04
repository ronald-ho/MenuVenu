import random
from dataclasses import dataclass
from sqlalchemy import Column, Integer, String, func
from sqlalchemy.orm import relationship

from app import db

@dataclass
class Categories(db.Model):
    category_id     = db.Column(db.Integer, primary_key = True)
    name            = db.Column(db.String(120), unique = True, nullable = False)
    position        = db.Column(db.Integer, unique = True, nullable = False)

    def to_dict(self):
        return {
            'category_id': self.category_id,
            'name': self.name,
            'position': self.position
        }

@dataclass
class Ingredients(db.Model):
    ingredient_id   = db.Column(db.Integer, primary_key = True)
    name            = db.Column(db.String(120), unique = True, nullable = False)


@dataclass
class Items(db.Model):
    item_id         = db.Column(db.Integer, primary_key = True)
    name            = db.Column(db.String(120), unique = True, nullable = False)
    description     = db.Column(db.String(255), nullable = True)
    image           = db.Column(db.String(255), nullable = True)
    price           = db.Column(db.Numeric(6,2), nullable = False)
    category_id     = db.Column(db.Integer, db.ForeignKey(Categories.category_id))
    calories        = db.Column(db.Integer, nullable = True)
    position        = db.Column(db.Integer, unique = True, nullable = False)
    points          = db.Column(db.Integer, nullable = True)

    category        = relationship("Categories", backref="items")
    ingredients     = relationship('Ingredients', secondary='contains', backref='items')

     
    def to_dict(self):
        return {
            'item_id': self.item_id,
            'name': self.name,
            'description': self.description,
            'image': self.image,
            'price': self.price,
            'category_id': self.category_id,
            'calories': self.calories,
            'position': self.position,
            'points': self.points,
            'ingredients': [ingredient.name for ingredient in self.ingredients]
        }


@dataclass
class Contains(db.Model):
    item_id         = db.Column(db.Integer, db.ForeignKey(Items.item_id), primary_key=True)
    ingredient_id   = db.Column(db.Integer, db.ForeignKey(Ingredients.ingredient_id), primary_key=True)