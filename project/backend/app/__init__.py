import logging
import os

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
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS') == 'true'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

db = SQLAlchemy(app)
mail = Mail(app)

from .authentication.routes import auth
from .menu.routes import menu
from .orders.routes import orders
from .fitness.routes import fitness
from .restaurant.routes import manager
from .chatbot.routes import chatbot

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(menu, url_prefix='/menu')
app.register_blueprint(orders, url_prefix='/orders')
app.register_blueprint(fitness, url_prefix='/fitness')
app.register_blueprint(manager, url_prefix='/manager')
app.register_blueprint(chatbot, url_prefix='/chatbot')
