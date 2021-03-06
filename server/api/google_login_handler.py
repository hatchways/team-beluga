from flask import jsonify, Blueprint, request, make_response
from utils.auth.google_client import GoogleClient
import json
from utils.auth.token_generator import token_generator
from api.subscribe_handler import check_subscription
from model.model import Users
from config import db

google_login_handler = Blueprint('google_login_handler', __name__)


@google_login_handler.route('/googlelogin', methods=['POST'])
def googlelogin():
    code = json.loads(request.get_data())['code']
    google_client = GoogleClient(google_auth_code = code)
    user_info = google_client.get_user_info()

    if user_info['status']:
        userid = user_info.get('userid')

        if Users.query.filter_by(google_id=userid).first() is not None:
            user_db = Users.query.filter_by(google_id=userid).first()
            uid = user_db.id
            token = token_generator(uid)
            user_db.access_token = user_info.get('access_token')
            user_db.refresh_token = user_info.get('refresh_token')
            db.session.commit()
            
            subscription_status,subscription = check_subscription(user_db.email)

            ret = jsonify({'response': 'Login success', 
                            'id': uid,
                            'user_url': user_db.url,
                            'user_timezone': user_db.timezone,
                            'user_available_day': user_db.available_day,
                            'user_available_time': user_db.available_time,
                            'isSubscribed': subscription_status,
                            'userEmail':user_db.email
                            })
            ret.set_cookie("token", token, httponly = True)
            return ret,200
        return jsonify({'response': 'Please Sign Up'}), 401
    return jsonify({'response': 'Login fail'}), 401
