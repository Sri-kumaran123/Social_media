from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Comment, db, Posts
from schemas.userschema import comment_schema, comments_schema

comment_bp = Blueprint('comment', __name__)

@comment_bp.route('/comment', methods = ['POST'])
@jwt_required()
def post_commmand():
    data = request.get_json()
    user_id = get_jwt_identity()
    post_id = data.get("post_id")
    content = data.get("content")
    new_comment = Comment(
        user_id= user_id,
        post_id = post_id,
        content = content
    )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({
        "comment":comment_schema.dump(new_comment),
        "message":"comment posted"
    }), 200

@comment_bp.route('/comment/<int:id>', methods = ['DELETE'])
@jwt_required()
def delete_comment(id):
    current_user_id = get_jwt_identity()
    comment = Comment \
    .query.filter_by(id=id, user_id = current_user_id).first()
    if not comment:
        comment = Comment.query.get(id)
        post = Posts.query.get(comment.post_id)
        owner_user_id = post.user_id
        print(owner_user_id,current_user_id,id)
        check = (int(owner_user_id) == int(current_user_id))
        print(not check)
        if not check:
            return jsonify({
                "message":"Feature Restricted"
            }), 401
       
        now_comment = Comment \
        .query.filter_by(id=id).first()
        db.session.delete(now_comment)
        db.session.commit()
        return jsonify({
            "message":'comment deleted by the owner of the post'
        }), 200
    db.session.delete(comment)
    db.session.commit()
    return jsonify({
        "message":'comment deleted by the owner of the comment'
    }), 200
    
