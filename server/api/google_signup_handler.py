from flask import jsonify, Blueprint, request
from utils.auth.oauth import oauth
import json
from config import db
from model import Users

google_signup_handler = Blueprint('google_signup_handler', __name__)


@google_signup_handler.route('/googlesignup', methods=['POST'])
def googlesignup():
    token_id = json.loads(request.get_data())['tokenId']
    user_info = oauth(token_id)

    if user_info['status']:
        userid = user_info.get('userid')
        name = user_info.get('name')
        email = user_info.get('email')
        if Users.query.filter_by(google_id=userid).first() is None:
            user_db = Users(name=name, email=email, username=None, password_hash=None, google_id=userid)
            db.session.add(user_db)
            db.session.commit()
            return jsonify({'response': 'Signup success'}), 200
        return jsonify({'response': 'Please Log In'}), 401
    return jsonify({'response': 'Signup fail'}), 401
