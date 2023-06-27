import psycopg2
import psycopg2.extras
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String

db_url = 'postgresql://MenuVenu:MenuVenu@localhost:5432/MenuVenu'
engine = create_engine(db_url)

metadata = MetaData()

metadata.bind = engine

def create_customers_table():
    customers_table = Table(
        'customers',
        metadata,
        Column('customer_id', Integer, primary_key=True),
        Column('email', String),
        Column('full_name', String),
        Column('password', String),
        Column('points', String),
        Column('calories_burnt', String),
        Column('calories_gained', String),
        Column('reset_code', String)      
    )
    metadata.create_all(bind=engine)

def create_restaurant_table():
    restaurant_table = Table(
        'restaurant',
        metadata,
        Column('restaurant_id', Integer, primary_key=True),
        Column('staff_password', String),
        Column('manager_password', String),
        Column('name', String),
        Column('phone_number', String),
    )
    metadata.create_all(bind=engine)

def create_menu_items_table():
    menu_items_table = Table(
        'menuitems',
        metadata,
        Column('item_id', Integer, primary_key=True),
        Column('name', String),
        Column('description', String),
        Column('price', Integer),
        #Column('category_id', Integer, ForeignKey('Categories.category_id')),
        Column('calories', Integer),
        Column('ingredients', String),
        Column('position', Integer),
        Column('points', Integer),
    )
    metadata.create_all(bind=engine)

def create_dining_tables_table():
    dining_tables_table = Table(
        'diningtables',
        metadata,
        Column('table_id', Integer, primary_key=True),
        Column('table_number', Integer),
        #Column('max_capacity', Integer), if we want to add
        #Column('is_occupied', Boolean), $$NOT NEEDED IN DATABASE
        #Column('needs_assistance', Boolean), $$NOT NEEDED IN DATABASE
    )
    metadata.create_all(bind=engine)



conn = psycopg2.connect(
    host="localhost",
    port="5432",
    database="MenuVenu",
    user="MenuVenu",
    password="MenuVenu"
)

cur = conn.cursor()
    
create_customers_table()
create_restaurant_table()
create_menu_items_table()
create_dining_tables_table()

# Switch to the new database
conn.close()
