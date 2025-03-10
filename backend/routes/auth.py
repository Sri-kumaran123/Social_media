from datetime import datetime
import os
import random
from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, set_access_cookies, get_jwt_identity
from models import db, User
from schemas.userschema import user_schema,users_schema
from werkzeug.utils import secure_filename

auth_bp = Blueprint('auth', __name__)

# Register Route - Register a new user
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate input data
    username = data.get('username')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    if not username or not email or not phone or not password:
        return jsonify({"message": "Missing required fields"}), 400

    # Check if user already exists
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"message": "User already exists"}), 400

    # Create new user and hash password
    new_user = User(username=username, email=email, phone=phone)
    new_user.password = password

    # Add user to DB
    db.session.add(new_user)
    db.session.commit()

    return user_schema.jsonify(new_user), 201

# Login Route - Authenticate user and return JWT token
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Validate input data
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Missing email or password"}), 400

    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401
    
    

    # Generate JWT token
    access_token = create_access_token(identity=user.id, additional_claims={"sub": str(user.id)})

    response = make_response(jsonify({
        "message": "Login successful",
        "user": user_schema.dump(user)
    }))

    if user.blocked_until and user.blocked_until > datetime.utcnow():
        response = make_response(jsonify({
            "message": f"Your account is blocked until {user.blocked_until}. Please try again later."
        }))

    # Set the access token in an HTTP-only cookie
    set_access_cookies(response, access_token)

    return response


# Protect routes with JWT
@auth_bp.route('/protected', methods=['GET'])
@jwt_required()  # Ensure this is the correct decorator for JWT authentication
def get_users():
    all_users = User.query.all()  # Fetch all users
    return users_schema.jsonify(all_users)  # Serialize multiple users

@auth_bp.route('/user', methods = ['GET'])
@jwt_required()
def get_user():
    id = get_jwt_identity()
    user = User.query.get(id)
    return user_schema.jsonify(user)

@auth_bp.route('/oneuser/<string:id>',methods = ['GET'])
def getone_user(id):
    user = User.query.get(id)
    return user_schema.jsonify(user)

UPLOAD_FOLDER = "uploads"
ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


@auth_bp.route('/userimgupload', methods = ['POST'])
@jwt_required()
def uploaduser_img():
    user_id = get_jwt_identity()
    data = request.form  # Get form data
    file = request.files.get("file")  # Get file
    

    image_path = None
    
    file_path = None
    if file and allowed_file(file.filename, ALLOWED_IMAGE_EXTENSIONS ):
        ext = file.filename.rsplit('.', 1)[1].lower()  # Extract file extension
        random_prefix = str(random.randint(10000, 99999))  # Generate a random 5-digit number
        filename = secure_filename(f"{random_prefix}_{file.filename}")  # Add random prefix
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)  # Save file locally
        print(file_path)

        # Check if it's an image or video
        if ext in ALLOWED_IMAGE_EXTENSIONS:
            image_path = file_path
    user = User.query.get(user_id)
    if user:
        print(file_path)
        user.profile_path = file_path  # Update the profile_pic column
        print(user.profile_path)
        db.session.commit()
        return jsonify({"message": "Profile picture updated!", "image_url": file_path}), 200
    else:
        return jsonify({"error": "User not found"}), 404
    
@auth_bp.route('/changename', methods = ['POST'])
@jwt_required()
def change_name():
    data = request.get_json()
    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message":"user not found"})
    user.username = data.get("username")
    db.session.commit()
    return jsonify({"message":"name changes","user":user_schema.dump(user)})
        
