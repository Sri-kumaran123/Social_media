import os

class Config:
    SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'my_secret_key_to')
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URI', 'mysql+pymysql://root:password@localhost/mydatabase'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.getenv('FLASK_ENV') == 'development'

    # JWT Configuration for Cookie-based Authentication
    JWT_SECRET_KEY = SECRET_KEY  # Use the same secret key for JWT
    JWT_TOKEN_LOCATION = ["cookies"]  # Store JWT in cookies
    JWT_COOKIE_SECURE = False  # Set to True in production (HTTPS required)
    JWT_ACCESS_COOKIE_NAME = "access_token_cookie"  # Name of the cookie
    JWT_REFRESH_COOKIE_NAME = "refresh_token_cookie"  # Optional for refresh token
    JWT_COOKIE_CSRF_PROTECT = False  # Set to True if using CSRF protection
    