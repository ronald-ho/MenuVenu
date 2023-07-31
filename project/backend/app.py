# Flask and database setup
from app import app, db

# Authentication routes and models
from app.authentication import routes

# Orders routes and models
from app.orders import routes

# Menu routes and models
from app.menu import routes

# Fitness routes
from app.fitness import routes

# Restaurant routes and models
from app.restaurant import routes, populate

# Chatbot routes
from app.chatbot import routes

from app.restaurant.services import RestaurantService
from app.orders.services import TableService
from app.menu.services import IngredientService

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        RestaurantService.create_default_restaurant()
        TableService.create_default_tables()
        IngredientService.create_default_ingredients()

        populate.populate_database()

        db.session.commit()
        
    app.run(host='0.0.0.0', port=5000, debug=True)
