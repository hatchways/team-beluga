from flask import jsonify, Blueprint, request, make_response
logout_handler = Blueprint('logout_handler', __name__)


@logout_handler.route('/logout', methods=['POST'])
def logout():

    if request.cookies.get("token"):
        ret = jsonify({
            'response': 'Logout successful',
        })
        ret.set_cookie('token',expires=0)
        return ret,200
    
    return jsonify({
            'response': 'Logout failed',
        }),400