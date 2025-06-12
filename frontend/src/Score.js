import React, { useContext, useEffect } from "react";
import "./styles/Score.css";
import C1big from "./media/C1big.png";
import C2big from "./media/C2big.png";
import C3big from "./media/C3big.png";
import C4big from "./media/C4big.png";
import C1small from "./media/C1small.png";
import C2small from "./media/C2small.png";
import C3small from "./media/C3small.png";
import C4small from "./media/C4small.png";
import C1bg from "./media/C1bg.png";
import C2bg from "./media/C2bg.png";
import C3bg from "./media/C3bg.png";
import C4bg from "./media/C4bg.png";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./context/LoginContext";
import axios from "axios";

const Score = ({ category, scorePoints }) => {
  const bigIcons = [C1big, C2big, C3big, C4big];
  const smallIcons = [C1small, C2small, C3small, C4small];
  const backgrounds = [C1bg, C2bg, C3bg, C4bg];
  const colors = ["#00c3ff", "#F3ADDF", "#FFA007", "#1F1A53"];
  const navigate = useNavigate();
  const { player } = useContext(LoginContext);

  const api = axios.create({
    baseURL: "http://localhost:2812/api/",
  });

  useEffect(() => {
  const createGame = async () => {
    try {
      let game = {
        category: category._id,
        player: player._id,
        score: scorePoints,
      };
      console.log(game);
      return await api.post("/games", game);
    } catch (e) {
      console.error("Greška prilikom kreiranja igre:", e.message);
    }
  };

  if (player) {
    createGame();
  }
}, [player, category]);

  const handleNavigate = () => {
    navigate("/home");
  };
  return (
    <div
      className="score-wrapper"
      style={{ backgroundImage: `url(${backgrounds[category.number - 1]})` }}
    >
      <div className="score-heading">
        <img src={smallIcons[category.number - 1]} alt="small-icon" />
        <h2>{category.name}</h2>
      </div>
      <div
        className="score-points"
        style={{ backgroundColor: `${colors[category.number - 1]}` }}
      >
        Rezultat: {scorePoints}
      </div>
      <button
        style={{ backgroundColor: `${colors[category.number - 1]}` }}
        onClick={handleNavigate}
      >
        Nazad na igru
      </button>
      <img src={bigIcons[category.number - 1]} alt="big-icon" id="BIG-ICON" />
    </div>
  );
};

export default Score;
