import { useEffect, useState } from "react";
import { UserProfile } from "../pages/userProfile";
import {  useParams } from "react-router-dom";
import { getoneuser } from "../services/ui.service";


function Popupuserprofile(){
    
    return <div >
            <div >
                <UserProfile  />
            </div>
    </div>
}


export default Popupuserprofile;