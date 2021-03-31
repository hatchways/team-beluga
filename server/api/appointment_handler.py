from flask import jsonify, Blueprint, request
import json
from model.model import Users, EventTypes, Appointments
from config import db
from utils.auth.middleware import check_token
import dateutil
import re
from utils.auth.google_client import GoogleClient

appointment_handler = Blueprint('appointment_handler', __name__)

@appointment_handler.route('/appointment/<int:id>', methods=['DELETE'])
@check_token
def delete_appointment(id):
    try:
        User = User.query.get(int(request.get_json().get("user_id")))
        appointment_to_delete = Appointments.query.get(id)

        if appointment_to_delete is None:
            raise Exception("Appointment to delete not found")
        db.session.delete(appointment_to_delete)   
        db.session.commit()


    except Exception as e:
        return jsonify({
            "success":False,
            "response":e
        })