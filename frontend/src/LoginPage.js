import React, { useContext, useState } from "react";
import logo from "./media/Logo.png";
import "./styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./context/LoginContext";
import axios from "axios";

const LoginPage = () => {
  const { setPlayer } = useContext(LoginContext);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const api = axios.create({
    baseURL: "http://localhost:2812/api/",
  });

  const handleNavigate = () => {
    navigate("/home");
  };

  const loginPlayer = async (userData) => {
    return await api.post("/users/login", userData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const player = { username, password };
    try {
      let loggedInPlayer = await loginPlayer(player);
      setPlayer(loggedInPlayer.data);
      handleNavigate();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert(error.response.data.message);
      } else {
        alert("Greška prilikom prijave korisnika.");
      }
    }
  };

  return (
    <div className="loginpage-wrapper">
      <img src={logo} alt="logo" />
      <form onSubmit={handleSubmit}>
        <div className="form-element upper-element">
          <label htmlFor="username">Korisničko ime:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="form-element lower-element">
          <label htmlFor="password">Lozinka:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit">Prijavi se</button>
      </form>
    </div>
  );
};

export default LoginPage;
