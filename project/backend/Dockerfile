FROM python:3.11.4

WORKDIR /app

ADD . /app

RUN pip install --no-cache-dir -r requirements.txt

COPY ./wait-for-db.sh /app/wait-for-db.sh

RUN chmod +x /app/wait-for-db.sh

EXPOSE 5000

CMD ["python", "app.py"]