
import { Link, NavLink } from 'react-router-dom';
import {MENU} from '../assets/constants';
function Menu(){
    return <ul
    className='flex md:flex-col flex-row bg-white'
    >
        {
            MENU.map((x,index)=><NavLink 
            key={index}
            className={({isActive})=>{
                return isActive?
                "text-white font-semibold bg-black cursor-pointer px-6 py-5 transition-all md:rounded-md rounded-full w-full":"text-black cursor-pointer px-6 py-5 transition-all w-full"
            }}
            to={x.path}
            
            >
            <li className='flex flex-row items-center '>
                <span className='md:pl-5  '>
                {x.icon}
                </span>
                <span className='pl-5 hidden md:inline'>
                {x.name}
                </span></li>

            </NavLink>)
        }

    </ul>
}

export default Menu;