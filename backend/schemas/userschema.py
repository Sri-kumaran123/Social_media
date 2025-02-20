from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from app import ma
from models import User, Posts, Comment

class LikeSchema(ma.SQLAlchemyAutoSchema):
    user_id = fields.Int()
    post_id = fields.Int()

like_schema = LikeSchema()
likes_schema = LikeSchema(many=True)

class CommentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Comment
        load_instance = True

comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)

class PostSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Posts
        include_fk = True

    
    comments = fields.Nested("CommentSchema", many=True, default=[])
    likers = fields.Nested("UserSchema", many=True, exclude=("_password",), default=[])

post_schema = PostSchema()
posts_schema = PostSchema(many=True)

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
 # Exclude password field
        load_instance = True  # Deserialize into model instances

    posts = fields.Nested("PostSchema", many=True, default=[])
    

user_schema = UserSchema()
users_schema = UserSchema(many=True)





   



