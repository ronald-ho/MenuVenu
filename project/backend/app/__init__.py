import logging

# Flask configuration
from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

app = Flask(__name__)
CORS(app)

# Login Manager configuration
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(customer_id):
    from .authentication.models import Customers
    return Customers.query.get(int(customer_id))

# Logger configuration
app.logger.setLevel(logging.INFO)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://MenuVenu:MenuVenu@db:5432/MenuVenu'
app.config['SQLALCHEMY_POOL_SIZE'] = 20
app.config['SQLALCHEMY_MAX_OVERFLOW'] = 0
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 5
app.config['SQLALCHEMY_POOL_RECYCLE'] = 299

# Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = '3900w16amog@gmail.com'
app.config['MAIL_PASSWORD'] = 'epoekmdhdlqiletx'

db = SQLAlchemy(app)
mail = Mail(app)