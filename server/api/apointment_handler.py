from flask import jsonify, Blueprint, request
import json
from model.model import Users, EventTypes, Appointments
from config import db
from utils.auth.middleware import check_token
import dateutil
import re
from utils.auth.google_client import GoogleClient

appointment_handler = Blueprint('appointment_handler', __name__)


@appointment_handler.route('/appointment/create', methods=['POST'])
#@check_token
def create_appointment():
    data = json.loads(request.get_data())
    name = data.get('name')
    time = data.get('dateTime')
    email = data.get('email')
    timezone = data.get('timezone')
    url = data.get('url')

    if name is None or time is None or email is None or timezone is None:
        return jsonify({'success': False, 'msg': 'Missing field(s)'}), 400
    if name == "" or time == "" or email == "" or timezone == "":
        return jsonify({'success': False, 'msg': 'Empty field(s)'}), 400

    regex = """^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$"""
    if not re.search(regex, email):
        return jsonify({'success': False, 'msg': 'Invalid email'}), 400

    try:
        dateutil.parser.isoparse(time)
    except:
        return jsonify({'success': False, 'msg': 'Invalid datetime'}), 400

    eventType = EventTypes.query.filter_by(url=url).first()
    eventType_id = eventType.id
    duration = eventType.duration
    title = eventType.title
    user = Users.query.filter_by(id=eventType.user_id).first()
    host_email = user.email

    google_client = GoogleClient(access_token=user.access_token, refresh_token=user.refresh_token)
    try:
        google_client.create_event_type(
            duration=duration,
            title=title,
            start_time=time,
            timezone=timezone,
            host_email=host_email,
            booker_email=email)
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'msg': 'Appointment Failed to Book'}), 400

    appointment = Appointments(
        eventType_id=eventType_id,
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


@appointment_handler.route('/appointment/<uid>', methods=['GET'])
@check_token
def get_appointment(uid):
    all_appointments = db.session.query(Appointments).join(EventTypes)\
        .filter(EventTypes.id == uid).all()
    return jsonify([appointments.to_dict() for appointments in all_appointments])



