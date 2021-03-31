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
        event_id = google_client.create_event_type(
            duration=duration,
            title=title,
            start_time=time,
            timezone=timezone,
            host_email=host_email,
            booker_email=email)
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'msg': 'Appointment Failed to Book'}), 400

    if event_id is None:
        return jsonify({'success': False, 'msg': 'Appointment Failed to Book'}), 400

    appointment = Appointments(
        eventType_id=eventType_id,
        name=name,
        email=email,
        time=time,
        timezone=timezone,
        google_event_id=event_id
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
        .filter(EventTypes.user_id == uid).all()
    return jsonify([appointments.to_dict() for appointments in all_appointments])


def delete_one_appointment(user, appointment_id):
    try:
        appointment_to_delete = Appointments.query.filter_by(google_event_id=appointment_id).first()

        if appointment_to_delete is None:
            raise Exception("Appointment to delete not found")

        google_client = GoogleClient(access_token=user.access_token, refresh_token=user.refresh_token)
        google_client.delete_calendar_event(appointment_to_delete.google_event_id)

        db.session.delete(appointment_to_delete)
        db.session.commit()

        return True
    except Exception as e:
        return False


@appointment_handler.route('/appointment/<int:uid>', methods=['DELETE'])
@check_token
def delete_appointment(uid):
    user = Users.query.filter_by(id=uid).first()
    appointment_ids = request.get_json().get("ids")
    if appointment_ids is None or appointment_ids == []:
        return jsonify({'success': False, 'msg': 'Missing Field(s)'}), 400
    for appointment_id in appointment_ids:
        deleted = delete_one_appointment(user, appointment_id)
        if not deleted:
            return jsonify({'success': False, 'msg': 'Error in Deleting'}), 400
    all_appointments = db.session.query(Appointments).join(EventTypes) \
        .filter(EventTypes.user_id == uid).all()
    return jsonify({'success': True,
                    'msg': 'Successfully Deleted',
                    'appointments': [appointments.to_dict() for appointments in all_appointments]
                    }), 200
