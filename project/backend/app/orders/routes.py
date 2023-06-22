from flask import request, jsonify
from models import Customers
from .. import app, db
from services import User_service

@app.route('orders/assist', methods=['GET'])
def assist():

    #gets table number
    table = DiningTables.select(table_number)

    return jsonify({'table': table})

@app.route('orders/bill', methods=['GET'])
def bill():

    #gets bill
    bill = Orders.select(total_amount)

    return jsonify({'bill': bill})