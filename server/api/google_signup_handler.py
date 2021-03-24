from flask import jsonify, Blueprint, request
from utils.auth.google_client import GoogleClient
import json
from config import db
from model.model import Users
from utils.auth.token_generator import token_generator

google_signup_handler = Blueprint('google_signup_handler', __name__)


@google_signup_handler.route('/googlesignup', methods=['POST'])
def googlesignup():
    code = json.loads(request.get_data())['code']
    google_client = GoogleClient(google_auth_code = code)
    user_info = google_client.get_user_info()

    if user_info.get('status'):
        userid = user_info.get('userid')
        name = user_info.get('name')
        email = user_info.get('email')
        if Users.query.filter_by(google_id=userid).first() is None:
            user_db = Users(name=name, 
                            email=email, 
                            google_id=userid, 
                            url='',
                            timezone='',
                            available_day='',
                            available_time='',
                            access_token=user_info.get('access_token'),
                            refresh_token=user_info.get('refresh_token')
                            )
            db.session.add(user_db)
            db.session.commit()
            uid = Users.query.filter_by(google_id=userid).first().id
            token = token_generator(uid)
            return jsonify({'response': 'Signup success', 'token': token, 'id': uid}), 200

        # If user already signed up
        return jsonify({'response': 'Please Log In'}), 401
    
    # Issue with google oauth
    return jsonify({'response': 'Signup fail'}), 401
