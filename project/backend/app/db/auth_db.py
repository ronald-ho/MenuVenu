import enum
import numpy
import pandas

from sqlalchemy import BigInteger, Boolean, Column, \
                       Date, DateTime, Enum, Float, ForeignKey, Integer, \
                       String, UniqueConstraint, and_, func
from sqlalchemy.orm import relationship
from psql import Base, db, session

class auth_db(Base):
    __tablename__ = 'auth_db'
    id = Column(Integer, primary_key = True, autoincrement = True)
    name = Column(String(120), nullable = False)


def create():
    Base.metadata.create_all(db)
create()
    