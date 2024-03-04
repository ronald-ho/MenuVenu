import logging
import os

# Flask configuration
from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

application = Flask(__name__)
CORS(application)

# Login Manager configuration
login_manager = LoginManager()
login_manager.init_app(application)


@login_manager.user_loader
def load_user(customer_id):
    from .authentication.models import Customers
    return Customers.query.get(int(customer_id))


# Logger configuration
application.logger.setLevel(logging.INFO)

# Database configuration
application.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('POSTGRES_URL')
application.config['SQLALCHEMY_POOL_SIZE'] = 20
application.config['SQLALCHEMY_MAX_OVERFLOW'] = 0
application.config['SQLALCHEMY_POOL_TIMEOUT'] = 5
application.config['SQLALCHEMY_POOL_RECYCLE'] = 299

# Mail configuration
application.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER')
application.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT'))
application.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS') == 'true'
application.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
application.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

db = SQLAlchemy(application)
mail = Mail(application)

from .authentication.routes import auth
from .menu.routes import menu
from .orders.routes import orders
from .fitness.routes import fitness
from .restaurant.routes import manager
from .chatbot.routes import chatbot

application.register_blueprint(auth, url_prefix='/auth')
application.register_blueprint(menu, url_prefix='/menu')
application.register_blueprint(orders, url_prefix='/orders')
application.register_blueprint(fitness, url_prefix='/fitness')
application.register_blueprint(manager, url_prefix='/manager')
application.register_blueprint(chatbot, url_prefix='/chatbot')
