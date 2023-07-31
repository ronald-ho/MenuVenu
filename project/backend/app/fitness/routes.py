from datetime import datetime, timedelta
from http import HTTPStatus

from flask import jsonify, request, Blueprint

from .. import app, db
from ..authentication.models import Customers

fitness = Blueprint('fitness', __name__)


@fitness.route('/token/store', methods=['POST'])
def store_token():
    data = data_logger(request)

    token = data['token']
    customer_id = data['id']

    customer = Customers.query.filter_by(id=customer_id).first()
    customer.google_token = token
    customer.google_token_expire = datetime.utcnow() + timedelta(hours=1)

    db.session.commit()

    return jsonify({'status': HTTPStatus.OK, 'message': 'Token stored'})


def data_logger(request):
    data = request.get_json()
    app.logger.info(f"Received request from frontend: {data}")
    return data
