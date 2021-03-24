from flask import jsonify, request, Blueprint
from model.model import Users
from utils.auth.token_generator import token_decoder

token_check_handler = Blueprint('token_check_handler', __name__)


@token_check_handler.route('/getcookie')
def getcookie():
    token = request.cookies.get('token')
    if token is None:
        return jsonify({'success': 'false', 'msg': 'Please log in'})
    if not token_decoder(token)['success']:
        return jsonify({'success': 'false', 'msg': 'Invalid Token'})
    user_id = token_decoder(token)['user_id']
    if Users.query.filter_by(id=user_id).first() is None:
        return jsonify({'success': 'false', 'msg': 'Invalid Token'})
    return jsonify({'success': 'true', 'userId': user_id})