from http import HTTPStatus

from flask import jsonify

from .. import db
from .models import Items, Categories


class ItemService:
    @staticmethod
    def create_new_item(name, description, image, price, category_id, calories, position, points):
        new_item = Items(
            name=name,
            description=description,
            image=image, price=price,
            category_id=category_id,
            calories=calories,
            position=position,
            points=points
        )

        db.session.add(new_item)
        db.session.commit()

        return Items.query.filter_by(name=name).first()

    @staticmethod
    def get_next_position():
        max_position = db.session.query(db.func.max(Items.position)).scalar()
        next_position = max_position + 1 if max_position is not None else 1

        return next_position

    @staticmethod
    def update_item_position(data):
        new_position = data['new_position']
        current_item = Items.query.get(data['item_id'])

        if not current_item:
            return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Item not found'})
        curr_position = current_item.position

        if curr_position == new_position:
            return jsonify({'status': HTTPStatus.OK, 'message': 'Item position updated'})

        elif curr_position > new_position:
            items_to_update = Items.query.filter(Items.position < curr_position, Items.position >= new_position).all()
            for item in items_to_update:
                item.position += 1

        else:
            items_to_update = Items.query.filter(Items.position > curr_position, Items.position <= new_position).all()
            for item in items_to_update:
                item.position -= 1

        current_item.position = new_position
        db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'message': 'Item position updated'})


class CategoryService:
    @staticmethod
    def create_new_category(name, position):
        new_category = Categories(
            name=name,
            position=position
        )

        db.session.add(new_category)
        db.session.commit()

        return Categories.query.filter_by(name=name).first()

    @staticmethod
    def get_next_position():
        max_position = db.session.query(db.func.max(Categories.position)).scalar()
        next_position = max_position + 1 if max_position is not None else 1

        return next_position

    @staticmethod
    def update_category_position(data):
        new_position = data['new_position']
        current_category = Categories.query.get(data['category_id'])

        if not current_category:
            return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Category not found'})

        curr_position = current_category.position

        if curr_position == new_position:
            return jsonify({'status': HTTPStatus.OK, 'message': 'Category position updated'})

        elif curr_position > new_position:
            categories_to_update = Categories.query.filter(Categories.position < curr_position, Categories.position >= new_position).all()
            for category in categories_to_update:
                category.position += 1
        else:
            categories_to_update = Categories.query.filter(Categories.position > curr_position, Categories.position <= new_position).all()
            for category in categories_to_update:
                category.position -= 1

        current_category.position = new_position

        db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'message': 'Category position updated'})