import { useState } from "react";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";

function Post({ post }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-md mx-auto my-4">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <img src={post.userAvatar} alt="User" className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold">{post.username}</p>
          <p className="text-sm text-gray-500">{post.time}</p>
        </div>
      </div>

      {/* Post Content (Image/Video) */}
      <div className="mt-3">
        {post.type === "image" ? (
          <img src={post.media} alt="Post" className="w-full rounded-md" />
        ) : (
          <video controls className="w-full rounded-md">
            <source src={post.media} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Like & Comment Buttons */}
      <div className="flex justify-between items-center mt-3">
        <button 
          onClick={handleLike} 
          className={`flex items-center gap-2 ${liked ? "text-red-500" : "text-gray-500"} transition`}
        >
          {liked ? <FaHeart className="w-6 h-6" /> : <FaRegHeart className="w-6 h-6" />}
          <span>{likes}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-500">
          <FaComment className="w-6 h-6" />
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
}

export default function Feed() {
  const posts = [
    {
      id: 1,
      username: "John Doe",
      userAvatar: "https://randomuser.me/api/portraits/men/10.jpg",
      time: "2h ago",
      type: "image",
      media: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
      likes: 10,
    },
    {
      id: 2,
      username: "Jane Smith",
      userAvatar: "https://randomuser.me/api/portraits/women/10.jpg",
      time: "5h ago",
      type: "video",
      media: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 22,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
