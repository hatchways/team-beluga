from flask import jsonify, Blueprint, request
import json
from model.model import Users, Appointments
from config import db
from utils.auth.middleware import check_token
import dateutil
import re

create_appointment_handler = Blueprint('create_appointment_handler', __name__)
get_appointment_handler = Blueprint('get_appointment_handler', __name__)


@create_appointment_handler.route('/appointment/create', methods=['POST'])
@check_token
def create_appointment(user_id):
    data = json.loads(request.get_data())
    time = data.get('dateTime')
    email = data.get('email')
    timezone = data.get('timezone')
    # TODO: get related eventType id/url

    if time is None or email is None or timezone is None:
        return jsonify({'success': False, 'msg': 'Missing field(s)'}), 400
    if time == "" or email == "" or timezone == "":
        return jsonify({'success': False, 'msg': 'Empty field(s)'}), 400

    regex = """^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$"""
    if not re.search(regex, email):
        return jsonify({'success': False, 'msg': 'Invalid email'}), 400

    try:
        dateutil.parser.isoparse(time)
    except:
        return jsonify({'success': False, 'msg': 'Invalid datetime'}), 400

    user = Users.query.filter_by(id=user_id).first()
    name = user.name  # need clarify if this name come from FE or the name in DB

    appointment = Appointments(
        eventType_id="",  # need eventType id
        name=name,
        email=email,
        time=time,
        timezone=timezone
    )
    db.session.add(appointment)
    try:
        db.session.commit()
    except:
        return jsonify({'success': False, 'msg': 'Failed to record'}), 500
    return jsonify({'success': True, 'msg': 'Appointment Booked'}), 200


@get_appointment_handler.route('/appointment/<uid>', methods=['GET'])
@check_token
def get_appointment(uid):
    user = Users.query.filter_by(id=uid).first()
    all_appointments = Appointments.query.filter(Appointments.user == user)
    return jsonify([appointments.to_dict() for appointments in all_appointments])



