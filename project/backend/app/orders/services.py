from datetime import datetime
from http import HTTPStatus

from flask import jsonify

from .models import DiningTables, Orders, OrderedItems
from .. import db
from ..authentication.models import Customers
from ..menu.models import Items


class AssistService:
    def __init__(self):
        self.assistance_flags = []

    def request_assist(self, data):
        table_number = data['table_number']
        if table_number in self.assistance_flags:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Assistance already requested'})
        else:
            self.assistance_flags.append(table_number)
            return jsonify({'status': HTTPStatus.OK, 'message': 'Assistance requested'})

    def finish_assist(self, data):
        table_number = data['table_number']
        if table_number not in self.assistance_flags:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Table did not need assistance'})
        else:
            self.assistance_flags.remove(table_number)
            return jsonify({'status': HTTPStatus.OK, 'message': 'Assistance completed'})

    def get_assist(self):
        return jsonify({'status': HTTPStatus.OK, 'assistance_list': self.assistance_flags})


class TableService:
    def __init__(self):
        self.occupied_flags = []

    def pay_bill(self, data):
        table_number = data['table_number']
        redeem = data['redeem']

        table = DiningTables.query.filter_by(number=table_number).first()
        order = Orders.query.filter_by(paid=False).filter_by(table=table.number).first()

        if not order:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Order does not exist'})

        if redeem:
            order.total_amount = order.total_amount * 0.9

        order.paid = True
        db.session.commit()
        self.occupied_flags.remove(table.number)

        return jsonify({'status': HTTPStatus.OK, 'amount': order.total_amount})

    @staticmethod
    def get_bill(data):
        table_number = data['table_number']

        table = DiningTables.query.filter_by(number=table_number).first()
        order = Orders.query.filter_by(paid=False).filter_by(table=table.number).first()

        if not order:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Order does not exist'})

        return jsonify({'status': HTTPStatus.OK, 'bill': order.total_amount})

    def select_table(self, data):
        table_number = data['table_number']

        table = DiningTables.query.filter_by(number=table_number).first()

        # creates a new order for table if it was not occupied yet
        if table.number not in self.occupied_flags:
            new_order = Orders(
                table=table.number,
                order_date=datetime.now(),
                total_amount=0,
                paid=False
            )

            db.session.add(new_order)
            db.session.commit()

            self.occupied_flags.append(table.number)

        return jsonify({'status': HTTPStatus.OK, 'message': 'Table selected'})

    def get_tables(self):
        table_list = DiningTables.query.all()

        table_list = [table.to_dict() for table in table_list]

        return jsonify({'status': HTTPStatus.OK, 'table_list': table_list, 'occupied_list': self.occupied_flags})


class OrderService:
    def __init__(self):
        self.kitchen_flags = []
        self.serve_flags = []

    def order_item(self, data):
        item_name = data['name']
        table_id = data['table_id']
        customer_id = data['customer_id']
        redeem = data['redeem']

        item = Items.query.filter_by(name=item_name).first()
        order = Orders.query.filter_by(paid=False).filter_by(table=table_id).first()
        customer = Customers.query.filter_by(id=customer_id).first()

        # add cost of item to order total if customer did not redeem points and add any points earnable
        if not redeem:
            order.total_amount = order.total_amount + item.price
            customer.points += item.points_earned

        # reduce points from customer total if customer did redeem points and has enough points (customers cannot earn points if using points purchase)
        else:
            if customer.points > item.points_to_redeem:
                customer.points -= item.points_to_redeem
            else:
                return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Customer does not have enough points'})

        new_ordered_item = OrderedItems(
            order=order.id,
            customer=data['customer_id'],
            item=item.id
        )

        db.session.add(new_ordered_item)
        db.session.commit()

        flag = {
            'name': item.name,
            'table_number': data['table_number']
        }

        self.kitchen_flags.append(flag)

        return jsonify({'status': HTTPStatus.OK, 'message': 'Item ordered'})

    def kitchen_prepared(self, data):
        item_name = data['name']
        table_number = data['table_number']

        prepared_item = {
            'name': item_name,
            'table_number': table_number
        }

        if prepared_item not in self.kitchen_flags:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Ordered item not in kitchen list'})
        else:
            self.kitchen_flags.remove(prepared_item)
            self.serve_flags.append(prepared_item)
            return jsonify({'status': HTTPStatus.OK, 'message': 'Ordered item prepared and ready to serve'})

    def get_order_list(self):
        return jsonify({'status': HTTPStatus.OK, 'order_list': self.kitchen_flags})


    @staticmethod
    def get_ordered_items(data):
        table_id = data['table_id']

        # get current order associated with table
        order = Orders.query.filter_by(paid=False).filter_by(table=table_id).first()

        if not order:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Table does not have an order'})

        # get ordered items associated with order
        ordered_item_list = OrderedItems.query.filter_by(order=order.id)

        item_list = []

        # for each ordered item, get the relevant menu item
        for ordered_item in ordered_item_list:
            item = Items.query.filter_by(id=ordered_item.item).first()
            item_list.append(item.to_dict())

        return jsonify({'status': HTTPStatus.OK, 'ordered_list': item_list})

    def waitstaff_served(self, data):
        item_name = data['name']
        table_number = data['table_number']

        served_item = {
            'name': item_name,
            'table_number': table_number
        }

        if served_item not in self.serve_flags:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Served item not in serve list'})
        else:
            self.serve_flags.remove(served_item)
            return jsonify({'status': HTTPStatus.OK, 'message': 'Item successfully served'})

    def get_serve_list(self):
        return jsonify({'status': HTTPStatus.OK, 'serve_list': self.serve_flags})
