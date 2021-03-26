from flask import jsonify, request, Blueprint
import stripe
import json
from config import STRIPE_API_KEY
from utils.auth.middleware import check_token

create_subscription_handler = Blueprint('create_subscription_handler', __name__)
stripe.api_key = STRIPE_API_KEY


def create_customer(payment_method_id, email):
    try:
        customer = stripe.Customer.create(
            payment_method=payment_method_id,
            email=email
        )
        stripe.Customer.create_source(
            customer['id'],
            source="tok_mastercard",
        )
        # TODO: record customer id in db
        return customer['id']
    except:
        return Exception


@create_subscription_handler.route('/create-subscription', methods=['POST'])
@check_token
def create_subscription():
    try:
        data = json.loads(request.data)
        # TODO: check if user already had customer id in db
        customer_id = create_customer(data['payment_method_id'], data['email'])
        # else:
        stripe.Subscription.create(
            customer=customer_id,
            items=[
                {"price": data['priceId']},
            ],
        )
        return jsonify({'success': True}), 200
    except:
        return jsonify({'success': False}), 200
