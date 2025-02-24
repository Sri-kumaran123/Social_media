import os
import random
from flask import Blueprint, request, jsonify, make_response, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models import db, Posts, User
from schemas.userschema import post_schema, posts_schema, user_schema

post_bp = Blueprint('post', __name__)

UPLOAD_FOLDER = "uploads"
ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
ALLOWED_VIDEO_EXTENSIONS = {"mp4", "mov", "avi"}

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@post_bp.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.form  # Get form data
    file = request.files.get("file")  # Get file

    image_path = None
    video_path = None

    if file and allowed_file(file.filename, ALLOWED_IMAGE_EXTENSIONS | ALLOWED_VIDEO_EXTENSIONS):
        ext = file.filename.rsplit('.', 1)[1].lower()  # Extract file extension
        random_prefix = str(random.randint(10000, 99999))  # Generate a random 5-digit number
        filename = secure_filename(f"{random_prefix}_{file.filename}")  # Add random prefix
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)  # Save file locally

        # Check if it's an image or video
        if ext in ALLOWED_IMAGE_EXTENSIONS:
            image_path = file_path
        elif ext in ALLOWED_VIDEO_EXTENSIONS:
            video_path = file_path

    new_post = Posts(
        user_id=user_id,
        content=data.get("content"),
        image_path=image_path,
        video_path=video_path
    )

    db.session.add(new_post)
    db.session.commit()

    return post_schema.jsonify(new_post), 201

@post_bp.route('/post/<string:id>', methods=['GET'])
def get_post(id):
    post = Posts.query.filter_by(id=id).first()
    if not post:
        return jsonify({"message": "Post not found"}), 404

    user = User.query.filter_by(id=post.user_id).first()

    # Construct file URLs
    image_url = f"/uploads/{os.path.basename(post.image_path)}" if post.image_path else None
    video_url = f"/uploads/{os.path.basename(post.video_path)}" if post.video_path else None

    response = make_response(jsonify({
        "post": post_schema.dump(post),
        "user": user_schema.dump(user),
        "image_url": image_url,
        "video_url": video_url
    }))

    return response, 200

@post_bp.route('/download/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@post_bp.route('/post',methods = ['GET'])
def getall_post():
    all_post = Posts.query.all()
    return posts_schema.jsonify(all_post), 200

@post_bp.route('/post/<string:id>', methods = ['PUT'])
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

@post_bp.route('/post/<string:id>', methods = ['DELETE'])
@jwt_required()
def delete_post(id):
    user_id = get_jwt_identity()
    post = Posts.query.filter_by(id = id,user_id = user_id).first()
    if not post:
        return jsonify({"message": "Post not found or unauthorized access"}),404
    
    db.session.delete(post)
    db.session.commit()

    return jsonify({"message":"post deleted"}), 200