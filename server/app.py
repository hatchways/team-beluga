from flask import Flask
import config
from config import db
from server.model.users import Users
from flask_migrate import Migrate


app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)
migrate = Migrate(app, db)
