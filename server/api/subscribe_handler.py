from flask import jsonify, request, Blueprint
import stripe
import json
from config import STRIPE_API_KEY
from utils.auth.middleware import check_token

subscription_handler = Blueprint('create_subscription_handler', __name__)
stripe.api_key = STRIPE_API_KEY


def create_customer(payment_method_id, email):
    try:
        customer = stripe.Customer.create(
            payment_method=payment_method_id,
            email=email,
            invoice_settings={
                'default_payment_method': payment_method_id,
            },
        )
        # stripe.Customer.create_source(
        #     customer['id'],
        #     source="tok_mastercard",
        # )
        return customer['id']
    except Exception as e:
        return None


@subscription_handler.route('/create-subscription', methods=['POST'])
@check_token
def create_subscription():
    try:
        data = json.loads(request.data)

        # Check if customer exists
        customer_list = stripe.Customer.list(email = data.get("email")).get("data")

        customer_id = None

        if len(customer_list) > 0:
            customer_id = customer_list[0].get("id", None)
        else: # If not exist create customer
            customer_id = create_customer(data.get('payment_method_id'), data.get('email'))
        
        if customer_id is None:
            raise Exception("Error creating stripe customer")

        # Create subscription
        subscription = stripe.Subscription.create(
            customer=customer_id,
            items=[
                {"price": data.get('priceId')},
            ],
            expand=['latest_invoice.payment_intent'],
        )

        status = subscription["latest_invoice"]["payment_intent"]["status"]
        client_secret = subscription["latest_invoice"]["payment_intent"]["client_secret"]
        return jsonify({'success': True,'status':status,'client_secret':client_secret}), 200
    except Exception as e:
        return jsonify({'success': False, 'message':str(e)}), 200

def check_subscription(email):
    try:
        customer_list = stripe.Customer.list(email = email).data

        # If customer doesn't exist return false
        if len(customer_list) == 0:
            return False,None

        customer = stripe.Customer.retrieve(customer_list[0].get("id"), expand=['subscriptions'])

        subscription_list = customer.subscriptions.data

        # If customer doesn't have subscription
        if len(subscription_list) == 0:
            return False,None

        # If subscription is not active
        if subscription_list[0].status != "active":
            return False,None
        
        return True,subscription_list[0]

    except:
        return False,None

@subscription_handler.route('/cancel-subscription', methods=['POST'])
@check_token
def cancel_subscription():
    try:
        data = request.get_json()
        
        isSubscribed,subscription = check_subscription(data.get("email"))

        if not isSubscribed:
            return jsonify({"success":False, "response":"Subscription not found"}),200

        deletedSubscription = stripe.Subscription.delete(subscription.get("id"))
        
        return jsonify({"success":True, "response":"Successfully unsubscribed"}),200
    except Exception as e:
        return jsonify({"success":False, "response":"Subscription cancellation error"}),400

