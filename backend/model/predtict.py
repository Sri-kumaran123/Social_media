from flask import Blueprint, request, jsonify, make_response
import pickle
import os
predict_bp = Blueprint('predict', __name__)
model_path = os.path.join(os.getcwd(), "model", "toxic_comment_model.pkl")
with open(model_path, "rb") as file:
    model = pickle.load(file)


@predict_bp.post('/predict')
def predict():
    data= request.get_json()

    text = data.get('text')

    if not text:
        return jsonify({"error": "No text provided"}), 400

        # Make a prediction (modify preprocessing if needed)
    prediction = model.predict([text])  # Assuming model expects a list of strings

        # Convert to boolean
    result = bool(prediction[0])

    return jsonify({"result": result})
