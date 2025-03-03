from flask import Blueprint, jsonify, make_response, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Connection,db
from schemas.userschema import connect_schema, comments_schema,users_schema

connet_bp= Blueprint('connect', __name__)

@connet_bp.route('/follow', methods = ['POST'])
@jwt_required()
def get_follow():
    data = request.get_json()
    follower_id = data.get("follower_id")
    following_id = get_jwt_identity()
    connection = Connection.query.filter_by(
        follower_id = follower_id,
        following_id = following_id
    ).first()
    if connection:
        return jsonify({
            "msg":"already connected"
        })
    new_connection = Connection(
        follower_id = follower_id,
        following_id = following_id
    )
    db.session.add(new_connection)
    db.session.commit()

    return jsonify({
        "data":connect_schema.dump(new_connection),
        "msg":"done"
    })

@connet_bp.route('/follow/<string:id>', methods = ['DELETE'])
@jwt_required()
def get_unfollow(id):
    
    follower_id = id
    following_id = get_jwt_identity()
    connection = Connection.query.filter_by(
        follower_id = follower_id,
        following_id = following_id
    ).first()
    if not connection:
        return jsonify({
            "msg":"No connection found between user"
        })
    db.session.delete(connection)
    db.session.commit()
    return jsonify({
        "msg":"Unfollowed"
    })

@connet_bp.route('/follower/<string:id>', methods = ['GET'])
@jwt_required()
def get_list_followers(id):
    
    user_id = id  # Get from query params

    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400

    # Query users who follow the given user_id
    followers = db.session.query(User).join(Connection, User.id == Connection.following_id).filter(
        Connection.follower_id == user_id
    ).all()

    # Convert to JSON format

    return jsonify({'followers': users_schema.dump(followers)}), 200

@connet_bp.route('/following/<string:id>', methods = ['GET'])
@jwt_required()
def get_list_following(id):
    
    user_id = id  # Get from query params

    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400

    # Query users who follow the given user_id
    followers = db.session.query(User).join(Connection, User.id == Connection.follower_id).filter(
        Connection.following_id == user_id
    ).all()

    # Convert to JSON format

    return jsonify({'following': users_schema.dump(followers)}), 200



