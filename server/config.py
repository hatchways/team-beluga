from os import getenv
from flask_sqlalchemy import SQLAlchemy
import datetime
import os

# SQL ALCHEMY
SQLALCHEMY_DATABASE_URI = getenv('SQLALCHEMY_DATABASE_URI')
SQLALCHEMY_TRACK_MODIFICATIONS = True
db = SQLAlchemy()

# JWT
JWT_SECRET_KEY = getenv("JWT_SECRET_KEY", 'local-secret')
JWT_TOKEN_LOCATION = ['cookies']
JWT_ACCESS_TOKEN_EXPIRES = 1800
JWT_COOKIE_SECURE = False
JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(days=15)
JWT_COOKIE_CSRF_PROTECT = True
JWT_ACCESS_CSRF_HEADER_NAME = "X-CSRF-TOKEN-ACCESS"
JWT_REFRESH_CSRF_HEADER_NAME = "X-CSRF-TOKEN-REFRESH"

# SENDGRID
SENDGRID_API_KEY = getenv('SENDGRID_API_KEY')

# STRIPE
STRIPE_API_KEY = getenv('STRIPE_API_KEY')

# GOOGLE OAUTH
GOOGLE_CLIENT_ID = getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URL = "http://localhost:3000"
GOOGLE_CLIENT_SCOPE = [     
                        "openid", 
                        "https://www.googleapis.com/auth/userinfo.profile", 
                        "https://www.googleapis.com/auth/userinfo.email", 
                        "https://www.googleapis.com/auth/calendar"
                    ]
GOOGLE_TOKEN_URL = getenv("GOOGLE_TOKEN_URL")

