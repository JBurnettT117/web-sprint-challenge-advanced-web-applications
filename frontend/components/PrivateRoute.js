import React from "react";
import { Outlet, Routes, Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const PrivateRoute = (props) => {
    const navigate = useNavigate();
    if(localStorage.getItem('token')){
        return <Outlet/>
    } else {
        props.setMessage("Ouch: jwt expired");
        navigate("/");
    }  
}

export default PrivateRoute;