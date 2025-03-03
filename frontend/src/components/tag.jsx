import { useEffect, useState } from "react";
import { getoneuser } from "../services/ui.service";

function Tag({username,url,id,time}){
    const [user,setuser] = useState({});
    useEffect(()=>{
        getoneuser(id)
        .then(res=>setuser(res.data))
        
    },[])
    console.log(user)

    const getFilename = (url) => {
      if (url?.split("\\")) {
          // console.log(url.split("/"));
          return url.split("\\")[1];
      }
    };
    return <div className="flex items-center gap-3">
    <img src={`http://localhost:5000/download/${getFilename(url || user.profile_path)}`} alt="User" className="w-10 h-10 rounded-full" />
    <div>
      <p className="font-semibold">{user.username || username}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  </div>
}

export default Tag;