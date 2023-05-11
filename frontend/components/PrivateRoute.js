import React from "react";
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = (props) => {
    if(localStorage.getItem('token')){
        return <Outlet/>
    } else {
        return <Navigate to="/"/>, props.setMessage("Ouch: jwt expired")
    }  
}

export default PrivateRoute;