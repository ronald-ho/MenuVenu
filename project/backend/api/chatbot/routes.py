from flask import request, Blueprint

# from .services import ChatbotService
from ..utilities import Helper

chatbot = Blueprint('chatbot', __name__)


@chatbot.route('/query', methods=['POST'])
def chatbot_query():
    data = Helper.data_logger(request)

    pass

    # return ChatbotService.chatbot_query(data)


@chatbot.route('/data_update', methods=['PUT'])
def data_update():
    pass
    # return ChatbotService.data_update()
