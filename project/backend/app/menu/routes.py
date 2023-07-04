from flask import request, jsonify

from app import app, db
from .models import Items, Categories, Ingredients, Contains

@app.route('/menu/add/categories', methods=['POST'])
def add_categories():
    """
    Add categories to menu
    """
    pass    

@app.route('/menu/add/items', methods=['POST'])
def add_items():
    """
    Add items to menu
    """
    pass

@app.route('/menu/items', methods=['DELETE'])
def delete_items():
    """
    Delete items from menu
    """
    pass

@app.route('/menu/categories', methods=['DELETE'])
def delete_categories():
    """
    Delete categories from menu
    """
    pass

@app.route('/menu/items/<category_id>', methods=['GET'])
def get_items(category_id):

    app.logger.info(f"category_id: {category_id}")

    category = Categories.query.get(category_id)

    if not category:
        return jsonify({'status': 404, 'message': 'Category not found'})
    
    item_list = []

    for item in category.items:
        item_list.append(item.to_dict())

    return jsonify({'status': 200, 'message': 'Items found', 'items': item_list})
    

@app.route('/menu/categories', methods=['GET'])
def get_categories():
    
    app.logger.info("Getting categories from database")

    categories = Categories.query.all()

    category_list = [categories.to_dict() for categories in categories]

    return jsonify({'status': 200, 'message': 'Categories found', 'categories': category_list})


@app.route('/menu/item/position', methods=['PUT'])
def update_item_position():
    
    data = request.get_json()
    app.logger.info(f"data: {data}")

    item = Items.query.get(data['item_id'])

    if not item:
        return jsonify({'status': 404, 'message': 'Item not found'})
    
    item.position = data['position']
    db.session.commit()

    return jsonify({'status': 200, 'message': 'Item position updated'})


@app.route('/menu/category/position', methods=['PUT'])
def update_category_position():

    data = request.get_json()
    app.logger.info(f"data: {data}")

    category = Categories.query.get(data['category_id'])

    if not category:
        return jsonify({'status': 404, 'message': 'Category not found'})
    
    category.position = data['position']
    db.session.commit()

    return jsonify({'status': 200, 'message': 'Category position updated'})

@app.route('/menu/item/details/<item_id>', methods=['GET'])
def get_item_details(item_id):
    
    app.logger.info("Getting item details from database")

    item = Items.query.get(item_id)

    if not item:
        return jsonify({'status': 404, 'message': 'Item not found'})
    
    return jsonify({'status': 200, 'message': 'Item found', 'item': item.to_dict()})

@app.route('/menu/items', methods=['PUT'])
def update_items():
    """
    Update items
    """
    pass

@app.route('/menu/categories', methods=['PUT'])
def update_categories():
    """
    Update categories
    """
    pass    

