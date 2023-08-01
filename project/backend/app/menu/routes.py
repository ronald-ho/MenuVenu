from flask import request, Blueprint

from .models import Items, Categories
from .services import ItemService, CategoryService, MenuService, IngredientService
from .. import app
from ..utilities import Helper

menu = Blueprint('menu', __name__)


@menu.route('/category', methods=['POST'])
def add_categories():
    data = Helper.data_logger(request)

    return CategoryService.create_new_category(data)


@menu.route('/item', methods=['POST'])
def add_items():
    data = Helper.data_logger(request)

    return ItemService.create_new_item(data)


@menu.route('/item', methods=['DELETE'])
def delete_items():
    data = Helper.data_logger(request)

    return MenuService.delete_entity(Items, data)


@menu.route('/category', methods=['DELETE'])
def delete_categories():
    data = Helper.data_logger(request)

    return MenuService.delete_entity(Categories, data)


@menu.route('/items/<category_id>', methods=['GET'])
def get_items(category_id):
    app.logger.info(f"category_id: {category_id}")

    return CategoryService.get_category_items(category_id)


@menu.route('/categories', methods=['GET'])
def get_categories():
    app.logger.info("Getting categories from database")

    return CategoryService.get_all_categories()


@menu.route('/item/position', methods=['PUT'])
def update_item_position():
    data = Helper.data_logger(request)

    return MenuService.update_entity_position(Items, data)


@menu.route('/category/position', methods=['PUT'])
def update_category_position():
    data = Helper.data_logger(request)

    return MenuService.update_entity_position(Categories, data)


@menu.route('/item/details/<item_id>', methods=['GET'])
def get_item_details(item_id):
    app.logger.info("Getting item details from database")

    return ItemService.get_item_details(item_id)


@menu.route('/item', methods=['PUT'])
def update_item_details():
    data = Helper.data_logger(request)

    return ItemService.update_item_details(data)


@menu.route('/category', methods=['PUT'])
def update_category_details():
    data = Helper.data_logger(request)

    return CategoryService.update_category_details(data)


@menu.route('/ingredients', methods=['GET'])
def get_item_ingredients():
    app.logger.info("Getting item ingredients from database")

    return IngredientService.get_all_ingredients()
