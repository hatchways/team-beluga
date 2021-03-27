from flask import jsonify, Blueprint, request
from utils.auth.google_client import GoogleClient
from config import db
from model.model import Users
import datetime
from tzlocal import get_localzone
from utils.auth.middleware import check_token
import calendar


availability_handler = Blueprint('availability_handler', __name__)

@availability_handler.route("/availability/<int:id>", methods=["GET"])
@check_token
def get_calendar_availability(id):
    user = Users.query.filter_by(id=id).first()
    dayStart = user.available_time.split(',')[0]
    dayEnd = user.available_time.split(',')[1]

    # Instantiate google client with user access_token and refresh_token
    google_client = GoogleClient(access_token=user.access_token, refresh_token=user.refresh_token)

    yearMonth = request.args.get('ym')
    print(yearMonth)
    if yearMonth is None or yearMonth == "":
        # TODO: Update timeMin & timeMax from time obtained from frontend (Done)
        timeMin = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
        last_day = calendar.monthrange(datetime.datetime.utcnow().year, datetime.datetime.utcnow().month)[1]
        timeMax = datetime.datetime.utcnow().replace(day=last_day, hour=23, minute=59,second=59).isoformat() + 'Z'
    else:
        format_yearMonth = datetime.datetime.fromisoformat(yearMonth.replace('Z', ""))
        last_day = calendar.monthrange(format_yearMonth.year, format_yearMonth.month)[1]
        timeMin = format_yearMonth.replace(day=1, hour=0, minute=0, second=0).isoformat() + 'Z'
        timeMax = format_yearMonth.replace(day=last_day, hour=23, minute=59, second=59).isoformat() + 'Z'

    # Get local timezone of user
    timezone = get_localzone()  # TODO: Get user set timezone from DB
    
    return jsonify({
        "busy": google_client.get_user_calendar_info(timeMin=timeMin, timeMax=timeMax, timezone=timezone),
        "dayStart": dayStart,
        "dayEnd": dayEnd
    }), 200



    