import { Routes, Route, Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import inputBox from './components/ui/inputbox';

import './App.css';
import { userStore } from './store/user';
import customButton from './components/ui/custombutton';
import customButton2 from './components/ui/custombutton2';
import Layout from './pages/layout';
import { MENU } from './assets/constants';
import Home from './pages/home';
import Profile from './pages/profile';
import Login from './pages/login';
import Register from './pages/register';
import PrivateRoute from './pages/privateroute';
import { useEffect } from 'react';
import { useAuth } from './services/auth.servce';
import { UserProfile } from './pages/userProfile';
import UploadPost from './pages/addpost';
import Connection from './pages/connection';
import Explore from './pages/explore';
import Message from './pages/message';
import Popupuserprofile from './components/popupuserprofile';
import Adminlayout from './pages/Adminlayout';
import Adminpage from './pages/Adminpage';
function App() {
  
  
  return (
    <>
    <div className="relative flex items-center justify-center  ">
      <div className="absolute md:inset-0 bg-gradient-to-r   from-indigo-200 via-purple-200 m-8  to-blue-200  "></div>
      <Provider store={userStore}>
      <div className="relative z-10 w-full bg-white/40 backdrop-blur-xl h-[100vh]">
        
      
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/admin' element={<Adminlayout />}>
        <Route index element={<Adminpage />} />
        </Route>
        <Route element={<PrivateRoute />} >
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/profile/:id" element={<Popupuserprofile />} />
              <Route path='/profile' element={<UserProfile user={false}/>} />
              <Route path='/addpost' element={<UploadPost />} />
              <Route path='/connection' element={<Connection />} />
              <Route path='/search' element={<Explore />} />
              <Route path='/chat' element={<Message />} />
              
          </Route>
        </Route>
        
      </Routes>
      
      </div>
      </Provider>
     
    </div>
    
     
    </>
  )
}

export default App
