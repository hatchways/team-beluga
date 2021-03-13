from flask import Flask
from flask_migrate import Migrate
import config
from config import db
from model.model import Users,EventTypes,Appointments
from api.google_login_handler import google_login_handler
from api.google_signup_handler import google_signup_handler
from api.eventType_handler import eventType_handler

app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(google_login_handler)
app.register_blueprint(google_signup_handler)
app.register_blueprint(eventType_handler,url_prefix='/event-types')
