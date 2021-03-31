from flask import jsonify, request, Blueprint
from model.model import Users
from utils.auth.token_generator import token_decoder
from api.subscribe_handler import check_subscription

token_check_handler = Blueprint('token_check_handler', __name__)


@token_check_handler.route('/getcookie')
def getcookie():
    token = request.cookies.get('token')
    if token is None:
        return jsonify({'success': False, 'msg': 'Please log in'})
    if not token_decoder(token)['success']:
        return jsonify({'success': False, 'msg': 'Invalid Token'})
    user_id = token_decoder(token)['user_id']
    if Users.query.filter_by(id=user_id).first() is None:
        return jsonify({'success': False, 'msg': 'Invalid Token'})
    
    user = Users.query.filter_by(id=user_id).first()
    user_email = user.email
    
    # Default 0 means onboarding finished
    onboarding_step = 0

    # If user url or timezone is empty set step to 1
    if (user.url == "" or user.timezone == ""):
        onboarding_step = 1
    # If availablilites are empty set step to 3
    elif (user.available_day == "" or user.available_time == ""):
        onboarding_step = 3


    # Check subscription status
    isSubscribed,subscription = check_subscription(user_email)
    return jsonify({'success': True, 
                    'userId': user_id, 
                    'isSubscribed':isSubscribed,
                    'userEmail':user_email,
                    'onboardingStep':onboarding_step})