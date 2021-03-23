import os
from flask import jsonify, request, Blueprint
import stripe
import json
from config import STRIPE_API_KEY

stripe.api_key = STRIPE_API_KEY

checkout_creation_handler = Blueprint('checkout_creation_handler', __name__)
checkout_session_handler = Blueprint('checkout_session_handler', __name__)
customer_portal_handler = Blueprint('customer_portal_handler', __name__)
create_payment_handler = Blueprint('create_payment_handler', __name__)


def generate_response(intent):
    # Note that if your API version is before 2019-02-11, 'requires_action'
    # appears as 'requires_source_action'.
    if intent.status == 'requires_action' and intent.next_action.type == 'use_stripe_sdk':
        # Tell the client to handle the action
        return json.dumps({
            'requires_action': True,
            'payment_intent_client_secret': intent.client_secret,
        }), 200
    elif intent.status == 'succeeded':
        # The payment didn’t need any additional actions and completed!
        # Handle post-payment fulfillment
        return json.dumps({'success': True}), 200
    else:
        # Invalid status
        return json.dumps({'error': 'Invalid PaymentIntent status'}), 500


@create_payment_handler.route('/pay', methods=['POST'])
def create_payment():
    data = request.get_json()
    intent = None

    try:
        print(data)
        if 'payment_method_id' in data:
            # Create the PaymentIntent
            intent = stripe.PaymentIntent.create(
                payment_method=data['payment_method_id'],
                amount=1099,
                currency='usd',
                confirmation_method='manual',
                confirm=True,
            )
        elif 'payment_intent_id' in data:
            intent = stripe.PaymentIntent.confirm(data['payment_intent_id'])
    except stripe.error.CardError as e:
        # Display error on client
        return json.dumps({'error': e.user_message}), 200

    return generate_response(intent)


@checkout_creation_handler.route('/create-checkout-session', methods=['POST'])
def create_checkout():
    data = json.loads(request.data)
    try:
        # See https://stripe.com/docs/api/checkout/sessions/create
        # for additional parameters to pass.
        # {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        # the actual Session ID is returned in the query parameter when your customer
        # is redirected to the success page.
        checkout_session = stripe.checkout.Session.create(
            success_url="https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="https://example.com/canceled.html",
            payment_method_types=["card"],
            mode="subscription",
            line_items=[
                {
                    "price": data['priceId'],
                    # For metered billing, do not pass quantity
                    "quantity": 1
                }
            ],
        )
        return jsonify({'sessionId': checkout_session['id']})
    except Exception as e:
        return jsonify({'error': {'message': str(e)}}), 400


@checkout_session_handler.route('/checkout-session', methods=['GET'])
def get_checkout_session():
    session_id = request.args.get('sessionId')
    checkout_session = stripe.checkout.Session.retrieve(session_id)
    return jsonify(checkout_session)


@customer_portal_handler.route('/customer-portal', methods=['POST'])
def customer_portal():
    data = json.loads(request.data)
    # For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    # Typically this is stored alongside the authenticated user in your database.
    checkout_session_id = data['sessionId']
    checkout_session = stripe.checkout.Session.retrieve(checkout_session_id)

    # This is the URL to which the customer will be redirected after they are
    # done managing their billing with the portal.
    return_url = os.getenv("DOMAIN")

    session = stripe.billing_portal.Session.create(
        customer=checkout_session.customer,
        return_url=return_url)
    return jsonify({'url': session.url})