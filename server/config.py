import os
from flask_sqlalchemy import SQLAlchemy

TEAM_NAME = os.environ.get('TEAM_NAME')

SQLALCHEMY_DATABASE_URI = "postgresql://postgres:123456@localhost:5432/postgres"
SQLALCHEMY_TRACK_MODIFICATIONS = True
db = SQLAlchemy()
