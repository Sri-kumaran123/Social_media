
import api from "./axios.service";

export const getPost =async (post_id) =>{
    try{
        const response = await api.get(`/post/${post_id}`);
        return response;
    } catch (err){
        return new Promise;
    }
}

export const checkLike = async (post_id) =>{
    try{
        
        const response = await api.get(`/liked/${post_id}`);
        console.log(response.data)
        return response.data.status;
    } catch (err){
        return false;
    }
}

export const givedislike = async (post_id) =>{
    try {
        const response = await api.delete(`/like/${post_id}`)
        return response;

    } catch (err) {
        return new Promise;
    }
}
export const givelike = async (post_id) =>{
    try {
        const response = await api.post(`/like/${post_id}`)
        return response;

    } catch (err) {
        return new Promise;
    }
}

export const addcomment = async (post_id,content) =>{
    try {
        const response = await api.post('/comment',{post_id,content})
        return response
    } catch (err){
        
    }
}