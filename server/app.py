from flask import Flask
import config
from config import db
from flask_migrate import Migrate
import model
app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)
migrate = Migrate(app, db)
