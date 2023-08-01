import datetime
import random

from sqlalchemy import text

from .. import db
from ..authentication.models import Customers
from ..authentication.services import CustomerService
from ..menu.models import Categories, Items
from ..menu.services import MenuService, IngredientService, ItemService
from ..orders.models import Orders, OrderedItems, DiningTables


def is_table_empty(model):
    return db.session.query(model).count() == 0


# Helper functions to generate random data
def random_menu_item():
    return random.choice(Items.query.all())


def random_table():
    return random.choice(DiningTables.query.all())


def random_quantity():
    return random.randint(1, 5)


def random_order_date():
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=30)
    return start_date + datetime.timedelta(days=random.randint(0, 30))


# Function to generate random full names
def generate_random_full_name():
    first_names = ['Ronald', 'Anthony', 'Emily', 'Daniel', 'Ouyang', 'John', 'Jane', 'Mike', 'Emily', 'Robert',
                   'Sophia', 'Michael', 'Olivia', 'William', 'Ava', 'Jim']
    last_names = ['Ouyang', 'Ho', 'Huang', 'Tang', 'Lin', 'Valtan', 'Doe', 'Smith', 'Johnson', 'Williams', 'Brown',
                  'Lee', 'Chen', 'Kim', 'Wang', 'Liu']
    return f"{random.choice(first_names)} {random.choice(last_names)}"


