from flask import request
from models import User
from .. import app, db

@app.route('auth/register', methods=['POST'])
def register():
    data = request.get_json()

    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return {'message': 'User already exists'}
    
    # Check if password is valid
    # If not, return prompt saying what is missing display on login page
    if not check_password(data['password']):
        return check_password(data['password'])

    # Create new user
    new_user = User(
        email=data['email'],
        firstName=data['firstName'],
        lastName=data['lastName'],
        password=data['password'],
        isCustomer=data['isCustomer'],
        isStaff=data['isStaff'],
        isManager=data['isManager']
    )
    db.session.add(new_user)
    db.session.commit()

    # Returns the main menu page
    return {'message': 'New user created'}


def check_password(password):

    contains_uppercase = False
    contains_lowercase = False
    contains_number = False

    for char in password:
        if char.isupper():
            contains_uppercase = True
        if char.islower():
            contains_lowercase = True
        if char.isdigit():
            contains_number = True
        
    missing = []

    if not contains_uppercase:
        missing.append('uppercase letter')
    if not contains_lowercase:
        missing.append('lowercase letter')
    if not contains_number:
        missing.append('number')

    return {'message': f'Password must contain a {", ".join(missing)}'}