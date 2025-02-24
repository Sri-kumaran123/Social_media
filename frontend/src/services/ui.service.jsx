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