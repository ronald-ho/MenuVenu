from flask import current_app as app


class Helper:

    @staticmethod
    def data_logger(request):
        data = request.get_json()
        return data
