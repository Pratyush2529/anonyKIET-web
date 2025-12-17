
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Layout from './Layout';
import Login from './components/Login';
import { Provider } from 'react-redux';
import { store } from './utils/appStore';
import Home from './components/Home';
import EditProfile from './components/EditProfile';
import Profile from './components/Profile';
import Chat from './components/Chat';
import { useEffect } from 'react';
import { getSocket } from './utils/socket';

function App() {
  useEffect(()=>{
    const socket=getSocket();
    socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");}
  }, []);
  return (
    <>
    <Provider store={store}>
      <BrowserRouter>
      <Routes>

        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>

          {/* Nested pages rendered inside <Outlet/> */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="editProfile" element={<EditProfile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/chat/:chatId" element={<Chat/>} />
          {/* <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} /> */}

        </Route>

      </Routes>
    </BrowserRouter>
    </Provider>
    </>
  );
}

export default App
