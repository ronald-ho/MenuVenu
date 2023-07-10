from flask import request, jsonify
from http import HTTPStatus
from .. import app, db
from .services import ItemService, CategoryService

from .models import Items, Categories, Ingredients, Contains


@app.route('/menu/categories', methods=['POST'])
def add_categories():
    """
    Add categories to menu 
    """
    data = request.get_json()
    app.logger.info(f"data from front end: {data}")

    category_name = data['name']
    category = Categories.query.filter_by(name=category_name).first()

    if category:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Category already exists'})

    next_position = CategoryService.get_next_position()

    # Create a new Category instance
    new_category = CategoryService.create_new_category(category_name, next_position)

    # Return a JSON response indicating success and the added category's details
    response = {
        'status': HTTPStatus.CREATED,
        'message': 'Category added successfully',
        'category': new_category.to_dict()
    }
    return jsonify(response)


@app.route('/menu/items', methods=['POST'])
def add_items():
    """
    Add items to menu
    """
    # Get the item details from the request JSON data
    data = request.get_json()
    app.logger.info(f"data from front end: {data}")
    name = data['name']
    description = data['description']
    image = data['image']
    price = data['price']
    category_id = data['category_id']
    calories = data['calories']
    points = data['points']

    # TODO: MIGHT have to check if the category id is correct and exists

    item = Items.query.filter_by(name=name).first()
    if item:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Item already exists'})

    next_position = ItemService.get_next_position()

    # Create a new Items instance
    new_item = ItemService.create_new_item(name, description, image, price, category_id, calories, next_position, points)

    # Return a JSON response indicating success and the added item's details
    response = {
        'status': HTTPStatus.CREATED,
        'message': 'Item added successfully',
        'item': new_item.to_dict()
    }
    return jsonify(response)


@app.route('/menu/items', methods=['DELETE'])
def delete_items():
    """
    Delete items from menu
    """
    data = request.get_json()
    app.logger.info(f"data from front end: {data}")

    item = Items.query.filter_by(item_id=data["item_id"]).first()
    if not item:
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Item not found'})

    db.session.delete(item)

    items_to_update = Items.query.filter(Items.position > item.position).all()

    for item in items_to_update:
        item.position -= 1

    db.session.commit()

    return jsonify({'status': HTTPStatus.OK, 'message': 'Item deleted successfully'})


@app.route('/menu/categories', methods=['DELETE'])
def delete_categories():
    """
    Delete categories from menu
    """
    data = request.get_json()
    app.logger.info(f"data from front end: {data}")

    category = Categories.query.filter_by(category_id=data["category_id"]).first()

    if not category:
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Category not found'})

    db.session.delete(category)

    categories_to_update = Categories.query.filter(Categories.position > category.position).all()

    for category in categories_to_update:
        category.position -= 1

    db.session.commit()

    return jsonify({'status': HTTPStatus.OK, 'message': 'Category deleted successfully'})


@app.route('/menu/items/<category_id>', methods=['GET'])
def get_items(category_id):
    app.logger.info(f"category_id: {category_id}")

    category = Categories.query.get(category_id)

    if not category:
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Category not found'})

    item_list = []

    for item in category.items:
        item_list.append(item.to_dict())

    return jsonify({'status': HTTPStatus.OK, 'message': 'Items found', 'items': item_list})


@app.route('/menu/categories', methods=['GET'])
def get_categories():
    app.logger.info("Getting categories from database")

    categories = Categories.query.all()

    category_list = [categories.to_dict() for categories in categories]

    return jsonify({'status': HTTPStatus.OK, 'message': 'Categories found', 'categories': category_list})


@app.route('/menu/item/position', methods=['PUT'])
def update_item_position():
    data = request.get_json()
    app.logger.info(f"data: {data}")

    return ItemService.update_item_position(data)


@app.route('/menu/category/position', methods=['PUT'])
def update_category_position():
    data = request.get_json()
    app.logger.info(f"data: {data}")

    return CategoryService.update_category_position(data)


@app.route('/menu/item/details/<item_id>', methods=['GET'])
def get_item_details(item_id):
    app.logger.info("Getting item details from database")

    item = Items.query.get(item_id)

    if not item:
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Item not found'})

    return jsonify({'status': HTTPStatus.OK, 'message': 'Item found', 'item': item.to_dict()})


@app.route('/menu/items', methods=['PUT'])
def update_items():

    data = request.get_json()
    app.logger.info(f"data from front end: {data}")

    item = Items.query.filter_by(item_id=data["item_id"]).first()

    if not item:
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Item not found'})

    item.name = data["name"]
    item.description = data["description"]
    item.image = data["image"]
    item.price = data["price"]
    item.category_id = data["category_id"]
    item.calories = data["calories"]
    item.position = data["position"]
    item.points = data["points"]

    db.session.commit()

    return jsonify({'status': HTTPStatus.OK, 'message': 'Item updated successfully'})

@app.route('/menu/categories', methods=['PUT'])
def update_categories():

    data = request.get_json()
    app.logger.info(f"data from front end: {data}")

    category = Categories.query.filter_by(category_id=data["category_id"]).first()

    if not category:
        return jsonify({'status': HTTPStatus.NOT_FOUND, 'message': 'Category not found'})

    category.name = data["name"]
    category.position = data["position"]

    db.session.commit()

    return jsonify({'status': HTTPStatus.OK, 'message': 'Category updated successfully'})
