import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    _password = db.Column(db.Text, nullable=False)
    followers = db.Column(db.Integer,default=0)
    following = db.Column(db.Integer,default=0)
    profile_path = db.Column(db.Text,nullable=True)

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
    __tablename__ = "posts"
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=True)
    image_path = db.Column(db.Text, nullable=True)
    video_path = db.Column(db.Text, nullable=True)
    likes_count = db.Column(db.Integer, default=0)
    

    
    comments = db.relationship('Comment', backref='comments', lazy=True)
    likes = db.relationship('Likes', backref = 'Likers', lazy = True,cascade="all, delete-orphan", passive_deletes=True)

    
    

class Comment(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.String(36), db.ForeignKey('posts.id'), nullable=False)


class Likes(db.Model):
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), primary_key=True)
    post_id = db.Column(db.String(36), db.ForeignKey('posts.id', ondelete='CASCADE'), primary_key=True)

class Connection(db.Model):
    follower_id = db.Column(db.String(36), db.ForeignKey('user.id'), primary_key=True)
    following_id = db.Column(db.String(36), db.ForeignKey('user.id'), primary_key=True)

    follower = db.relationship("User", foreign_keys=[follower_id], backref="following_connections")
    following = db.relationship("User", foreign_keys=[following_id], backref="follower_connections")

class Message(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sender_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    sender = db.relationship("User", foreign_keys=[sender_id])
    receiver = db.relationship("User", foreign_keys=[receiver_id])


