import React from "react";
import "./styles/Login.css";
import logo from "./media/Logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleNavigate = (route)=> {
    navigate(route);
  }

  return (
    <div className="login-wrapper">
      <img src={logo} alt="logo" />
      <div className="login-btns">
        <button id="PRIJAVA" onClick={()=> handleNavigate("login")}>Prijava</button>
        <button id="GOST" onClick={()=> handleNavigate("home")}>Gost</button>
        <button id="KREIRAJNALOG" onClick={()=> handleNavigate("register")}>Kreiraj nalog</button>
      </div>
    </div>
  );
};

export default Login;
