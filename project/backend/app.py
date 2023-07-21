# Flask and database setup
from app import app, db

# Authentication routes and models
from app.authentication import routes
from app.authentication.models import Customers

# Orders routes and models
from app.orders import routes
from app.orders.models import DiningTables, OrderedItems, Orders

# Menu routes and models
from app.menu import routes
from app.menu.models import Categories, Ingredients, Items

# Restaurant routes and models
from app.restaurant import routes
from app.restaurant.services import RestaurantService
from app.orders.services import TableService
from app.menu.services import IngredientService

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        RestaurantService.create_default_restaurant()
        TableService.create_default_tables()
        IngredientService.create_default_ingredients()

        db.session.commit()
        
    app.run(host='0.0.0.0', port=5000, debug=True)
