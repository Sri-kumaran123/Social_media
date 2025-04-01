import { useEffect, useState } from "react";
import { getalluser } from "../services/ui.service";
import { FaUser, FaEnvelope, FaPhone, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (isLoggedIn) {
            getalluser()
                .then(res => {
                    setUsers(res.data);
                })
                .catch(err => console.error("Error fetching users:", err));
        }
    }, [isLoggedIn]);

    const handleLogin = () => {
        if (username === "admin" && password === "password") {
            setIsLoggedIn(true);
            setError("");
        } else {
            setError("Invalid username or password");
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="bg-white  p-6 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full pl-12 mb-4 pr-4 py-3 text-gray-900 bg-white/30 backdrop-blur-xl border border-white/50 rounded-xl shadow-lg outline-none placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full pl-12 mb-4 pr-4 py-3 text-gray-900 bg-white/30 backdrop-blur-xl border border-white/50 rounded-xl shadow-lg outline-none placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="w-full px-6 py-3 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 cursor-pointer"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    const getFilename = (url) => {
        return url?.split("\\")[1] || "";
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Welcome Admin</h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user, index) => (
                        <div key={index} className="relative bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center">
                            {user.blocked_until && (
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                    Blocked
                                </span>
                            )}
                            <img 
                                src={user.profile_path ? `http://localhost:5000/download/${getFilename(user.profile_path)}` : "/temp.png"} 
                                alt="User" 
                                className="w-20 h-20 rounded-full border-2 border-gray-300 mb-4"
                            />
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <FaUser className="text-blue-500" /> {user.username}
                            </h2>
                            <p className="text-gray-600 flex items-center gap-2">
                                <FaEnvelope className="text-red-500" /> {user.email}
                            </p>
                            <p className="text-gray-600 flex items-center gap-2">
                                <FaPhone className="text-green-500" /> {user.phone}
                            </p>
                            <div className="flex justify-center gap-4 mt-4">
                                <span className="flex items-center gap-2 text-blue-500 font-medium">
                                    <FaUsers /> {user.followers} Followers
                                </span>
                                <span className="text-gray-500">|</span>
                                <span className="text-purple-500 font-medium">{user.following} Following</span>
                            </div>
                            <p className="mt-2 text-gray-700 font-medium">Posts: {user.posts.length}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
