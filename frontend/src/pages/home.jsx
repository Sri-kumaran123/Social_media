import Status from "../components/status";
import Feed from "../components/post";
import { useEffect, useState } from "react";
import { gethomepost } from "../services/ui.service";
import { Posts } from "./Posts";


function Home(){
    const [list,setlist] = useState([]);
    useEffect(()=>{
        gethomepost()
        .then(res=>setlist(_=>res.data))
    },[])
    return <div className="relative">
        <div className="">
            {/* <Status /> */}
        </div>
        <div>
            {
                list?.map((x,index)=><Posts key={index} post_id={x.id}/>)
            }
        </div>
    </div>
}

export default Home;