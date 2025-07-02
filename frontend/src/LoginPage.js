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

  const handleNavigate = (route) => {
    navigate(route);
  };

  const loginPlayer = async (userData) => {
    const response = await api.post("/users/login", userData);
    const { token, user } = response.data;
    // Čuvanje tokena i korisničkih podataka
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const player = { username, password };
    try {
      const user = await loginPlayer(player);
      setPlayer(user); // korisnik bez tokena (token je u localStorage)

      if (user.admin) {
        handleNavigate("/admin");
      } else {
        handleNavigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.data?.message) {
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
