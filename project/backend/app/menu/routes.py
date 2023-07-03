from flask import request, jsonify

from app import app, db

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

@app.route('/menu/items', methods=['GET'])
def get_items():
    """
    Get items from menu
    """
    pass

@app.route('/menu/categories', methods=['GET'])
def get_categories():
    """
    Get categories from menu
    """
    pass

@app.route('/menu/item/position', methods=['PUT'])
def update_item_position():
    """
    Update item position in menu
    """
    pass

@app.route('/menu/category/position', methods=['PUT'])
def update_category_position():
    """
    Update category position in menu
    """
    pass

@app.route('/menu/item/details', methods=['GET'])
def get_item_details():
    """
    Get item details
    """
    pass

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

