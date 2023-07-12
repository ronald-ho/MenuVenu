from http import HTTPStatus

from flask import jsonify

from .models import Items, Categories
from .. import db


class ItemService:
    @staticmethod
    def create_new_item(data):

        item_name = data['name']

        item = Items.query.filter_by(name=item_name).first()
        if item:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Item already exists'})

        new_item = Items(
            name=item_name,
            description=data['description'],
            image=data['image'],
            price=data['price'],
            category=data['category_id'],
            calories=data['calories'],
            points_to_redeem=data['points_to_redeem'],
            points_earned=data['points_earned'],
            position=ItemService.get_next_position()
        )

        db.session.add(new_item)
        db.session.commit()

        return jsonify({
            'status': HTTPStatus.CREATED,
            'message': 'Item added successfully',
            'item': new_item.to_dict()
        })

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
            items_to_update = Items.query.filter(Items.position < curr_position,
                                                 Items.position >= new_position).all()
            for item in items_to_update:
                item.position += 1

        else:
            items_to_update = Items.query.filter(Items.position > curr_position,
                                                 Items.position <= new_position).all()
            for item in items_to_update:
                item.position -= 1

        current_item.position = new_position
        db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'message': 'Item position updated'})

    @staticmethod
    def update_item_details(data):
        item = Items.query.filter_by(id=data["item_id"]).first()
        if not item:
            return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Item not found'})

        name_check = Items.query.filter_by(name=data["name"]).first()
        if name_check and name_check.id != item.id:
            return jsonify({'status': HTTPStatus.CONFLICT, 'message': 'Item name already exists'})

        item.name = data["name"]
        item.description = data["description"]
        item.image = data["image"]
        item.price = data["price"]
        item.category = data["category_id"]
        item.calories = data["calories"]
        item.points_to_redeem = data["points_to_redeem"]
        item.points_earned = data["points_earned"]

        db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'message': 'Item updated successfully'})


class CategoryService:
    @staticmethod
    def create_new_category(data):

        category_name = data['name']

        category = Categories.query.filter_by(name=category_name).first()
        if category:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Category already exists'})

        new_category = Categories(
            name=category_name,
            position=CategoryService.get_next_position()
        )

        db.session.add(new_category)
        db.session.commit()

        return jsonify({
            'status': HTTPStatus.CREATED,
            'message': 'Category added successfully',
            'category': new_category.to_dict()
        })

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
            categories_to_update = Categories.query.filter(Categories.position < curr_position,
                                                           Categories.position >= new_position).all()
            for category in categories_to_update:
                category.position += 1
        else:
            categories_to_update = Categories.query.filter(Categories.position > curr_position,
                                                           Categories.position <= new_position).all()
            for category in categories_to_update:
                category.position -= 1

        current_category.position = new_position

        db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'message': 'Category position updated'})

    @staticmethod
    def update_category_details(data):
        category = Categories.query.filter_by(id=data["category_id"]).first()
        if not category:
            return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Category not found'})

        name_check = Categories.query.filter_by(name=data["name"]).first()
        if name_check and name_check.id != category.id:
            return jsonify({'status': HTTPStatus.CONFLICT, 'message': 'Category name already exists'})

        category.name = data["name"]

        db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'message': 'Category updated successfully'})


# class MenuService:
#     @staticmethod
#     def update_entity_position(entity, data):
#         entity_name = entity.__name__
#
#         new_position = data['new_position']
#
#         current_entity = entity.query.get(data['entity_id'])
#
#         if not current_entity:
#             return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': f'{entity_name} not found'})
#
#         curr_position = current_entity.position
#
#         if curr_position == new_position:
#             return jsonify({'status': HTTPStatus.OK, 'message': f'{entity_name} position updated'})
#
#         elif curr_position > new_position:
#             entities_to_update = entity.query.filter(entity.position < curr_position,
#                                                      entity.position >= new_position).all()
#             for entity in entities_to_update:
#                 entity.position += 1
#
#         else:
#             entities_to_update = entity.query.filter(entity.position > curr_position,
#                                                      entity.position <= new_position).all()
#             for entity in entities_to_update:
#                 entity.position -= 1
#
#         current_entity.position = new_position
#
#         db.session.commit()
#
#         return jsonify({'status': HTTPStatus.OK, 'message': f'{entity_name} position updated'})