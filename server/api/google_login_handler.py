from flask import jsonify, Blueprint, request, make_response
from utils.auth.google_client import GoogleClient
import json
from utils.auth.token_generator import token_generator
from model.model import Users

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
            
            ret = jsonify({'response': 'Login success', 
                            'id': uid,
                            'user_url': user_db.url,
                            'user_timezone': user_db.timezone,
                            'user_available_day': user_db.available_day,
                            'user_available_time': user_db.available_time
                            })
            ret.set_cookie("token", token, httponly = True)
            return ret,200
        return jsonify({'response': 'Please Sign Up'}), 401
    return jsonify({'response': 'Login fail'}), 401
