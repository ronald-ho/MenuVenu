
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String



db_url = 'postgresql://postgres:123@localhost:5432/demo'
engine = create_engine(db_url)


metadata = MetaData()


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

metadata.create_all(bind = engine)