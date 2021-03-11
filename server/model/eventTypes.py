from server.config import db

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