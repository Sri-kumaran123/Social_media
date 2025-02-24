import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "./axios.service";
import { loginUser as loginUserAction } from "../store/slices/usersclice.jsx";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.User);

  const registerUser = async (params) => {
    try {
      const { data } = await api.post("/register", params);
      return data;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const loginUser = async (params) => {
    try {
      const { data } = await api.post("/login", params);
      
      dispatch(loginUserAction(data.user));
      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const getUser = async () => {
    try {
      

      const { data } = await api.get("/user");

      dispatch(loginUserAction(data.user));
      return data.user;
    } catch (error) {
      console.error("Failed to get user:", error);
      navigate("/login"); // Redirect on failure
      return null;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    dispatch(loginUserAction(null)); // Clear Redux state
    navigate("/login");
  };

  return { registerUser, loginUser, user, getUser, logoutUser };
};
