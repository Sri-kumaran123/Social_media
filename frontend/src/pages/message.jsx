import { useEffect, useState } from "react";
import { getfolloweruser } from "../services/ui.service";
import { useSelector } from "react-redux";


function Message(){
    const [followerlist,setfollowerlist] = useState([]);
    const currentuser = useSelector(state => state.User)
    useEffect(()=>{
        getfolloweruser(currentuser.id)
        .then((res)=>{
            setfollowerlist(_=>res.data)
        })
    },[])
    console.log(followerlist)
    return <div>
        <div>
            {
                followerlist?.followers?.map((x,index)=><div key={index}>
                        {x.username}
                </div>)
            }
        </div>
    </div>

}

export default Message;