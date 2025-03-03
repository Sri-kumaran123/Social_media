import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../services/auth.servce.jsx";

const PrivateRoute = () => {
  const [ifauth,setauth] = useState(false)
  const {getUser} = useAuth();
  useEffect(()=>{
    getUser()
    .then(res=>{
      console.log(res.data.id)
      if(res.data.id){setauth(_=>true)}else{setauth(_=>false)}
      console.log(ifauth)
    })
  },[])

  

  return true? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
