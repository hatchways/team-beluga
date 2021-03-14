from flask import jsonify, Blueprint, request
import json
from model import Users
from config import db

user_info_handler = Blueprint('user_info_handler', __name__)


@user_info_handler.route('/user/<uid>', methods=['POST'])
def update_user_info(uid):
    data = json.loads(request.get_data())
    start_time = data.get('startTime')
    end_time = data.get('endTime')
    week_days = data.get('weekDay')
    user = Users.query.filter_by(id=uid).first()
    if start_time is not None and start_time != '':
        user.start_time = start_time
    if end_time is not None and end_time != '':
        user.end_time = end_time
    if week_days is not None and week_days != '':
        user.week_day = str(week_days)
    try:
        db.session.commit()
        return jsonify({'success': 'true'}), 200
    except:
        return jsonify({'success': 'false'}), 200

