import { useEffect, useState } from "react";
import InputBox from "../components/ui/inputbox";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import CustomButton from "../components/ui/custombutton";
import AlertMessage from "../components/ui/alertmessage";
import { useAuth } from "../services/auth.servce";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Login() {
  const { loginUser, getUser } = useAuth();
  const user = useSelector((state) => state.User);
  const navigate = useNavigate(); // Corrected variable name
  const [ifauth,setauth] = useState(false)

  // Redirect to home if the user is already logged in
  
  useEffect(()=>{
    getUser()
    .then(res=>{
      res?.data?.user?setauth(true):setauth(false)
    })
    if(ifauth){
      navigate("/")
    }
  },[])

  const [useremailField, email] = InputBox({
    type: "text",
    placeholder: "Enter Email",
    icon: <MdEmail />,
  });

  const [passwordField, password] = InputBox({
    type: "password",
    placeholder: "Enter Password",
    icon: <RiLockPasswordFill />,
  });

  const [alertMessage, setAlertMessage] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setAlertMessage("⚠️ Input fields cannot be empty!");
      setTimeout(() => setAlertMessage(""), 3000);
      return;
    }

    await loginUser({ email, password });
    navigate("/"); // Redirect to home after successful login
  };

  return (
    <div className="flex items-center justify-center min-h-screen backdrop-blur-xl relative">
      {alertMessage && <AlertMessage msg={alertMessage} />}
      <div className="w-96 p-8 bg-white rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Login Page</h1>
        <div className="mb-4">{useremailField}</div>
        <div className="mb-6">{passwordField}</div>
        <div className="mb-4">
          <CustomButton text="Log in →" onclick={handleLogin} style={1} />
        </div>
        <p className="text-gray-600 text-sm">or</p>
        <div className="mt-4">
          <CustomButton text="Sign up →" onclick={() => navigate("/register")} />
        </div>
      </div>
    </div>
  );
}

export default Login;
