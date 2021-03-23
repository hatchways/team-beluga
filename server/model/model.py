from config import db


class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    email = db.Column(db.String(64), unique=True, index=True)
    timezone = db.Column(db.String(64))
    available_day = db.Column(db.String(64))
    available_time = db.Column(db.String(64))
    google_id = db.Column(db.String(64), unique=True)
    url = db.Column(db.String(64), unique=True)
    access_token = db.Column(db.String(512), nullable=False)
    refresh_token = db.Column(db.String(512), nullable=False)
    eventType = db.relationship("EventTypes", backref="user")

    def __init__(self, name, email, timezone, available_day, available_time, google_id, url,access_token, refresh_token):
        self.name = name
        self.email = email
        self.timezone = timezone
        self.available_day = available_day
        self.available_time = available_time
        self.google_id = google_id
        self.url = url
        self.access_token = access_token
        self.refresh_token = refresh_token

    def __repr__(self):
        return f"User - id:{self.id}, name:{self.name}, " \
               f"email:{self.email}, timezone:{self.timezone}, " \
               f"available_day:{self.available_day}, available_time:{self.available_time}, " \
               f"google_id:{self.google_id}, url: {self.url}"

    # Change to dictionary to be returned by jsonify
    def to_dict(self):
        return {column.name:getattr(self,column.name) for column in self.__table__.columns}


class EventTypes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    title = db.Column(db.String(64), nullable=False)
    url = db.Column(db.String(64), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(64))
    appointment = db.relationship('Appointments', backref='eventType')

    def __init__(self, user_id, title, url, duration, color):
        self.user_id = user_id
        self.title = title
        self.url = url
        self.duration = duration
        self.color = color

    def __repr__(self):
        return f"EventType - id:{self.id}, user_id:{self.user_id}, " \
               f"title:{self.title}, url:{self.url}, duration:{self.duration}, color:{self.color}"
    
    # Change to dictionary to be returned by jsonify
    def to_dict(self):
        return {column.name:getattr(self,column.name) for column in self.__table__.columns}


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
