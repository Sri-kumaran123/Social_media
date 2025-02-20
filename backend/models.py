from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    _password = db.Column(db.Text, nullable=False)

    @property
    def password(self):
        raise AttributeError("Password is not readable")  

    @password.setter
    def password(self, raw_password):
        self._password = generate_password_hash(raw_password)  

    def check_password(self, password):
        return check_password_hash(self._password, password)
    
    
    # One-to-many relationship: a user can have many posts
    posts = db.relationship('Posts', backref='author', lazy=True)
    

class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.Text, nullable=True)
    video_url = db.Column(db.Text, nullable=True)
    

    
    comments = db.relationship('Comment', backref='comments', lazy=True)
    likes = db.relationship('Likes', backref = 'Likers', lazy = True)

    
    

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)


class Likes(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), primary_key=True)
