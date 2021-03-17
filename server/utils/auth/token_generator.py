from config import JWT_SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRES
import jwt


def token_generator(userid):
    login_payload = {
        "user_id": userid,
        "exp": JWT_ACCESS_TOKEN_EXPIRES
    }
    token = jwt.encode(payload=login_payload, key=JWT_SECRET_KEY, algorithm='HS256')
    return token
