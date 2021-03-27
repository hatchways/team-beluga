from config import JWT_SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRES
import jwt


def token_generator(userid):
    login_payload = {
        "user_id": userid,
        "exp": JWT_ACCESS_TOKEN_EXPIRES
    }
    token = jwt.encode(payload=login_payload, key=JWT_SECRET_KEY, algorithm='HS256')
    return token

def token_decoder(token):
    try:
        decoded_token = jwt.decode(token, key=JWT_SECRET_KEY, algorithms=['HS256'])
        if decoded_token.get('user_id') is not None:
            return {'success': True, 'user_id': decoded_token['user_id']}
    except Exception as e:
        return {'success': False}
