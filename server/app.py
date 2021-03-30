from flask import Flask
from flask_migrate import Migrate
import config
from config import db
from api.user_info_handler import user_info_handler
from model.model import Users,EventTypes,Appointments
from api.google_login_handler import google_login_handler
from api.google_signup_handler import google_signup_handler
from api.eventType_handler import eventType_handler
from api.subscribe_handler import subscription_handler
from api.availability_handler import availability_handler
from api.logout_handler import logout_handler
from api.jwt_check_handler import token_check_handler

app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(user_info_handler)
app.register_blueprint(google_login_handler)
app.register_blueprint(google_signup_handler)
app.register_blueprint(logout_handler)
app.register_blueprint(eventType_handler,url_prefix='/event-types')
app.register_blueprint(subscription_handler)
app.register_blueprint(availability_handler)
app.register_blueprint(token_check_handler)
