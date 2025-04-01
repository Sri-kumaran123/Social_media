import { useEffect, useState } from "react";
import { checkcomment, addcomment, checkLike, getPost, givedislike, givelike } from "../services/post_service";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import inputBox from "../components/ui/inputbox";
import customButton from "../components/ui/custombutton";
import Tag from "../components/tag";
// import { handlenavigate } from "../components/popupuserprofile";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../components/ui/alertmessage";
import { timeAgo } from "../services/ui.service";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
export const Posts = ({ post_id }) => {
    const [data, setData] = useState({ post_id });
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getPost(data.post_id).then((res) => {
            setData(res.data);
        });
    }, []);

    const toggleVisible = () => setVisible((prev) => !prev);
    
    const getFilename = (url) => url?.split("/")[2] || "";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="bg-white text-gray-900 shadow-lg rounded-xl p-6 max-w-lg mx-auto my-6"
        >
            {/* User Info */}
            <div onClick={() => navigate(`/profile/${data?.user?.id}`)} className="cursor-pointer">
                <Tag time={timeAgo(data?.post?.created_at)} id={data?.user?.id} username={data?.user?.username} url={data?.user?.profile_path} />
            </div>
            
            {/* Media Content */}
            <div className="my-4 overflow-hidden rounded-lg shadow-md">
                {data.image_path ? (
                    <motion.img
                        src={`http://localhost:5000/download/${getFilename(data.image_path)}`}
                        alt="Post"
                        className="w-full rounded-lg object-cover"
                        whileHover={{ scale: 1.02 }}
                    />
                ) : (
                    <motion.video
                        controls
                        className="w-full rounded-lg"
                        src={`http://localhost:5000/download/${getFilename(data.video_path)}`}
                        whileHover={{ scale: 1.02 }}
                    >
                        <source src={`http://localhost:5000/download/${getFilename(data.video_path)}`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </motion.video>
                )}
            </div>
            
            {/* Post Content */}
            <p className="text-lg text-center font-medium text-gray-700">{data?.post?.content}</p>
            
            {/* Actions */}
            <div className="mt-4">
                <LinkeandComment data={data} handlevisible={toggleVisible} />
            </div>
            
            {/* Popup */}
            {visible && <Popup data={data} handlevisible={toggleVisible} />}
        </motion.div>
    );
};

function LinkeandComment({ data, handlevisible }) {
    const [Liked, setLiked] = useState(false);
    const [Data, setdata] = useState({ post_id: data.post_id });
    const [change, setChange] = useState(false);

    useEffect(() => {
        checkLike(Data.post_id).then((res) => setLiked(res));
        getPost(Data.post_id).then((res) => {
            // console.log(res.data);
            setdata(() => res.data);
        });
    }, [change]);

    const handleClick = () => {
        if (Liked) {
            givedislike(Data.post_id).then(() => setChange((prev) => !prev));
        } else {
            givelike(Data.post_id).then(() => setChange((prev) => !prev));
        }
    };

    return (
        <div className="flex items-center justify-between mt-4">
            <button
                onClick={handleClick}
                className={`flex items-center gap-2 cursor-pointer ${Liked ? "text-red-500" : "text-gray-500"} transition`}
            >
                {Liked ? <FaHeart className="w-6 h-6" /> : <FaRegHeart className="w-6 h-6" />}
                <span>{Data?.post?.likes_count}</span>
            </button>

            <button onClick={handlevisible} className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <FaComment className="w-6 h-6" />
                <span>Comment</span>
            </button>
        </div>
    );
}

function Popup({ data, handlevisible }) {
    const [Data, setData] = useState({ post_id: data.post_id });
    const [cmdfeild, cmd] = inputBox({ placeholder: "Enter comment", type: "text" });
    const [ch, setCh] = useState(false);
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState(false);

    useEffect(() => {
        getPost(Data.post_id).then((res) => {
            setData(() => res.data);
        });
    }, [ch]);

    const handleAddComment = () => {
        checkcomment(cmd).then((res) => {
            if (!res.data.result) {
                addcomment(Data.post_id, cmd).then(() => setCh((prev) => !prev));
            } else {
                setAlertMessage(true);
                setTimeout(() => setAlertMessage(false), 3000);
            }
        });
    };
    
    const buttonField = customButton({ text: "Add", style: 1, onclick: handleAddComment });
    const checkPostContent = () => Data?.post?.comments?.length > 0;

    return (
        <motion.div 
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
        >
            {alertMessage && <AlertMessage msg={"Wrong comment detected"} />}
            <motion.div 
                className="bg-white text-black p-6 rounded-lg shadow-xl w-full max-w-lg relative"
                initial={{ scale: 0.8 }} 
                animate={{ scale: 1 }} 
                transition={{ duration: 0.3 }}
            >
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-bold flex items-center gap-2"><FaRegCommentDots /> Comments</h2>
                    <button onClick={handlevisible} className="text-gray-500 hover:text-gray-800">
                        <AiOutlineClose className="text-xl" />
                    </button>
                </div>
                <div className="mt-4 flex gap-2">{cmdfeild}{buttonField}</div>
                <div className="mt-4 max-h-60 overflow-y-auto border-t pt-2">
                    {checkPostContent() ? (
                        <ul className="space-y-3">
                            {Data.post.comments.map((x, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-md">
                                    <p className="text-sm text-gray-700">{x.content}</p>
                                    <div onClick={() => navigate(`/profile/${x.user_id}`)} className="cursor-pointer">
                                        <Tag time={timeAgo(x.created_at)} id={x.user_id} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center">No Comments Yet</p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}