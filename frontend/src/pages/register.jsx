import inputBox from "../components/ui/inputbox";
import customButton from "../components/ui/custombutton";
import AlertMessage from "../components/ui/alertmessage";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { useRef, useState } from "react";
import { useAuth } from "../services/auth.servce";
import { useNavigate } from "react-router-dom";
function Register(){
    const [alertMessage, setAlertMessage] = useState("");
    const status = useRef(null);
    const [useremailField, email] = inputBox({
        type: "text",
        placeholder: "Enter Email",
        icon: <MdEmail />,
      });
      const [usernameField, username] = inputBox({
        type: "text",
        placeholder: "Enter Name",
        icon: <IoPerson />,
      });
      const [userphoneField, phone] = inputBox({
        type: "number",
        placeholder: "Enter phone",
        icon: <FaPhone />,
      });
      const [passwordField, password] = inputBox({
        type: "password",
        placeholder: "Enter Password",
        icon: <RiLockPasswordFill />,
      });
      const { loginUser, registerUser, user } = useAuth();
      const handleLogin = () => {
        if (!email.trim() || !password.trim() || !username.trim() || !phone) {
          status.current = 'done';
          setAlertMessage("⚠️ Input fields cannot be empty!");
          setTimeout(() => setAlertMessage(""), 3000); // Auto-hide after 3 seconds
          return;
        }
        registerUser({
          username,
          password,
          email,
          phone
        })
        .then(()=>{
          setAlertMessage("✅ Login successful!");
          status.current = 'success'
          setTimeout(() => setAlertMessage("User Registered please login"), 3000); // Auto-hide after 3 seconds
          return;
        })
        console.log("Logging in...");
      };
      const navigate = useNavigate()
      const signupbtn = customButton({text:"sign up →", onclick:handleLogin,style:1});
      const backtologbtn = customButton({text:"back to log in →", onclick:()=>{navigate("/login")}});
    return <div 
    className="flex items-center justify-center min-h-screen backdrop-blur-xl relative">
    {/* Alert Box */}
    {alertMessage && (
      <AlertMessage msg={alertMessage} res={status.current} />
    )}

    {/* Login Card */}
    <div className="w-96 p-8 bg-white rounded-2xl shadow-xl text-center">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Sign up Page</h1>
      <div className="mb-4">{useremailField}</div>
      <div className="mb-4">{usernameField}</div>
      <div className="mb-4">{userphoneField}</div>
      <div className="mb-6">{passwordField}</div>
      <div className="mb-4">
        {signupbtn}
      </div>
      <p className="text-gray-600 text-sm">or</p>
      <div className="mt-4">
        {backtologbtn}
      </div>
    </div>
  </div>
}
export default Register;