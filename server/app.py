from flask import Flask
from api.ping_handler import ping_handler
from api.home_handler import home_handler
import config
from config import db
from model import Users
from flask_migrate import Migrate


app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)
migrate = Migrate(app, db)


app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)

