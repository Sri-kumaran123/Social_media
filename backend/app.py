from flask import Flask
from models import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from flask_marshmallow import Marshmallow



jwt = JWTManager()
ma = Marshmallow()

def create_app():
    app = Flask(__name__)

   
    app.config.from_object(Config)

    
    db.init_app(app)
    # with app.app_context():
    #     db.drop_all()
    #     db.create_all() 
    #     print("table created")
    jwt.init_app(app)
    ma.init_app(app)
    CORS(app)  

  
    # db.drop_all()
    # db.create_all()
    from routes.auth import auth_bp
    from routes.post import post_bp
    from routes.comments import comment_bp
    from routes.likes import likes_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(post_bp)
    app.register_blueprint(comment_bp)
    app.register_blueprint(likes_bp)
    
     

    return app
