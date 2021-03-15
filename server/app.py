from flask import Flask
from api.google_login_handler import google_login_handler
from api.google_signup_handler import google_signup_handler
import config
from config import db
from flask_migrate import Migrate
import model
app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(home_handler)
app.register_blueprint(google_login_handler)
app.register_blueprint(google_signup_handler)

