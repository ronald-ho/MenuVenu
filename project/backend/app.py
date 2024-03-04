# Flask and database setup
from app import application, db
from app.menu.services import IngredientService
from app.orders.services import TableService
from app.restaurant import populate
from app.restaurant.services import RestaurantService

if __name__ == '__main__':
    with application.app_context():
        db.create_all()

        RestaurantService.create_default_restaurant()
        TableService.create_default_tables()
        IngredientService.create_default_ingredients()

        populate.populate_database()

        db.session.commit()

    application.run(host='0.0.0.0', port=5000, debug=True)
