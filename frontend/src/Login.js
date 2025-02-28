import React from "react";
import "./styles/Login.css";
import logo from "./media/Logo.png";

const Login = () => {
  return (
    <div className="login-wrapper">
      <img src={logo} alt="logo" />
      <div className="login-btns">
        <button id="PRIJAVA">Prijava</button>
        <button id="GOST">Gost</button>
        <button id="KREIRAJNALOG">Kreiraj nalog</button>
      </div>
    </div>
  );
};

export default Login;
