import { useEffect, useState } from "react";
import { addcomment, checkLike, getPost, givedislike, givelike } from "../services/post_service";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import inputBox from "../components/ui/inputbox";
import customButton from "../components/ui/custombutton";
import Tag from "../components/tag";
// import { handlenavigate } from "../components/popupuserprofile";
import { useNavigate } from "react-router-dom";

export const Posts = ({ post_id }) => {
    const [data, setData] = useState({ post_id });
    const [visible, setvisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getPost(data.post_id).then((res) => {
            // console.log(res.data);
            setData(() => res.data);
        });
    }, []);

    const handlevisible = () => {
        setvisible((prev) => !prev);
    };

    const getFilename = (url) => {
        if (url?.split("/")) {
            // console.log(url.split("/"));
            return url.split("/")[2];
        }
    };
    console.log(data)
    return (
        <div className="bg-white text-black shadow-md rounded-lg p-4 max-w-md mx-auto my-4">
            <div onClick={()=>{
                navigate(`/profile/${data?.user?.id}`)
            }}>
                <Tag  time={"g89"} id={data?.user?.id} url={data?.user?.profile_path}/>
            </div>
            <div>
                {data.image_path ? (
                    <img
                        src={`http://localhost:5000/download/${getFilename(data.image_path)}`}
                        alt="Post"
                        className="w-full rounded-md"
                    />
                ) : (
                    <video controls className="w-full rounded-md">
                        <source
                            src={`http://localhost:5000/download/${getFilename(data.vedio_path)}`}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
            <div>
                <LinkeandComment data={data} handlevisible={handlevisible} />
            </div>
            <div>{visible ? <Popup data={data} handlevisible={handlevisible} /> : ""}</div>
        </div>
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
                className={`flex items-center gap-2 ${Liked ? "text-red-500" : "text-gray-500"} transition`}
            >
                {Liked ? <FaHeart className="w-6 h-6" /> : <FaRegHeart className="w-6 h-6" />}
                <span>{Data?.post?.likes_count}</span>
            </button>

            <button onClick={handlevisible} className="flex items-center gap-2 text-gray-500">
                <FaComment className="w-6 h-6" />
                <span>Comment</span>
            </button>
        </div>
    );
}

function Popup({ data, handlevisible }) {
    const [Data, setdata] = useState({ post_id: data.post_id });
    const [cmdfeild, cmd] = inputBox({ placeholder: "Enter comment", type: "text" });
    const [ch, setch] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getPost(Data.post_id).then((res) => {
            // console.log(res.data);
            setdata(() => res.data);
        });
    }, [ch]);

    const handleaddComment = () => {
        addcomment(Data.post_id, cmd).then(() => setch((prev) => !prev));
    };
    const buttonfeild = customButton({ text: "Add", style: 1, onclick: handleaddComment });

    const checkpostcontent = () => {
        return Data?.post?.comments?.length > 0;
    };

    return (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center">
            <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Comments</h2>
                    <button onClick={handlevisible} className="text-gray-500 hover:text-gray-800">✖</button>
                </div>
                <div className="mt-4">{cmdfeild}{buttonfeild}</div>
                <div className="mt-4 h-40 overflow-y-auto border-t pt-2">
                    {checkpostcontent() ? (
                        <ul className="space-y-2">
                            {Data.post.comments.map((x, index) => (
                                <li key={index} className="border-b pb-2 flex flex-row justify-between px-4">
                                    {console.log("for comment",x)}
                                    <p className="text-sm text-gray-700">{x.content}</p>
                                    <div onClick={()=>{
                                        navigate(`/profile/${x.user_id}`)
                                    }}>
                                    <Tag  time={"g89"} id={x.user_id} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No Comments Yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}