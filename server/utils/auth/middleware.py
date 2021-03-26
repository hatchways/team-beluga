from functools import wraps
from flask import request, jsonify
from model.model import Users
from utils.auth.token_generator import token_decoder


def check_token(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        token = request.cookies.get('token')
        if token is None:
            return jsonify({'success': False, 'msg': 'Please log in'})
        if not token_decoder(token)['success']:
            return jsonify({'success': False, 'msg': 'Invalid Token'})
        user_id = token_decoder(token)['user_id']
        if Users.query.filter_by(id=user_id).first() is None:
            return jsonify({'success': False, 'msg': 'Invalid Token'})
        return func(*args, **kwargs)
    return wrapped
