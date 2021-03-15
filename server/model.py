from config import db

class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    google_id = db.Column(db.String(64), unique=True)
    eventType = db.relationship("EventTypes", backref="user")

    def __init__(self, name, email, username, password_hash, google_id):
        self.name = name
        self.email = email
        self.username = username
        self.password_hash = password_hash
        self.google_id = google_id

    def __repr__(self):
        return f"User - id:{self.id}, name:{self.name}, " \
               f"email:{self.email}, username:{self.username}, google_id:{self.google_id}"


class EventTypes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    title = db.Column(db.String(64), nullable=False)
    url = db.Column(db.String(64), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    appointment = db.relationship('Appointments', backref='eventType')

    def __init__(self, user_id, title, url, duration):
        self.user_id = user_id
        self.title = title
        self.url = url
        self.duration = duration

    def __repr__(self):
        return f"EventType - id:{self.id}, user_id:{self.user_id}, " \
               f"title:{self.title}, url:{self.url}, duration:{self.duration}"


class Appointments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    eventType_id = db.Column(db.Integer, db.ForeignKey('event_types.id'))
    name = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(64), nullable=False)
    time = db.Column(db.DateTime, nullable=False)
    timezone = db.Column(db.String(64), nullable=False)

    def __init__(self, eventType_id, name, email, time, timezone):
        self.eventType_id = eventType_id
        self.name = name
        self.email = email
        self.time = time
        self.timezone = timezone

    def __repr__(self):
        return f"Appointment - id:{self.id}, eventType_id:{self.event_id}, " \
               f"name:{self.name}, email:{self.email}, time:{self.time}, timezone:{self.timezone}"
