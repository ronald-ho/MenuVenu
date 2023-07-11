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


@dataclass
class Items(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.Integer, db.ForeignKey(Categories.id))
    calories = db.Column(db.Integer, nullable=True)
    position = db.Column(db.Integer, unique=False, nullable=False)
    points = db.Column(db.Integer, nullable=True)

    ingredients = db.relationship('Ingredients', secondary='contains', backref='items')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'image': self.image,
            'price': self.price,
            'category_id': self.category,
            'calories': self.calories,
            'position': self.position,
            'points': self.points,
            'ingredients': [ingredient.name for ingredient in self.ingredients]
        }


@dataclass
class Contains(db.Model):
    item = db.Column(db.Integer, db.ForeignKey(Items.id), primary_key=True)
    ingredient = db.Column(db.Integer, db.ForeignKey(Ingredients.id), primary_key=True)
