import { CgProfile } from "react-icons/cg";
import { IoHomeSharp } from "react-icons/io5";
import { RiMessage2Fill } from "react-icons/ri";
import { MdOutlineTravelExplore } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { MdGroups } from "react-icons/md";

export const MENU =[
    {name:"Profile", path:'/profile', icon:<CgProfile size={25} />},
    {name:"Home", path:'/', icon:<IoHomeSharp size={25}/>},
    {name:"Message", path:'/chat', icon:<RiMessage2Fill size={25}/>},
    {name:"Post", path:'/addpost', icon:<IoMdAddCircle size={25}/>},
    {name:"Explore", path:'/search', icon:<MdOutlineTravelExplore size={25}/>},
    {name:"Network", path:'/connection', icon:<MdGroups size={25}/>},
]