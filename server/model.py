from config import db


class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    google_id = db.Column(db.String(64), unique=True)

    def __init__(self, name, email, username, password_hash, google_id):
        self.name = name
        self.email = email
        self.username = username
        self.password_hash = password_hash
        self.google_id = google_id

    def __repr__(self):
        return f"User - id:{self.id}, name:{self.name}, " \
               f"email:{self.email}, username:{self.username}, google_id:{self.google_id}"
