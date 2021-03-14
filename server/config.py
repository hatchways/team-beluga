import os
from flask_sqlalchemy import SQLAlchemy

SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
SQLALCHEMY_TRACK_MODIFICATIONS = True
db = SQLAlchemy()

