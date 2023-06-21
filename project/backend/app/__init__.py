from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import os

app = Flask(__name__)
db_path = os.path.join(os.path.dirname(__file__), 'mydatabase.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}'.format(db_path)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = "" # TODO: Enter our email address
app.config['MAIL_PASSWORD'] = "" # TODO: Configure our email password

db = SQLAlchemy(app)
mail = Mail(app)

if not os.path.exists(db_path):
    with app.app_context():
        db.create_all()