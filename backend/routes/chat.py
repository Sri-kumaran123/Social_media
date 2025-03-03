from flask import Blueprint, request, jsonify
from flask_socketio import emit, join_room, leave_room, SocketIO
from models import db, Message
from datetime import datetime
import uuid
import json

socketio = SocketIO(cors_allowed_origins="*")
chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/get_messages/<sender_id>/<receiver_id>", methods=["GET"])
def get_messages(sender_id, receiver_id):
    messages = Message.query.filter(
        ((Message.sender_id == sender_id) & (Message.receiver_id == receiver_id))
        | ((Message.sender_id == receiver_id) & (Message.receiver_id == sender_id))
    ).order_by(Message.timestamp).all()

    return jsonify({"messages": [{"sender_id": msg.sender_id, "content": msg.content, "timestamp": msg.timestamp} for msg in messages]})

@socketio.on("join_chat")
def handle_join_chat(data):
    try:
        print("🔹 Raw join data:", data)

        # Ensure `data` is a dictionary
        if isinstance(data, str):
            data = json.loads(data)

        sender_id = str(data.get("sender_id", ""))
        receiver_id = str(data.get("receiver_id", ""))

        if not sender_id or not receiver_id:
            raise ValueError("⚠️ Missing sender_id or receiver_id")

        room = f"chat_{min(sender_id, receiver_id)}_{max(sender_id, receiver_id)}"
        join_room(room)
        print(f"✅ User {sender_id} joined chat {room}")

    except Exception as e:
        print(f"❌ Error in handle_join_chat: {e}")

@socketio.on("send_message")
def handle_send_message(data):
    try:
        print("📩 Received message:", data)

        # Ensure `data` is a dictionary
        if isinstance(data, str):
            data = json.loads(data)

        sender_id = data.get("sender_id")
        receiver_id = data.get("receiver_id")
        content = data.get("message")

        if not sender_id or not receiver_id or not content:
            print("⚠️ Missing data in send_message event")
            return

        # Save message to the database
        new_message = Message(
            id=str(uuid.uuid4()),
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content,
            timestamp=datetime.utcnow(),
        )
        db.session.add(new_message)
        db.session.commit()

        room = f"chat_{min(sender_id, receiver_id)}_{max(sender_id, receiver_id)}"
        print(f"📡 Emitting to room: {room}")

        # Emit the message to the correct room
        socketio.emit(
            "receive_message",
            {"sender_id": sender_id, "message": content},
            room=room,
        )

    except Exception as e:
        print(f"❌ Error in handle_send_message: {e}")

@socketio.on("leave_chat")
def handle_leave_chat(data):
    try:
        if isinstance(data, str):
            data = json.loads(data)

        room = f"chat_{data['sender_id']}_{data['receiver_id']}"
        leave_room(room)
        print(f"👋 User {data['sender_id']} left room {room}")

    except Exception as e:
        print(f"❌ Error in handle_leave_chat: {e}")

@socketio.on("connect")
def handle_connect():
    print("✅ Client connected")

@socketio.on("disconnect")
def handle_disconnect():
    print("❌ Client disconnected")
