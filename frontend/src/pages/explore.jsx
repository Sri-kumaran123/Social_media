import { useEffect, useState } from "react";
import inputBox from "../components/ui/inputbox";
import { BiSearch } from "react-icons/bi";
import { getallpost } from "../services/ui.service";
import { Posts } from "./Posts";
function Explore(){
    const [postlist,setpostlist] = useState([]);
    useEffect(()=>{
        getallpost()
        .then(res=>{
            setpostlist(res.data);
            console.log(postlist)
        })
    },[]);
    const [searchfeild, search] = inputBox({type:"text",placeholder:"search",icon:<BiSearch />})
    return <div className="mt-4">
        <div>
            {searchfeild}
        </div>
        <div>
            {
                postlist.map((x,index)=><Posts key={index} post_id={x.id} />)
            }
        </div>
    </div>
}

export default Explore;