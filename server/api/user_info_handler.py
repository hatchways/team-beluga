from flask import jsonify, Blueprint, request
import json
from model.model import Users
from config import db
from utils.auth.middleware import check_token

user_info_handler = Blueprint('user_info_handler', __name__)

# If we ever make a user profile page we can make one route that updates all info

# This route is specifically for onboarding step 1 
@user_info_handler.route('/user/<int:id>/profile-setting', methods=['POST'])
@check_token
def update_profile_setting(id):
    data = request.get_json()
    url = data.get("url")
    timezone = data.get("timezone")

    # If url already exist return unique=false
    if Users.query.filter_by(url=url).first():
        return jsonify({'success': True, 'unique': False}), 200

    # Save url & timezone
    currUser = Users.query.get(id)
    currUser.url = url
    currUser.timezone = timezone
    db.session.commit()
    return jsonify({'success': True, 'unique': True}), 200


# This route is specifically for onboarding step 3
@user_info_handler.route('/user/<int:id>/availability', methods=['POST'])
@check_token
def update_user_info(id):
    data = request.get_json()
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    available_days = data.get('available_days')
    try:
        user = Users.query.get(id)
        user.available_time = f"{start_time},{end_time}"
        user.available_day = available_days
        db.session.commit()
        return jsonify({'success': True}), 200
    except:
        return jsonify({'success': False}), 400


@user_info_handler.route('/user/<int:id>/email', methods=['GET'])
@check_token
def get_user_email(id):
    # Save url & timezone
    email = Users.query.get(id).email
    if email:
        return jsonify({'success': True, 'email': email}), 200
    
    return jsonify({'success': False, 'email': ''}), 400





