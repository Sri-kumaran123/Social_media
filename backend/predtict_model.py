from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import get_jwt_identity, jwt_required
from schemas.userschema import User
import pickle
import os
predict_bp = Blueprint('predict', __name__)
model_path = os.path.join(os.getcwd(), "model", "toxic_comment_model.pkl")
with open(model_path, "rb") as file:
    model = pickle.load(file)


@predict_bp.post('/predict')
@jwt_required()
def predict():
    data= request.get_json()

    text = data.get('text')

    if not text:
        return jsonify({"error": "No text provided"}), 400
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

 

        # Make a prediction (modify preprocessing if needed)
    prediction = model.predict([text])  # Assuming model expects a list of strings

        # Convert to boolean
    result = bool(prediction[0])

    if result:
        user.increment_wrong_word_attempts()
        return jsonify({
            "result": result,
            "message": "Inappropriate language detected. Your warning count has been updated."
        })

    return jsonify({"result": result})
