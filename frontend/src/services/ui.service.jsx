import api from "./axios.service";

export const getlikeStatus = async (post_id) =>{
    try{
        const response = await api.get('liked',{
            post_id
        })
        return response.data.status;

    } catch(err){
        return false
    }
}

export const giveLike = async (post_id) => {
    try{
        const response = await api.post('like',{post_id})
        return response
    }   catch(err){
        return 0
    }
}
export const givedisLike = async (post_id) => {
    try{
        const response = await api.delete('like',{post_id})
        return response
    }   catch(err){
        return 0
    }
}

export const getPost = async (id) =>{
    try{
        const response = await api.get(`/post/${id}`)
        return response.data
    } catch (err){
        return 0
    }
}

export const getalluser = async ()=>{
    try {
        const response = await api.get('/protected')
        return response;
    } catch (err) {

    }
}

export const getfollowinguser = async (user_id) =>{
    try{
        const response = await api.get(`/following/${user_id}`)
        return response
    } catch (err) {

    }
}

export const getfolloweruser = async (user_id) =>{
    try{
        const response = await api.get(`/follower/${user_id}`)
        return response
    } catch (err){

    }
}

export const followuser = async (user_id)=>{
    try {
        const response = await api.post('/follow',{follower_id:user_id})
        return response;
    } catch (err) {

    }
}

export const unfollowuser = async (user_id) =>{
    try{
        const response = await api.delete(`/follow/${user_id}`)
        return response;
    } catch (err){

    }
}

export const getallpost = async () =>{
    try {
        const response = await api.get('/post');
        return response;
    } catch (err) {

    }
}

export const getoneuser= async (id)=>{
    try{
        const response = await api.get(`/oneuser/${id}`)
        return response;
    } catch(err){

    }
}

export const gethomepost = async () =>{
    try{
        const response = await api.get('/getpostunique')
        return response
    } catch (err){
        
    }
}

export const timeAgo = (timestamp) => {
    console.log("time", timestamp);
    
    const now = new Date();
    const createdAt = new Date(timestamp);

    // Convert both to UTC timestamps for accurate comparison
    const nowUTC = now.getTime(); // Current time in milliseconds (UTC)
    const createdAtUTC = createdAt.getTime(); // Provided timestamp in milliseconds (UTC)

    const diffInSeconds = Math.floor((nowUTC - createdAtUTC) / 1000);
    

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    
    return `${diffInDays} days ago`;
};
