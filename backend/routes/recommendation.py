from flask import Blueprint, jsonify, make_response, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Recommendation

recommend_bp = Blueprint('recommend', __name__)

@recommend_bp.route('/recommendation', methods = ['GET'])
@jwt_required()
def get_recommendation(id):
    user_id = get_jwt_identity()