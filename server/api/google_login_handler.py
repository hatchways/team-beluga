from flask import jsonify, Blueprint, request
from utils.auth.oauth import oauth
import json
from utils.auth.token_generator import token_generator
from model.model import Users

google_login_handler = Blueprint('google_login_handler', __name__)


@google_login_handler.route('/googlelogin', methods=['POST'])
def googlelogin():
    token_id = json.loads(request.get_data())['tokenId']
    user_info = oauth(token_id)

    if user_info['status']:
        userid = user_info.get('userid')

        if Users.query.filter_by(google_id=userid).first() is not None:
            user_db = Users.query.filter_by(google_id=userid).first()
            uid = user_db.id
            token = token_generator(uid)
            return jsonify({'response': 'Login success', 'token': token}), 200
        return jsonify({'response': 'Please Sign Up'}), 401
    return jsonify({'response': 'Login fail'}), 401
