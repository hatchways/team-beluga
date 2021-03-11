from flask import jsonify, Blueprint
google_signup_handler = Blueprint('google_signup_handler', __name__)


@google_signup_handler.route('/googlesignup', methods=['POST'])
def googlesignup():
    return jsonify({'response': 'Signup success'}), 200
