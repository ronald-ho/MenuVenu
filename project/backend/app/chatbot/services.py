import os
from http import HTTPStatus

from flask import jsonify
from langchain.document_loaders import TextLoader
from langchain.indexes import VectorstoreIndexCreator

import constants
from .. import db
from ..menu.models import Items, Ingredients
from ..orders.models import DiningTables, OrderedItems
from ..restaurant.models import Restaurants


class ChatbotService:
    @staticmethod
    def chatbot_query(data):
        os.environ["OPENAI_API_KEY"] = constants.APIKEY

        query = data['query']

        # converts text file to a format that is processable by the bot
        loader = TextLoader('data.txt')

        # creates an index from the formatted data to generate responses
        index = VectorstoreIndexCreator().from_loaders([loader])

        return jsonify({'status': HTTPStatus.OK, 'message': index.query(query)})

    @staticmethod
    def data_update():
        f = open('data.txt', 'w')

        restaurant = Restaurants.query.first()

        f.write("OUR RESTAURANT")
        f.write("Name - " + restaurant.name)
        f.write("Phone number - " + restaurant.phone)

        item_list = Items.query.all()

        # Lits all items with their ingredients, price and calories
        for item in item_list:

            f.write(item.name.upper() + "\n")

            #Ingredients
            f.write("Ingredients - ")
            if item.ingredients:
                end = len(item.ingredients)
                index = 0
                for ingredient in item.ingredients:
                    f.write(ingredient.name)
                    if index < end:
                        f.write(", ")
                    index += 1

                f.write("\n")

            else:
                f.write("There is no listed ingredients\n")

            #Price
            f.write("Price - $" + str(item.price) + "\n")

            #Calories
            f.write("Calories - " + str(item.calories) + "\n")

        f.write("\n")

        # Availability of tables
        f.write("BUSY/AVAILABLE\n")
        count = DiningTables.query.filter_by(occupied=False).count()
        f.write("There are currently " + str(count) + " tables available\n")

        f.write("\n")

        # Most popular dish
        f.write("OUR MOST POPULAR DISH\n")
        popular = db.session.query(OrderedItems.item, db.func.count(OrderedItems.item).label('popularity')). \
            group_by(OrderedItems.item).order_by(db.desc('popularity')).first()
        f.write(popular.name + "\n")

        f.write("\n")

        # Helper lines for chatbot to learn
        f.write("HOW DO I?\n")
        f.write("Fitness - You can connect your fitness app through your profile in the top right of the screen\n")
        f.write("Assistance - You can request assistance with the 'Assist' button below your order list\n")
        f.write("Bill - You can request the bill with the 'Bill' button below your order list\n")

        f.write("\n")

        # Family Guy 3 hour compilation
        f.write("FAMILY GUY\n")
        f.write("Here you go: https://www.youtube.com/watch?v=qrhFlCoNun0\n")

        f.close()

        return jsonify({'status': HTTPStatus.OK, 'message': 'Data updated'})