# Function to populate the database with orders and menu items
def populate_database():
    # Create people
    if is_table_empty(Customers):
        for i in range(10):
            user_data = {
                "email": f"user{i}@gmail.com",
                "full_name": generate_random_full_name(),
                "password": "Test1!",
                "points": 0,
                "calories_burnt": 0,
                "calories_gained": 0
            }

            CustomerService.create_new_customer(user_data)

    # Create categories
    if is_table_empty(Categories):
        categories_data = [
            {'name': 'Appetizers', 'position': 1},
            {'name': 'Main Course', 'position': 2},
            {'name': 'Desserts', 'position': 3},
            {'name': 'Beverages', 'position': 4},
            {'name': 'Salads', 'position': 5},
            {'name': 'Side Dishes', 'position': 6},
            {'name': 'Soups', 'position': 7},
            {'name': 'Snack', 'position': 8},
        ]
        for category in categories_data:
            db.session.add(Categories(**category))
        db.session.commit()

    # Create menu items
    if is_table_empty(Items):
        menu_items_data = [
            {
                "name": "Classic Cheeseburger",
                "description": "Juicy beef patty with melted cheese, served with lettuce, tomato, and pickles.",
                "price": 10.99,
                "production": 5.49,
                "image": None,
                "category_id": 2,
                "calories": None,
                "points_to_redeem": 54,
                "points_earned": 10,
                "ingredients": ["Beef", "Dairy"]
            },
            {
                "name": "Grilled Chicken Salad",
                "description": "Freshly grilled chicken with mixed greens, cherry tomatoes, and balsamic dressing.",
                "price": 8.99,
                "production": 4.49,
                "image": None,
                "category_id": 5,
                "calories": None,
                "points_to_redeem": 44,
                "points_earned": 8,
                "ingredients": ["Chicken"]
            },
            {
                "name": "Pulled Pork Sandwich",
                "description": "Slow-cooked pulled pork on a soft bun, topped with coleslaw.",
                "price": 9.49,
                "production": 4.74,
                "image": None,
                "category_id": 2,
                "calories": None,
                "points_to_redeem": 47,
                "points_earned": 9,
                "ingredients": ["Pork"]
            },
            {
                "name": "Lamb Kebabs",
                "description": "Tender lamb pieces marinated and grilled to perfection.",
                "price": 12.99,
                "production": 6.49,
                "image": None,
                "category_id": 2,
                "calories": None,
                "points_to_redeem": 64,
                "points_earned": 12,
                "ingredients": ["Lamb"]
            },
            {
                "name": "Seafood Paella",
                "description": "A traditional Spanish rice dish with a mix of seafood and flavorful spices.",
                "price": 14.99,
                "production": 7.49,
                "image": None,
                "category_id": 2,
                "calories": None,
                "points_to_redeem": 74,
                "points_earned": 14,
                "ingredients": ["Seafood"]
            },
            {
                "name": "Nutty Granola Parfait",
                "description": "Layered yogurt, granola, and mixed nuts topped with honey.",
                "price": 6.99,
                "production": 3.49,
                "image": None,
                "category_id": 3,
                "calories": None,
                "points_to_redeem": 34,
                "points_earned": 6,
                "ingredients": ["Nuts", "Dairy"]
            },
            {
                "name": "Spicy Chicken Wings",
                "description": "Crispy and spicy chicken wings served with a cool dipping sauce.",
                "price": 9.99,
                "production": 4.99,
                "image": None,
                "category_id": 1,
                "calories": None,
                "points_to_redeem": 49,
                "points_earned": 9,
                "ingredients": ["Chicken", "Spicy"]
            },
            {
                "name": "Gluten-free Veggie Pizza",
                "description": "Delicious gluten-free pizza with assorted vegetables and cheese.",
                "price": 11.49,
                "production": 5.74,
                "image": None,
                "category_id": 2,
                "calories": None,
                "points_to_redeem": 57,
                "points_earned": 11,
                "ingredients": ["Gluten", "Dairy"]
            },
            {
                "name": "Chocolate Brownie Sundae",
                "description": "Warm chocolate brownie topped with vanilla ice cream and chocolate sauce.",
                "price": 7.49,
                "production": 3.74,
                "image": None,
                "category_id": 3,
                "calories": None,
                "points_to_redeem": 37,
                "points_earned": 7,
                "ingredients": ["Dairy"]
            },
            {
                "name": "Iced Caramel Macchiato",
                "description": "Iced espresso with frothy milk and sweet caramel drizzle.",
                "price": 5.99,
                "production": 2.99,
                "image": None,
                "category_id": 4,
                "calories": None,
                "points_to_redeem": 29,
                "points_earned": 5,
                "ingredients": ["Dairy"]
            },
            {
                "name": "Mediterranean Salad",
                "description": "Fresh salad with mixed greens, feta cheese, olives, and a zesty vinaigrette.",
                "price": 8.49,
                "production": 4.24,
                "image": None,
                "category_id": 5,
                "calories": None,
                "points_to_redeem": 42,
                "points_earned": 8,
                "ingredients": ["Dairy"]
            },
            {
                "name": "Garlic Butter Shrimp",
                "description": "Succulent shrimp cooked in garlic butter and served with a side of rice.",
                "price": 13.49,
                "production": 6.74,
                "image": None,
                "category_id": 2,
                "calories": None,
                "points_to_redeem": 67,
                "points_earned": 13,
                "ingredients": ["Seafood", "Dairy"]
            },
            {
                "name": "Stuffed Mushrooms",
                "description": "Mushroom caps stuffed with a savory mixture of breadcrumbs and cheese.",
                "price": 6.49,
                "production": 3.24,
                "image": None,
                "category_id": 1,
                "calories": None,
                "points_to_redeem": 32,
                "points_earned": 6,
                "ingredients": ["Dairy"]
            },
            {
                "name": "Pork Chop",
                "description": "Juicy pork chop grilled to perfection and seasoned with herbs.",
                "price": 11.99,
                "production": 5.99,
                "image": None,
                "category_id": 2,
                "calories": None,
                "points_to_redeem": 59,
                "points_earned": 11,
                "ingredients": ["Pork"]
            },
            {
                "name": "Lemon Glazed Donut",
                "description": "Soft and fluffy donut with a tangy lemon glaze.",
                "price": 3.99,
                "production": 1.99,
                "image": None,
                "category_id": 3,
                "calories": None,
                "points_to_redeem": 19,
                "points_earned": 3,
                "ingredients": ["Dairy"]
            },
            {
                "name": "Spicy Tofu Stir-fry",
                "description": "Tofu and assorted vegetables stir-fried in a spicy sauce.",
                "price": 8.99,
                "production": 4.49,
                "image": None,
                "category_id": 2,
                "calories": None,
                "points_to_redeem": 44,
                "points_earned": 8,
                "ingredients": ["Spicy"]
            },
            {
                "name": "Gluten-free Chocolate Cake",
                "description": "Decadent chocolate cake made without gluten, topped with chocolate ganache.",
                "price": 9.99,
                "production": 4.99,
                "image": None,
                "category_id": 3,
                "calories": None,
                "points_to_redeem": 49,
                "points_earned": 9,
                "ingredients": ["Gluten"]
            },
            {
                "name": "Creamy Tomato Soup",
                "description": "Rich and creamy tomato soup with a hint of basil.",
                "price": 5.49,
                "production": 2.74,
                "image": None,
                "category_id": 7,
                "calories": None,
                "points_to_redeem": 27,
                "points_earned": 5,
                "ingredients": ["Dairy"]
            },
            {
                "name": "Crunchy Snack Mix",
                "description": "A delightful mix of nuts, pretzels, and spices for a satisfying crunch.",
                "price": 4.99,
                "production": 2.49,
                "image": None,
                "category_id": 8,
                "calories": None,
                "points_to_redeem": 24,
                "points_earned": 4,
                "ingredients": ["Nuts", "Gluten"]
            },
            {
                "name": "Grilled Vegetable Skewers",
                "description": "Assorted vegetables grilled on skewers and drizzled with a lemon-herb marinade.",
                "price": 7.99,
                "production": 3.99,
                "image": None,
                "category_id": 2,
                "calories": None,
                "points_to_redeem": 39,
                "points_earned": 7,
                "ingredients": ["Dairy"]
            }
            # Add 10 more menu items here
        ]
        for item in menu_items_data:
            ItemService.create_new_item(item)

        db.session.commit()

    # Generate orders and ordered items for the past 30 days
    if is_table_empty(Orders):
        for _ in range(150):
            order_date = random_order_date()
            total_amount = 0.0
            points_earned = 0

            # Create orders
            table = random_table()
            order = Orders(table=table.id, order_date=order_date, total_amount=total_amount,
                           points_earned=points_earned)
            db.session.add(order)
            db.session.commit()

            # Add random menu items to the order
            for _ in range(random_quantity()):
                menu_item = random_menu_item()
                ordered_item = OrderedItems(
                    order=order.id,
                    order_time=order_date,
                    item=menu_item.id,
                    prepared=True,
                    served=True,
                    redeemed=False
                )
                db.session.add(ordered_item)
                total_amount += menu_item.price

            order.paid = True
            order.total_amount = total_amount
            db.session.commit()

        # Update the total amount for orders
        db.session.execute(text("""
            UPDATE orders o
            SET total_amount = COALESCE(
                (SELECT ROUND(SUM(COALESCE(i.price::numeric, 0)), 2)
                FROM ordered_items oi
                JOIN items i ON oi.item = i.id
                WHERE oi.order = o.id),
                0.0
            );
        """))
        db.session.commit()
