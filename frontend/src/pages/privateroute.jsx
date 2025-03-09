import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../services/auth.servce.jsx";
import { loginUser } from "../store/slices/usersclice.jsx";
import { useDispatch } from "react-redux";

const PrivateRoute = () => {
  const [ifauth,setauth] = useState(false)
  const dispatch = useDispatch();
  const {getUser} = useAuth();
  useEffect(()=>{
    getUser()
    .then(res=>{
      console.log(res.data.id)
      if(res.data.id){
        setauth(_=>true)
        dispatch(
          loginUser(res.data)
        )
      }else{setauth(_=>false)}
      console.log(ifauth)
    })
  },[])

  

  return true? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
