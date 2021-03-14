from flask import Flask
import config
from config import db
from flask_migrate import Migrate
import model
from api.url_check_handler import url_check_handler
from api.user_info_handler import user_info_handler

app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(url_check_handler)
app.register_blueprint(user_info_handler)