from .. import db

from .models import Restaurants
from werkzeug.security import generate_password_hash, check_password_hash


class RestaurantService:
    @staticmethod
    def create_default_restaurant():
        if Restaurants.query.count() == 0:
            new_restaurant = Restaurants(
                name='MenuVenu',
                phone='0422222222'
            )

            new_restaurant.set_manager_password('MenuVenu')
            new_restaurant.set_staff_password('MenuVenu')

            db.session.add(new_restaurant)




