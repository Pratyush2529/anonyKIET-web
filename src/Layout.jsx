import { Outlet, NavLink } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "./utils/constants";
import { addUser } from "./utils/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function Layout() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const userData=useSelector((store)=>store.user);
  const fetchUser=async()=>{
    if(userData) return;
    try{
      const response = await axios.get(BASE_URL+"/profile", {withCredentials:true});
      dispatch(addUser(response.data.user));
    }catch(err){
      if(err.status===401) navigate("/login");
      console.log(err);
    }
  }

  useEffect(()=>{
    fetchUser();
  }, [])
  return (
    <>
    <Toaster
  position="top-center"
  reverseOrder={false}
/>
      <Navbar/>
        <Outlet />
      {/* <Footer/> */}
    </>
  );
}
