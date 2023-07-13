from http import HTTPStatus

from flask import request, jsonify, Blueprint

from .models import Items, Categories
from .services import ItemService, CategoryService
from .. import app, db

menu = Blueprint('menu', __name__)


@menu.route('/categories', methods=['POST'])
def add_categories():
    data = data_logger(request)

    return CategoryService.create_new_category(data)


@menu.route('/items', methods=['POST'])
def add_items():
    data = data_logger(request)

    return ItemService.create_new_item(data)


@menu.route('/items', methods=['DELETE'])
def delete_items():
    """
    Delete items from menu
    """
    data = data_logger(request)

    item = Items.query.filter_by(id=data["item_id"]).first()
    if not item:
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Item not found'})

    db.session.delete_customer()

    items_to_update = Items.query.filter(Items.position > item.position).all()

    for item in items_to_update:
        item.position -= 1

    db.session.commit()

    return jsonify({'status': HTTPStatus.OK, 'message': 'Item deleted successfully'})


@menu.route('/categories', methods=['DELETE'])
def delete_categories():
    """
    Delete categories from menu
    """
    data = data_logger(request)

    category = Categories.query.filter_by(id=data["category_id"]).first()

    if not category:
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Category not found'})

    db.session.delete_customer()

    categories_to_update = Categories.query.filter(Categories.position > category.position).all()

    for category in categories_to_update:
        category.position -= 1

    db.session.commit()

    return jsonify({'status': HTTPStatus.OK, 'message': 'Category deleted successfully'})


@menu.route('/items/<category_id>', methods=['GET'])
def get_items(category_id):
    app.logger.info(f"category_id: {category_id}")

    category = Categories.query.get(category_id)

    if not category:
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Category not found'})

    item_list = []

    for item in category.items:
        item_list.append(item.to_dict())

    return jsonify({'status': HTTPStatus.OK, 'message': 'Items found', 'items': item_list})


@menu.route('/categories', methods=['GET'])
def get_categories():
    app.logger.info("Getting categories from database")

    categories = Categories.query.all()

    category_list = [categories.to_dict() for categories in categories]

    return jsonify({'status': HTTPStatus.OK, 'message': 'Categories found', 'categories': category_list})


@menu.route('/item/position', methods=['PUT'])
def update_item_position():
    data = data_logger(request)

    # return MenuService.update_entity_position(Items, data)

    return ItemService.update_item_position(data)


@menu.route('/category/position', methods=['PUT'])
def update_category_position():
    data = data_logger(request)

    # return MenuService.update_entity_position(Categories, data)

    return CategoryService.update_category_position(data)


@menu.route('/item/details/<item_id>', methods=['GET'])
def get_item_details(item_id):
    app.logger.info("Getting item details from database")

    item = Items.query.get(item_id)

    if not item:
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Item not found'})

    return jsonify({'status': HTTPStatus.OK, 'message': 'Item found', 'item': item.to_dict()})


@menu.route('/item', methods=['PUT'])
def update_item_details():
    data = data_logger(request)

    return ItemService.update_item_details(data)


@menu.route('/category', methods=['PUT'])
def update_category_details():
    data = data_logger(request)

    return CategoryService.update_category_details(data)


def data_logger(request):
    data = request.get_json()
    app.logger.info(f"Received request from frontend: {data}")
    return data
