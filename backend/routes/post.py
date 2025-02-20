from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended  import jwt_required, get_jwt_identity
from models import db, Posts,User
from schemas.userschema import post_schema,posts_schema,user_schema

post_bp = Blueprint('post', __name__)

@post_bp.route('/post',methods = ['POST'])
@jwt_required()
def create_post():
    data = request.get_json()
    print(get_jwt_identity())
    new_post = Posts(
        user_id = get_jwt_identity(),
        content = data.get("content"),
        image_url = data.get("image_url"),
        video_url = data.get("video_url")
    )

    db.session.add(new_post)
    db.session.commit()

    return post_schema.jsonify(new_post), 201

@post_bp.route('/post/<int:id>', methods = ['GET'])
def get_post(id):
    post = Posts.query.filter_by(id = id).first()
    if not post:
        return jsonify({"message": "Post not found"}),404
    print(post.user_id)
    user = User.query.filter_by(id = post.user_id).first()
    print(user.username)
    response = make_response(jsonify({
        "post":post_schema.dump(post),
        'user':user_schema.dump(user)
    }))

    return response, 200

@post_bp.route('/post',methods = ['GET'])
def getall_post():
    all_post = Posts.query.all()
    return posts_schema.jsonify(all_post), 200

@post_bp.route('/post/<int:id>', methods = ['PUT'])
@jwt_required()
def edit_post(id):
    user_id = get_jwt_identity()
    post = Posts.query.filter_by(id = id,user_id = user_id).first()
    if not post:
        return jsonify({"message": "Post not found or unauthorized access"}),404
    data = request.get_json()
    updated_post = Posts.query \
    .get(id) 
    
    updated_post.user_id = user_id,
    updated_post.content = data.get("content"),
    updated_post.image_url = data.get("image_url"),
    updated_post.video_url = data.get("video_url")
    
    
    db.session.commit()

    return post_schema.jsonify(updated_post), 201

@post_bp.route('/post/<int:id>', methods = ['DELETE'])
@jwt_required()
def delete_post(id):
    user_id = get_jwt_identity()
    post = Posts.query.filter_by(id = id,user_id = user_id).first()
    if not post:
        return jsonify({"message": "Post not found or unauthorized access"}),404
    
    db.session.delete(post)
    db.session.commit()

    return jsonify({"message":"post deleted"}), 200