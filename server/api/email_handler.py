import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import jsonify, request, Blueprint
import json
from config import SENDGRID_API_KEY

email_handler = Blueprint('email_handler', __name__)


@email_handler.route('/sendemail', methods=['POST'])
def send_email():
    # this part might need to change due to further usage
    data = json.loads(request.get_data())
    from_email = data.get('from')
    to_email = data.get('to')
    message = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject='Sending with Twilio SendGrid is Fun',
        html_content='<strong>and easy to do anywhere, even with Python</strong>')
    # --------------------------------------------------------
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        res = sg.send(message)
        if res.status_code == 202:
            return jsonify({'success': 'true'}), 200
        return jsonify({'success': 'false', 'status': res.status_code, 'msg': res}), 200
    except Exception as e:
        return jsonify({'success': 'false', 'msg': e}), 500

