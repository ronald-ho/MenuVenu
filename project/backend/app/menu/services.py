from http import HTTPStatus

from flask import jsonify

from .models import Items, Categories, Ingredients
from .. import db


class ItemService:
    @staticmethod
    def create_new_item(data):

        item_name = data['name']
        ingredients = data['ingredients']

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
            position=MenuService.get_next_position(Items)
        )

        db.session.add(new_item)
        db.session.commit()

        for ingredient in ingredients:
            ingredient_entity = Ingredients.query.filter_by(name=ingredient).first()
            if not ingredient_entity:
                ingredient_entity = Ingredients(name=ingredient)
                db.session.add(ingredient_entity)
                db.session.commit()

            new_item.ingredients.append(ingredient_entity)

        db.session.commit()

        return jsonify({
            'status': HTTPStatus.CREATED,
            'message': 'Item added successfully',
            'item': new_item.to_dict()
        })

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

    @staticmethod
    def get_item_details(item_id):
        item = Items.query.get(item_id)

        if not item:
            return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Item not found'})

        return jsonify({'status': HTTPStatus.OK, 'message': 'Item found', 'item': item.to_dict()})


class CategoryService:
    @staticmethod
    def create_new_category(data):

        category_name = data['name']

        category = Categories.query.filter_by(name=category_name).first()
        if category:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Category already exists'})

        new_category = Categories(
            name=category_name,
            position=MenuService.get_next_position(Categories)
        )

        db.session.add(new_category)
        db.session.commit()

        return jsonify({
            'status': HTTPStatus.CREATED,
            'message': 'Category added successfully',
            'category': new_category.to_dict()
        })

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

    @staticmethod
    def get_all_categories():
        categories = Categories.query.all()
        categories_list = [category.to_dict() for category in categories]

        return jsonify({'status': HTTPStatus.OK, 'message': 'Categories found', 'categories': categories_list})

    @staticmethod
    def get_category_items(category_id):
        category = Categories.query.filter_by(id=category_id).first()
        if not category:
            return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Category not found'})

        items = category.items
        items_list = [item.to_dict() for item in items]

        return jsonify({'status': HTTPStatus.OK, 'message': 'Items found', 'items': items_list})


class MenuService:
    @staticmethod
    def update_entity_position(entity, data):
        current_entity, entity_name = MenuService.find_entity(entity, data)

        new_position = data['new_position']
        curr_position = current_entity.position

        if curr_position == new_position:
            return jsonify({'status': HTTPStatus.OK, 'message': f'{entity_name} position updated'})

        elif curr_position > new_position:
            entities_to_update = entity.query.filter(entity.position < curr_position,
                                                     entity.position >= new_position).all()
            for entity in entities_to_update:
                entity.position += 1

        else:
            entities_to_update = entity.query.filter(entity.position > curr_position,
                                                     entity.position <= new_position).all()
            for entity in entities_to_update:
                entity.position -= 1

        current_entity.position = new_position

        db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'message': f'{entity_name} position updated'})

    @staticmethod
    def delete_entity(entity, data):
        current_entity, entity_name = MenuService.find_entity(entity, data)

        entities_to_update = entity.query.filter(entity.position > current_entity.position).all()
        for entity in entities_to_update:
            entity.position -= 1

        db.session.delete(current_entity)
        db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'message': f'{entity_name} deleted successfully'})

    @staticmethod
    def get_next_position(entity):
        max_position = db.session.query(db.func.max(entity.position)).scalar()
        next_position = max_position + 1 if max_position is not None else 1

        return next_position

    @staticmethod
    def find_entity(entity, data):
        entity_name = entity.__name__
        current_entity = entity

        if entity == Items:
            entity_name = 'Item'
            current_entity = Items.query.get(data['item_id'])
        elif entity == Categories:
            entity_name = 'Category'
            current_entity = Categories.query.get(data['category_id'])

        if not current_entity:
            return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': f'{entity_name} not found'})

        return current_entity, entity_name
