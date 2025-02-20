from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, set_access_cookies
from models import db, User
from schemas.userschema import user_schema,users_schema

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

    # Set the access token in an HTTP-only cookie
    set_access_cookies(response, access_token)

    return response


# Protect routes with JWT
@auth_bp.route('/protected', methods=['GET'])
@jwt_required()  # Ensure this is the correct decorator for JWT authentication
def get_users():
    all_users = User.query.all()  # Fetch all users
    return users_schema.jsonify(all_users)  # Serialize multiple users
