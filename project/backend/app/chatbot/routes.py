from flask import request

from .services import ChatbotService
from .. import app

@app.route('/chatbot/query', methods=['POST'])
def req_assist():
    data = data_logger(request)

    return ChatbotService.chatbot_query(data)

@app.route('/chatbot/data_update', methods=['PUT'])
def data_update():
    return ChatbotService.data_update()

def data_logger(request):
    data = request.get_json()
    app.logger.info(f"Received request from frontend: {data}")
    return data