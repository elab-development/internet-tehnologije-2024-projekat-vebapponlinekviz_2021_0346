import React from "react";
import logo from "./media/Logo.png";
import shark from "./media/Shark.png";
import "./styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = ()=> {
    navigate("/profile");
  }
  return (
    <div className="home-wrapper">
      <div className="left-wrapper">
        <img src={logo} alt="logo" />
        <div className="points">
          <p>Kategorija 1: {}</p>
          <p>Kategorija 2: {}</p>
          <p>Kategorija 3: {}</p>
          <p>Kategorija 4: {}</p>
        </div>
      </div>
      <div className="right-wrapper">
        <div className="profile" onClick={handleNavigate}>
          <p>Korisnicko_ime</p>
          <img src={shark} alt="shark" />
        </div>
        <div className="category-button-wrapper">
          <button className="category-button first-button">Kategorija 1</button>
          <button className="category-button second-button">
            Kategorija 2
          </button>
          <button className="category-button third-button">Kategorija 3</button>
          <button className="category-button fourth-button">Kategorija 4</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
