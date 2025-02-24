import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../services/auth.servce.jsx";

const PrivateRoute = () => {
  const { getUser, user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      await getUser();
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>; // Show a loading state while fetching

  return user?.id ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
