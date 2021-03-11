from flask import jsonify, Blueprint, request
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
import jwt
from config import JWT_SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRES
from oauth.oauth import oauth
import json


google_login_handler = Blueprint('google_login_handler', __name__)


def token_generator(userid):
    login_payload = {
        "user_id": userid,
        "is_refresh": False,
        "exp": JWT_ACCESS_TOKEN_EXPIRES
    }
    token = jwt.encode(payload=login_payload, key=JWT_SECRET_KEY, algorithm='HS256')
    return token


@google_login_handler.route('/googlelogin', methods=['POST'])
def googlelogin():
    token_id = json.loads(request.get_data())['tokenId']
    user_info = oauth(token_id)

    if user_info['status']:
        userid = user_info.get('userid')
        name = user_info.get('name')
        email = user_info.get('email')
        token = token_generator(userid)

        return jsonify({'response': 'Login success', 'token': token}), 200
    return jsonify({'response': 'Login fail'}), 401
