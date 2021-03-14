from flask import jsonify, Blueprint, request
from model import EventTypes

url_check_handler = Blueprint('url_check_handler', __name__)


@url_check_handler.route('/user/<uid>/is_unique', methods=['GET'])
def url_is_unique(uid):
    url = request.args.get('url')
    if url is None:
        return jsonify({'success': 'false', 'msg': 'Empty URL'}), 200
    if EventTypes.query.filter_by(url=url).first():
        return jsonify({'success': 'true', 'unique': 'false'}), 200
    return jsonify({'success': 'true', 'unique': 'true'}), 200
