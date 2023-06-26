from app import app, db
from app.authentication import routes
from app.authentication.models import Customers
from app.orders import routes
from app.orders.models import DiningTables, Orders, OrderedItems

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        db.session.commit()
        
    app.run(host='0.0.0.0', port=5000, debug=True)