import axios from 'axios'
import React, { useContext } from 'react'
import  { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext'

export default function LogoutBtn() {
    const navigate = useNavigate();
    const {getLoggedIn}=useContext(AuthContext);
    async function Logout(){
    await axios.get("http://localhost:3000/api/logout")
    await getLoggedIn();
    navigate('/homepage2');
    
    }
  return (
    <Link  onClick={Logout}>logout</Link> 
  )
}
