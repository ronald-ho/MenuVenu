import base64
import hashlib
import os
from http import HTTPStatus

from flask import jsonify
from werkzeug.utils import secure_filename

from .models import Items, Categories, Ingredients
from .. import db


class ItemService:
    @staticmethod
    def create_new_item(data):

        item_name = data['name'].capitalize()
        ingredients = data['ingredients']

        item = Items.query.filter_by(name=item_name).first()
        if item:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Item already exists'})

        if data['image'] is not None:
            image_path = ItemService.decode_image(item_name, data['image'])
        else:
            image_path = None

        new_item = Items(
            name=item_name,
            description=data['description'],
            image=image_path,
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
            ingredient = ingredient.capitalize()
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
        
        item = Items.query.filter_by(id=data["id"]).first()
        if not item:
            return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Item not found'})

        name_check = Items.query.filter_by(name=data["name"]).first()
        if name_check and name_check.id != item.id:
            return jsonify({'status': HTTPStatus.CONFLICT, 'message': 'Item name already exists'})

        if data['image'] is not None:
            image_path = ItemService.decode_image(item.name, data['image'])
        else:
            image_path = None

        item.name = data["name"]
        item.description = data["description"]
        item.image = image_path
        item.price = data["price"]
        item.category = data["category_id"]
        item.calories = data["calories"]
        item.points_to_redeem = data["points_to_redeem"]
        item.points_earned = data["points_earned"]

        ingredients = data['ingredients']
        selected_ingredients = []

        for ingredient in ingredients:
            ingredient_entity = Ingredients.query.filter_by(name=ingredient).first()
            selected_ingredients.append(ingredient_entity)

        item.ingredients = selected_ingredients

        db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'message': 'Item updated successfully'})

    @staticmethod
    def get_item_details(item_id):
        item = Items.query.get(item_id)

        if not item:
            return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Item not found'})

        return jsonify({'status': HTTPStatus.OK, 'message': 'Item found', 'item': item.to_dict()})

    @staticmethod
    def decode_image(item_name, image_data):
        image_format, image_string = image_data.split(';base64,')
        ext = image_format.split('/')[-1]

        decoded_image = base64.b64decode(image_string)
        dir_path = os.path.dirname(__file__)
        image_directory = os.path.join(dir_path, 'images')
        image_path = os.path.join(image_directory, secure_filename(f"{item_name}.{ext}"))

        # if image already exists, compare the two images
        if os.path.isfile(image_path):
            new_image_hash = hashlib.sha256(decoded_image).hexdigest()
            with open(image_path, 'rb') as f:
                existing_image = f.read()
                existing_image_hash = hashlib.sha256(existing_image).hexdigest()

            # if the two images are the same, return the existing image path
            if existing_image_hash == new_image_hash:
                return image_path

        with open(image_path, 'wb') as f:
            f.write(decoded_image)

        return image_path


class CategoryService:
    @staticmethod
    def create_new_category(data):

        category_name = data['name'].capitalize()

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
        categories = Categories.query.order_by(Categories.position).all()
        categories_list = [category.to_dict() for category in categories]

        return jsonify({'status': HTTPStatus.OK, 'message': 'Categories found', 'categories': categories_list})

    @staticmethod
    def get_category_items(category_id):
        category = Categories.query.filter_by(id=category_id).first()
        if not category:
            return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Category not found'})

        items = category.items

        # Order items by position key
        items_list = sorted([item.to_dict() for item in items], key=lambda x: x['position'])

        return jsonify({'status': HTTPStatus.OK, 'message': 'Items found', 'items': items_list})


class IngredientService:
    @staticmethod
    def create_default_ingredients():
        ingredient_list = ['Beef', 'Chicken', 'Pork', 'Lamb', 'Seafood', 'Nuts', 'Dairy', 'Spicy', 'Gluten']

        for ingredient in ingredient_list:
            ingredient_entity = Ingredients.query.filter_by(name=ingredient).first()
            if not ingredient_entity:
                ingredient_entity = Ingredients(name=ingredient)
                db.session.add(ingredient_entity)

    @staticmethod
    def get_all_ingredients():
        ingredients = Ingredients.query.all()
        ingredients_list = [ingredient.name for ingredient in ingredients]

        return jsonify({'status': HTTPStatus.OK, 'message': 'Ingredients found', 'ingredients': ingredients_list})


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
