from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import jsonify
from config import SENDGRID_API_KEY


def send_email(from_email, to_email, subject, content):
    message = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=subject,
        html_content=content)
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        res = sg.send(message)
        if res.status_code == 202:
            return jsonify({'success': 'true'})
        return jsonify({'success': 'false', 'status': res.status_code, 'msg': res})
    except Exception as e:
        return jsonify({'success': 'false', 'msg': e})