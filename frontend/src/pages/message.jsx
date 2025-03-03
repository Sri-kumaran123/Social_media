import { useEffect, useState } from "react";
import { getfolloweruser } from "../services/ui.service";
import { useSelector } from "react-redux";
import Chat from "../components/chatpage";

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
        <div className="flex min-h-1/2 bg-gray-200">
            {/* Sidebar with followers */}
            <div className="w-1/4 bg-white shadow-lg p-4 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-3">Messages</h2>
                <div className="space-y-2">
                    {followerlist.map((follower, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedUser(follower)}
                            className={`p-3 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white ${
                                selectedUser?.id === follower.id ? "bg-blue-500 text-white" : "bg-gray-100"
                            }`}
                        >
                            {follower.username}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white shadow-lg">
                {selectedUser ? (
                    <Chat senderId={currentuser.id} receiverId={selectedUser.id} receivername={selectedUser.username} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <h1 className="text-2xl font-semibold">Select a conversation</h1>
                        <p>Click on a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Message;
