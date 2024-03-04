# Flask and database setup
from flask import current_app as app

from api import db
from api.menu.services import IngredientService
from api.orders.services import TableService
from api.restaurant import populate
from api.restaurant.services import RestaurantService

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        RestaurantService.create_default_restaurant()
        TableService.create_default_tables()
        IngredientService.create_default_ingredients()

        populate.populate_database()

        db.session.commit()

    app.run(host='0.0.0.0', port=5000, debug=True)
