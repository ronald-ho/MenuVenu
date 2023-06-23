import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

from .authentication import routes