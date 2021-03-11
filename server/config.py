import os
from flask_sqlalchemy import SQLAlchemy

SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
SQLALCHEMY_TRACK_MODIFICATIONS = True
db = SQLAlchemy()
