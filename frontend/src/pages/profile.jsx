import { useState } from "react";
import { FaHeart, FaRegHeart, FaTimes, FaComment } from "react-icons/fa";
import { useSelector } from "react-redux";
import {getlikeStatus,givedisLike, giveLike} from "../services/ui.service.jsx";



function Profile() {
  // const [user, setUser] = useState({
  //   username: "john_doe",
  //   profilePic: "https://via.placeholder.com/150",
  // });
  const user = useSelector(state => state.User);

  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState("");
  

  const openModal = (post) => setSelectedPost(post);
  const closeModal = () => {
    setSelectedPost(null);
    setComments("");
  };

  const toggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Section */}
      <div className=" items-center bg-white shadow-md p-6 rounded-lg flex flex-row justify-evenly">
        <div className="flex flex-col items-center">
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover "
        />
        <h2 className="text-xl font-semibold mt-4">{user.username}</h2>
        </div>
        
        <div>
            <h3 className="text-2xl font-semibold cursor-pointer">followers</h3>
            <p className="text-center text-2xl">{user.followers}</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold cursor-pointer">following</h3>
            <p className="text-center text-2xl">{user.following}</p>
          </div>
      </div>

      {/* User Posts Grid */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">User's Posts</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* {posts.map((post) => (
            <div key={post.id} className="relative cursor-pointer" onClick={() => openModal(post)}>
              {post.type === "image" ? (
                <img src={post.src} alt="Post" className="w-full h-40 object-cover rounded-md" />
              ) : (
                <video src={post.src} className="w-full h-40 object-cover rounded-md" />
              )}
            </div>
          ))} */}
          {console.log(user)}

          {
            user.posts.length > 0?
            
              user.posts.map((x,index)=><Postbox post={x} />)
            
            :
            <div className="text-3xl items-center justify-center ">No Post yet</div>
          }
        </div>
      </div>

      {/* Modal for Viewing Posts */}
      {selectedPost && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={closeModal} // Click outside to close
        >
          <div
            className="bg-white p-4 rounded-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto pt-10"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
          >
            {/* Close Button */}
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={closeModal}>
              <FaTimes size={24} />
            </button>

            {/* Image or Video */}
            {selectedPost.type === "image" ? (
              <img src={selectedPost.src} alt="Full View" className="w-full max-h-[80vh] object-contain rounded-md" />
            ) : (
              <video src={selectedPost.src} controls className="w-full max-h-[80vh] object-contain rounded-md" />
            )}

            <p className="text-center text-gray-700 mt-2">{selectedPost.description}</p>

            {/* Like & Comment Section */}
            <div className="mt-4 flex justify-between items-center">
              <button onClick={() => toggleLike(selectedPost.id)} className="flex items-center gap-1 text-red-500">
                {selectedPost.liked ? <FaHeart /> : <FaRegHeart />} {selectedPost.likes}
              </button>

              <button className="flex items-center gap-1 text-gray-600">
                <FaComment /> Comment
              </button>
            </div>

            {/* Comment Box */}
            <div className="mt-3">
              <textarea
                className="w-full border rounded-md p-2"
                placeholder="Write a comment..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              ></textarea>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Post Comment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export const Postbox =({post})=>{
  const getData=(url)=>{
    console.log(url.split('\\')[1]);
    return url.split('\\')[1]
  }
  console.log(post)
  getData(post.image_path)
  return <div
    className="relative cursor-pointer"
  >
    {post.image_path ? (
          <img src={`http://localhost:5000/download/${getData(post.image_path)}`} alt="Post" className="w-full rounded-md" />
        ) : (
          <video controls className="w-full rounded-md">
            <source 
            src={`http://localhost:5000/download/${getData(post.vedio_path)}`} 
            type="video/mp4" />
            Your browser does not support the video tag.
          </video>
    )}
    <LikersComp post={post} />
  </div>
}

const Model = ({post, closeModal}) =>{
  return <div
  className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md"
  onClick={closeModal}
  >
    <div
      className="bg-white p-4 rounded-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto pt-10"
      onClick={(e) => e.stopPropagation()} 
    >
      <Postbox post={post} />

      <p className="text-center text-gray-700 mt-2">{post.content?post.content:""}</p>

    </div>

  </div>
}

export const LikersComp = ({post}) =>{

  const [likes, setLikes] = useState(post.likes_count);
  const [liked, setLiked] = useState(getlikeStatus(post.id));

  const handleLike = () => {
    
    setLikes(liked ? (
      giveLike(post.id)
      .then(()=>{
        setLiked(!liked);
        return likes - 1
      })
    ) : (
     givedisLike(post.d)
     .then(()=>{
      setLiked(!liked);
      return likes +1
     })
    ));
  };
  return <div className="flex justify-between items-center mt-3">
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
}
export default Profile;
