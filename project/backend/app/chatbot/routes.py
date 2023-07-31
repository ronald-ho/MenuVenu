from flask import request, Blueprint

from .services import ChatbotService
from .. import app

chatbot = Blueprint('chatbot', __name__)


@chatbot.route('/query', methods=['POST'])
def chatbot_query():
    data = data_logger(request)

    return ChatbotService.chatbot_query(data)


@chatbot.route('/data_update', methods=['PUT'])
def data_update():
    return ChatbotService.data_update()


def data_logger(request):
    data = request.get_json()
    app.logger.info(f"Received request from frontend: {data}")
    return data
