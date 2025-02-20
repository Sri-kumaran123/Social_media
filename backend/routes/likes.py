from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Comment, Posts, db, Likes
from schemas.userschema import like_schema, likes_schema

likes_bp = Blueprint('likes', __name__)

@likes_bp.route('/like', methods = ['POST'])
@jwt_required()
def give_like():
    data = request.get_json()
    user_id = get_jwt_identity()
    like_content_id = data.get('content_id')
    like = Likes.query.filter_by(user_id = user_id, post_id = like_content_id).first()
    if like :
        return jsonify({
            "message":"likes already given"
        })
    new_like = Likes(user_id = user_id, post_id= like_content_id)
    db.session.add(new_like)
    db.session.commit()
    return jsonify({
        "message":"likes given",
        "like":like_schema.dump(new_like)
    })

@likes_bp.route('/like', methods = ['DELETE'])
@jwt_required()
def give_dislike():
    data = request.get_json()
    user_id = get_jwt_identity()
    like_content_id = data.get('content_id')
    like = Likes.query.filter_by(user_id = user_id, post_id = like_content_id).first()
    if not like :
        return jsonify({
            "message":"like not given"
        })
    db.session.delete(like)
    db.session.commit()
    return jsonify({
        "message":"like deleted"
    })