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
from app.restaurant.models import Restaurants

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        if Restaurants.query.count() == 0:

            new_restaurant = Restaurants(
                name='MenuVenu',
                phone='0422222222'
            )

            new_restaurant.set_manager_password('MenuVenu')
            new_restaurant.set_staff_password('MenuVenu')

            db.session.add(new_restaurant)

        db.session.commit()
        
    app.run(host='0.0.0.0', port=5000, debug=True)
