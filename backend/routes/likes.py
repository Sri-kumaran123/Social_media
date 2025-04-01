from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Comment, Posts, db, Likes, Recommendation
from schemas.userschema import like_schema, likes_schema, users_schema

likes_bp = Blueprint('likes', __name__)

@likes_bp.route('/like/<string:id>', methods=['POST'])
@jwt_required()
def give_like(id):
    # data = request.get_json()
    user_id = get_jwt_identity()
    post_id = id  # Fixed key

    if not post_id:
        return jsonify({"error": "post_id is required"}), 400

    like = Likes.query.filter_by(user_id=user_id, post_id=post_id).first()
    if like:
        return jsonify({"message": "Like already given"}), 409  # Conflict status

    new_like = Likes(user_id=user_id, post_id=post_id)
    new_recommend = Recommendation(user_id=user_id, post_id=post_id, likes = 1)
    db.session.add(new_like)
    db.session.add(new_recommend)
    db.session.commit()

    return jsonify({
        "message": "Like given",
        "like": like_schema.dump(new_like)
    }), 201  # Created status

@likes_bp.route('/like/<string:id>', methods=['DELETE'])
@jwt_required()
def give_dislike(id):
    # data = request.get_json()
    user_id = get_jwt_identity()
    post_id = id  # Fixed key

    if not post_id:
        return jsonify({"error": "post_id is required"}), 400

    like = Likes.query.filter_by(user_id=user_id, post_id=post_id).first()
    if not like:
        return jsonify({"message": "Like not found"}), 404
    new_recommend = Recommendation(user_id=user_id, post_id=post_id, likes = 0)
    db.session.add(new_recommend)
    db.session.delete(like)
    db.session.commit()

    return jsonify({"message": "Like removed"}), 200

@likes_bp.route('/like', methods = ['GET'])
def get_likeprovider():
    data = request.get_json()
    post_id = data.get('post_id')

    if not post_id:
        return jsonify({"error": "post_id is required"}), 400
    
    Likers = db.session.query(User).join(Likes, User.id == Likes.user_id).filter(
        Likes.post_id == post_id
    ).all()

    return jsonify({
        "Likers":users_schema.dump(Likers)
    }), 200

@likes_bp.route('/liked/<string:id>', methods = ['GET'])
@jwt_required()
def check_liked(id):
    
    user_id = get_jwt_identity()
    print(user_id)
    post_id = id  # Fixed key
    print(post_id)
    like = Likes.query.filter_by(user_id=user_id, post_id=post_id).first()
    if not like:
        return jsonify({
            "status":False
        })
    return jsonify({
            "status":True
        })


