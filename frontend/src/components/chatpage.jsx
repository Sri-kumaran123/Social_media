import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

// Connect to Socket.IO backend with WebSocket and polling transport fallback
const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });

const Chat = ({ senderId, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const roomData = { sender_id: senderId, receiver_id: receiverId };
        console.log("🔹 Joining chat room:", roomData);
        socket.emit("join_chat", roomData);

        // Fetch previous messages from the backend
        axios.get(`http://localhost:5000/get_messages/${senderId}/${receiverId}`)
            .then((res) => {
                console.log("📥 Fetched messages:", res.data.messages);
                setMessages(res.data.messages);
            })
            .catch((err) => console.error("❌ Error fetching messages:", err));

        // Listen for new incoming messages
        const handleMessage = (message) => {
            console.log("📩 New message received:", message);
            setMessages((prev) => [...prev, message]);
        };

        socket.on("receive_message", handleMessage);

        return () => {
            socket.off("receive_message", handleMessage);
            socket.emit("leave_chat", roomData);
        };
    }, [senderId, receiverId]);

    const sendMessage = () => {
        if (newMessage.trim() !== "") {
            const messageData = JSON.stringify({
                sender_id: senderId,
                receiver_id: receiverId,
                message: newMessage,
            });

            console.log("📤 Sending message:", messageData);
            socket.emit("send_message", messageData);
            setNewMessage("");
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="p-4 bg-blue-500 text-white text-lg font-semibold shadow-md">
                Chat with {receiverId}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                {messages.map((msg, index) => {
                    const sender = msg.sender || msg.sender_id;
                    const messageContent = msg.message || msg.content;
                    const isSender = sender === senderId;

                    return (
                        <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"} w-full my-2`}>
                            <div className={`p-2 max-w-xs ${isSender ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-lg w-fit`}>
                                <strong>{isSender ? "You" : "Other"}:</strong> {messageContent}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white border-t flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
