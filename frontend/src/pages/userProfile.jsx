import { useSelector } from "react-redux";
import { Posts } from "./Posts";
import { useEffect, useState } from "react";
import { useAuth } from "../services/auth.servce";
import { useParams } from "react-router-dom";
import { getoneuser } from "../services/ui.service";
import api from "../services/axios.service";

export const UserProfile = () => {
    const { id } = useParams();
    const [User, setUser] = useState({});
    const currentuser = useSelector(state=>state.User);
    const { getUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!id) {
            getUser().then(res => {
                console.log(res.data);
                setUser(res.data);
                setUsername(res.data.username);
                setProfileImage(res.data.profile_path);
            });
        } else {
            getoneuser(id).then(res => {
                console.log(res);
                setUser(res.data);
                setUsername(res.data.username);
                setProfileImage(res.data.profile_path);
            });
        }
    }, [id,profileImage]);

    const handleSave = async () => {
        try {
            const response = await api.post("/changename", { username }, {
                headers: {
                    Authorization: `Bearer ${currentuser.token}`, // Ensure authentication
                },
            });
    
            if (response.data.message === "name changes") {
                setUser((prev) => ({ ...prev, username: response.data.user.username }));
                setEditing(false);
                setShowPopup(false);
            }
        } catch (error) {
            console.error("Failed to update username:", error);
        }
    };
    

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await api.post("userimgupload", formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            }});

        // Assuming the server returns the image URL
        if (response.data.image_url) {
            setProfileImage(response.data.image_url);
        }
    } catch (error) {
        console.error("Image upload failed:", error);
    }
    };

    const getFilename = (url) => {
        if (url?.split("\\")) {
            // console.log(url.split("/"));
            return url.split("\\")[1];
        }
    };

    return (
        <div className="bg-white text-black min-h-screen p-6 flex flex-col items-center">
            <div className="bg-white/30 p-6 rounded-lg shadow-lg w-full max-w-lg text-center">
                <div className="flex flex-col items-center">
                    {console.log(profileImage)}
                    <img
                        src={`http://localhost:5000/download/${getFilename(profileImage)}`}
                        alt="logo"
                        className="w-24 h-24 rounded-full border-4 border-white cursor-pointer"
                        onClick={() => setShowPopup(true)}
                    />
                </div>
                <div className="mt-6 text-3xl">
                    <h1>{User.username}</h1>
                </div>
                <div className="mt-6">
                    <div className="flex justify-around">
                        <div className="text-center">
                            <h2 className="text-lg font-medium">Following</h2>
                            <p className="text-xl font-bold">{User.following}</p>
                        </div>
                        <div className="text-center">
                            <h2 className="text-lg font-medium">Followers</h2>
                            <p className="text-xl font-bold">{User.followers}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-lg mt-8">
                {User.posts?.length === 0 ? (
                    <p className="text-gray-400 text-center">No post yet</p>
                ) : (
                    User.posts?.map((x, index) => <Posts post_id={x.id} key={index} />)
                )}
            </div>

            {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            {console.log("this",currentuser.id,User.id)}
            {User.id === currentuser.id ? (
                <>
                    <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
                    <img src={`http://localhost:5000/download/${getFilename(profileImage)}`} 
                        alt="Preview" className="w-32 h-32 rounded-full mx-auto mb-4" />
                    {editing ? (
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="p-2 border rounded w-full"
                        />
                    ) : (
                        <h1 className="text-2xl font-semibold">{User.username}</h1>
                    )}
                    {editing ? (
                        <button onClick={handleSave} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                    ) : (
                        <button onClick={() => setEditing(true)} className="mt-2 bg-gray-300 px-4 py-2 rounded">Edit</button>
                    )}
                </>
            ) : (
                // 🔹 View-Only Mode: Enlarged Profile Image
                <img src={`http://localhost:5000/download/${getFilename(profileImage)}`} 
                    alt="Preview" className="w-64 h-64 rounded-full mx-auto" />
            )}
            <button onClick={() => setShowPopup(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
        </div>
    </div>
)}

        </div>
    );
};
