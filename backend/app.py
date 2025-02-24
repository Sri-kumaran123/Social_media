from flask import Flask
from models import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from flask_marshmallow import Marshmallow



jwt = JWTManager()
ma = Marshmallow()

from sqlalchemy import text

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    
    connection_trigger_add = text("""
    CREATE TRIGGER maintain_connection_add
    AFTER INSERT ON Connection
    FOR EACH ROW
    BEGIN
        UPDATE user
        SET followers = (SELECT COUNT(*) FROM Connection WHERE follower_id = NEW.follower_id)
        WHERE id = NEW.follower_id;
        
        UPDATE user
        SET following = (SELECT COUNT(*) FROM Connection WHERE following_id = NEW.following_id)
        WHERE id = NEW.following_id;
    END;
    """)

    connection_trigger_delete = text("""
    CREATE TRIGGER maintain_connection_delete
    AFTER DELETE ON Connection
    FOR EACH ROW
    BEGIN
        UPDATE user
        SET followers = (SELECT COUNT(*) FROM Connection WHERE follower_id = OLD.follower_id)
        WHERE id = OLD.follower_id;
        
        UPDATE user
        SET following = (SELECT COUNT(*) FROM Connection WHERE following_id = OLD.following_id)
        WHERE id = OLD.following_id;
    END;
    """)

    likes_trigger_add = text("""
    CREATE TRIGGER count_likes_add
    AFTER INSERT ON Likes
    FOR EACH ROW
    UPDATE posts
    SET likes_count = (SELECT COUNT(*) FROM Likes WHERE post_id = NEW.post_id)
    WHERE id = NEW.post_id;
    """)

    likes_trigger_delete = text("""
    CREATE TRIGGER count_likes_delete
    AFTER DELETE ON Likes
    FOR EACH ROW
    UPDATE posts
    SET likes_count = (SELECT COUNT(*) FROM Likes WHERE post_id = OLD.post_id)
    WHERE id = OLD.post_id;
    """)

#     delete_post_trigger = text("""
#     CREATE TRIGGER delete_post
# BEFORE DELETE ON posts
# FOR EACH ROW
# BEGIN
#     DELETE FROM Likes WHERE post_id = OLD.id;
# END;
# """)

    # with app.app_context():
    #     db.drop_all()
    #     db.create_all()
    #     print("Tables created")
        
    #     with db.engine.connect() as connection:
    #         connection.execute(connection_trigger_add)
    #         connection.execute(connection_trigger_delete)
    #         connection.execute(likes_trigger_add)
    #         connection.execute(likes_trigger_delete)
    #         # connection.execute(delete_post_trigger)
    #         print('Triggers created successfully')

    jwt.init_app(app)
    ma.init_app(app)
    # CORS(app)
    CORS(app, supports_credentials=True, origins="http://localhost:5173")

    from routes.auth import auth_bp
    from routes.post import post_bp
    from routes.comments import comment_bp
    from routes.likes import likes_bp
    from routes.connection import connet_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(post_bp)
    app.register_blueprint(comment_bp)
    app.register_blueprint(likes_bp)
    app.register_blueprint(connet_bp)
    
    return app
