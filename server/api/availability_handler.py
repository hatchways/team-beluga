from flask import jsonify, Blueprint, request
from utils.auth.google_client import GoogleClient
from config import db
from model.model import Users
import datetime
from tzlocal import get_localzone


availability_handler = Blueprint('availability_handler', __name__)

@availability_handler.route("/availability/<int:id>", methods=["GET"])
def get_calendar_availability(id):
    user = Users.query.filter_by(id=id).first()

    # Instantiate google client with user access_token and refresh_token
    google_client = GoogleClient(access_token=user.access_token, refresh_token=user.refresh_token)

    # TODO: Update timeMin & timeMax from time obtained from frontend
    timeMin = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
    timeMax= datetime.datetime.utcnow().replace(hour=23, minute=59,second=59).isoformat() + 'Z'

    # Get local timezone of user
    timezone = get_localzone()
    
    return jsonify({
            "busy":google_client.get_user_calendar_info(timeMin=timeMin, timeMax=timeMax, timezone = timezone)}
        ), 200



    