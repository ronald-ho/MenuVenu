from . import app


class Helper:

    @staticmethod
    def data_logger(request):
        data = request.get_json()
        app.logger.info(f"Received request from frontend: {data}")
        return data
