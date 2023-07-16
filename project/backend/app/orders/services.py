from datetime import datetime
from http import HTTPStatus

from flask import jsonify

from .models import DiningTables, Orders, OrderedItems
from .. import db
from ..authentication.models import Customers
from ..menu.models import Items


class AssistService:

    @staticmethod
    def request_assist(data):
        table_number = data['table_number']
        table = DiningTables.query.filter_by(number=table_number).first()

        if table.assistance:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Assistance already requested'})
        else:
            table.assistance = True
            db.session.commit()
            return jsonify({'status': HTTPStatus.OK, 'message': 'Assistance requested'})

    @staticmethod
    def finish_assist(data):
        table_number = data['table_number']
        table = DiningTables.query.filter_by(number=table_number).first()

        if not table.assistance:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Table did not need assistance'})
        else:
            table.assistance = False
            db.session.commit()
            return jsonify({'status': HTTPStatus.OK, 'message': 'Assistance completed'})

    @staticmethod
    def get_assist():
        tables_assistance = DiningTables.query.filter_by(assistance=True).all()
        tables_assistance_list = [table.number for table in tables_assistance]

        return jsonify({'status': HTTPStatus.OK, 'assistance_list': tables_assistance_list})


class TableService:

    @staticmethod
    def pay_bill(data):
        table_number = data['table_number']
        customer_id = data['customer_id']
        redeem = data['redeem']

        table = DiningTables.query.filter_by(number=table_number).first()
        order = Orders.query.filter_by(paid=False).filter_by(table=table.number).first()
        customer = Customers.query.filter_by(id=customer_id).first()

        if not order:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Order does not exist'})

        if redeem:
            order.total_amount = order.total_amount * 0.9
            customer.points -= 100
            

        order.paid = True
        table.occupied = False
        db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'amount': order.total_amount})

    @staticmethod
    def get_bill(data):
        table_number = data['table_number']

        table = DiningTables.query.filter_by(number=table_number).first()
        order = Orders.query.filter_by(paid=False).filter_by(table=table.number).first()

        if not order:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Order does not exist'})

        return jsonify({'status': HTTPStatus.OK, 'bill': order.total_amount})

    @staticmethod
    def select_table(data):
        table_number = data['table_number']

        table = DiningTables.query.filter_by(number=table_number).first()

        # creates a new order for table if it was not occupied yet
        if not table.occupied:
            new_order = Orders(
                table=table.number,
                order_date=datetime.now(),
                total_amount=0,
                paid=False
            )

            table.occupied = True

            db.session.add(new_order)
            db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'message': 'Table selected'})

    @staticmethod
    def get_tables():
        all_tables = DiningTables.query.all()
        occupied_tables = DiningTables.query.filter_by(occupied=True).all()

        table_list = [table.to_dict() for table in all_tables]
        occupied_table_list = [table.number for table in occupied_tables]

        return jsonify({'status': HTTPStatus.OK, 'table_list': table_list, 'occupied_list': occupied_table_list})


class OrderService:

    @staticmethod
    def order_item(data):
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
            order_time=datetime.now(),
            item=item.id
        )

        db.session.add(new_ordered_item)
        db.session.commit()

        return jsonify({'status': HTTPStatus.OK, 'message': 'Item ordered'})

    @staticmethod
    def kitchen_prepared(data):
        ordered_item_id = data['ordered_item_id']

        ordered_item = OrderedItems.query.filter_by(id=ordered_item_id).first()

        if ordered_item.prepared:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Ordered item not in kitchen list'})
        else:
            ordered_item.prepared = True
            db.session.commit()
            return jsonify({'status': HTTPStatus.OK, 'message': 'Ordered item prepared and ready to serve'})

    @staticmethod
    def get_order_list():
        ordered_items = OrderedItems.query.filter_by(prepared=False).all()

        kitchen_order_list = [item.to_dict() for item in ordered_items]

        return jsonify({'status': HTTPStatus.OK, 'order_list': kitchen_order_list})

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

    @staticmethod
    def waitstaff_served(data):
        ordered_item_id = data['ordered_item_id']

        ordered_item = OrderedItems.query.filter_by(id=ordered_item_id).first()

        if ordered_item.served:
            return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Served item not in serve list'})
        else:
            ordered_item.served = True
            db.session.commit()
            return jsonify({'status': HTTPStatus.OK, 'message': 'Item successfully served'})

    @staticmethod
    def get_serve_list():
        served_items = OrderedItems.query.filter_by(served=False).filter_by(prepared=True).all()

        serve_list = [item.to_dict() for item in served_items]

        return jsonify({'status': HTTPStatus.OK, 'serve_list': serve_list})
