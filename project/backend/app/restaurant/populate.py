import random
import datetime

from .. import db
from ..menu.models import Categories, Ingredients, Items
from ..orders.models import Orders, OrderedItems, DiningTables

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
    first_names = ['Ronald', 'Anthony', 'Emily', 'Daniel', 'Ouyang', 'John', 'Jane', 'Mike', 'Emily', 'Robert', 'Sophia', 'Michael', 'Olivia', 'William', 'Ava', 'Jim']
    last_names = ['Ouyang', 'Ho', 'Huang', 'Tang', 'Lin', 'Valtan', 'Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Lee', 'Chen', 'Kim', 'Wang', 'Liu']
    return f"{random.choice(first_names)} {random.choice(last_names)}"


# Function to populate the database with orders and menu items
def populate_database():
    # Create people
    for i in range(10):
        new_user = {"email": f"user{i}@gmail.com",
                    "full_name": generate_random_full_name(),
                    "password": "test"
        }

        db.session.add(new_user)

    db.session.commit() 
    # Create categories
    categories_data = [
        {'name': 'Appetizers', 'position': 1},
        {'name': 'Main Course', 'position': 2},
        {'name': 'Desserts', 'position': 3}
    ]
    for category in categories_data:
        db.session.add(Categories(**category))
    db.session.commit()

    
    # Create menu items
    menu_items_data = [
        {
            "name": "Classic Cheeseburger",
            "description": "Juicy beef patty with melted cheese, served with lettuce, tomato, and pickles.",
            "price": 10.99,
            "production": 5.0,
            "category": 1,
            "calories": (10.99),
            "points_to_redeem": (10.99),
            "points_earned": (10.99),
            "ingredients": ["Beef", "Dairy"]
        },
        {
            "name": "Margherita Pizza",
            "description": "Thin-crust pizza topped with fresh mozzarella, basil, and tomatoes.",
            "price": 12.50,
            "production": 7.0,
            "category": 2,
            "calories": (12.50),
            "points_to_redeem": (12.50),
            "points_earned": (12.50),
            "ingredients": ["Dairy"]
        },
        {
            "name": "Caesar Salad",
            "description": "Crisp romaine lettuce with homemade Caesar dressing, croutons, and parmesan cheese.",
            "price": 8.95,
            "production": 3.0,
            "category": 3,
            "calories": (8.95),
            "points_to_redeem": (8.95),
            "points_earned": (8.95),
            "ingredients": ["Dairy"]
        },
        {
            "name": "Grilled Salmon",
            "description": "Fresh Atlantic salmon fillet grilled to perfection, served with lemon butter sauce.",
            "price": 18.75,
            "production": 6.0,
            "category": 2,
            "calories": (18.75),
            "points_to_redeem": (18.75),
            "points_earned": (18.75),
            "ingredients": ["Seafood"]
        },
        {
            "name": "Mushroom Risotto",
            "description": "Creamy Arborio rice cooked with mushrooms, parmesan, and a hint of white wine.",
            "price": 14.25,
            "production": 4.0,
            "category": 2,
            "calories": (14.25),
            "points_to_redeem": (14.25),
            "points_earned": (14.25),
            "ingredients": ["Dairy"]
        },
        {
            "name": "Mango Tango Smoothie",
            "description": "Refreshing smoothie made with fresh mango, yogurt, and a touch of honey.",
            "price": 5.99,
            "production": 2.0,
            "category": 1,
            "calories": (5.99),
            "points_to_redeem": (5.99),
            "points_earned": (5.99),
            "ingredients": ["Nuts", "Dairy"]
        },
        {
            "name": "BBQ Chicken Wings",
            "description": "Crispy chicken wings smothered in tangy BBQ sauce, served with ranch dressing.",
            "price": 9.50,
            "production": 5.0,
            "category": 1,
            "calories": (9.50),
            "points_to_redeem": (9.50),
            "points_earned": (9.50),
            "ingredients": ["Chicken"]
        },
        {
            "name": "Tiramisu",
            "description": "Classic Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cheese.",
            "price": 7.50,
            "production": 3.0,
            "category": 3,
            "calories": (7.50),
            "points_to_redeem": (7.50),
            "points_earned": (7.50),
            "ingredients": ["Dairy"]
        },
        {
            "name": "Pesto Penne Pasta",
            "description": "Penne pasta tossed in homemade pesto sauce with cherry tomatoes and pine nuts.",
            "price": 12.95,
            "production": 6.0,
            "category": 2,
            "calories": (12.95),
            "points_to_redeem": (12.95),
            "points_earned": (12.95),
            "ingredients": ["Nuts", "Dairy"]
        },
        {
            "name": "Caprese Salad",
            "description": "Fresh mozzarella, ripe tomatoes, and basil drizzled with balsamic glaze.",
            "price": 8.25,
            "production": 3.0,
            "category": 3,
            "calories": (8.25),
            "points_to_redeem": (8.25),
            "points_earned": (8.25),
            "ingredients": ["Dairy"]
        },
        # Add 10 more menu items here
    ]
    for item in menu_items_data:
        db.session.add(Items(**item))
    db.session.commit()

    # Generate orders and ordered items for the past 30 days
    for _ in range(30):
        order_date = random_order_date()
        total_amount = 0.0
        points_earned = 0

        # Create orders
        table = random_table()
        order = Orders(table=table.id, order_date=order_date, total_amount=total_amount, points_earned=points_earned)
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
        order.total_amount = total_amount
        db.session.commit()

    # Update the total amount for orders
    db.session.execute("""
        UPDATE orders o
        SET total_amount = COALESCE(
            (SELECT ROUND(SUM(COALESCE(i.price::numeric, 0)), 2)
            FROM ordered_items oi
            JOIN items i ON oi.item = i.id
            WHERE oi.order = o.id),
            0.0
        );
    """)
    db.session.commit()

if __name__ == '__main__':
    populate_database()
