import { useEffect, useState } from "react";
import { getfolloweruser } from "../services/ui.service";
import { useSelector } from "react-redux";
import Chat from "../components/chatpage";
import { motion } from "framer-motion";
import { FiMessageSquare } from "react-icons/fi";

function Message() {
    const [followerlist, setfollowerlist] = useState([]);
    const currentuser = useSelector(state => state.User);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        getfolloweruser(currentuser.id)
            .then((res) => {
                setfollowerlist(res.data.followers);
            })
            .catch((err) => console.error("Error fetching followers:", err));
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar with followers */}
            <motion.div 
                initial={{ x: -100, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 0.3 }}
                className="w-1/4 bg-white shadow-lg p-4 overflow-y-auto border-r"
            >
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FiMessageSquare className="text-blue-500" /> Messages
                </h2>
                <div className="space-y-2">
                    {followerlist.map((follower, index) => (
                        <motion.div
                            key={index}
                            onClick={() => setSelectedUser(follower)}
                            className={`p-3 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-200 hover:bg-blue-500 hover:text-white ${
                                selectedUser?.id === follower.id ? "bg-blue-500 text-white" : "bg-gray-100"
                            }`}
                            whileHover={{ scale: 1.05 }}
                        >
                            <span>{follower.username}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white shadow-lg">
                {selectedUser ? (
                    <Chat senderId={currentuser.id} receiverId={selectedUser.id} receviername={selectedUser.username} />
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center h-full text-gray-500"
                    >
                        <h1 className="text-2xl font-semibold">Select a conversation</h1>
                        <p>Click on a user to start chatting</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default Message;
