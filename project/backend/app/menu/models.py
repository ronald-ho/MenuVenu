import base64
import mimetypes
from dataclasses import dataclass

from .. import db


@dataclass
class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    position = db.Column(db.Integer, unique=False, nullable=False)

    items = db.relationship('Items', backref='categories', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'category_id': self.id,
            'name': self.name,
            'position': self.position
        }


@dataclass
class Ingredients(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)

    items = db.relationship('Items', secondary='item_ingredient', back_populates='ingredients')


@dataclass
class Items(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    production = db.Column(db.Float, nullable=False)
    net = db.Column(db.Float, nullable=True)
    category = db.Column(db.Integer, db.ForeignKey(Categories.id))
    calories = db.Column(db.Integer, nullable=True)
    position = db.Column(db.Integer, unique=False, nullable=False)
    points_to_redeem = db.Column(db.Integer, nullable=True)
    points_earned = db.Column(db.Integer, nullable=True)

    ingredients = db.relationship('Ingredients', secondary='item_ingredient', back_populates='items')

    __table_args__ = (db.UniqueConstraint('category', 'position', name='unique_category_position'),)

    def to_dict(self):
        image_data = None
        if self.image:
            with open(self.image, "rb") as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

            mime_type = mimetypes.guess_type(self.image)[0]

            image_data = f'data:{mime_type};base64,{encoded_image}'

        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'image': image_data,
            'price': self.price,
            'production': self.production,
            'net': self.net,
            'category_id': self.category,
            'calories': self.calories,
            'position': self.position,
            'points_to_redeem': self.points_to_redeem,
            'points_earned': self.points_earned,
            'ingredients': [ingredient.name for ingredient in self.ingredients]
        }


item_ingredient = db.Table(
    'item_ingredient',
    db.Column('item_id', db.Integer, db.ForeignKey('items.id'), primary_key=True),
    db.Column('ingredient_id', db.Integer, db.ForeignKey('ingredients.id'), primary_key=True)
)
