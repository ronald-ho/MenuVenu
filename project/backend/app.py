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
from app.menu.models import Categories, Ingredients, Items, Contains

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        db.session.commit()
        
    app.run(host='0.0.0.0', port=5000, debug=True)