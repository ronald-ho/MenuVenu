from dataclasses import dataclass

from .. import db


@dataclass
class Categories(db.Model):
    category_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    position = db.Column(db.Integer, unique=False, nullable=False)

    Items = db.relationship('Items', backref='categories', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'category_id': self.category_id,
            'name': self.name,
            'position': self.position
        }


@dataclass
class Ingredients(db.Model):
    ingredient_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)


@dataclass
class Items(db.Model):
    item_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey(Categories.category_id))
    calories = db.Column(db.Integer, nullable=True)
    position = db.Column(db.Integer, unique=False, nullable=False)
    points = db.Column(db.Integer, nullable=True)

    ingredients = db.relationship('Ingredients', secondary='contains', backref='items')

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
    item_id = db.Column(db.Integer, db.ForeignKey(Items.item_id), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey(Ingredients.ingredient_id), primary_key=True)
