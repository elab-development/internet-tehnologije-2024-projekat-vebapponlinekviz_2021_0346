import React, { useContext, useEffect, useState } from "react";
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

  const [funFact, setFunFact] = useState("");

  const api = axios.create({
    baseURL: "http://localhost:2812/api/",
  });

  const fetchFunFactApi = async () => {
    fetch("https://uselessfacts.jsph.pl/api/v2/facts/random")
      .then((res) => res.json())
      .then((data) => setFunFact(data.text));
  };

  useEffect(() => {
    const createGame = async () => {
      try {
        const token = localStorage.getItem("token");

        const game = {
          category: category._id,
          player: player._id,
          score: scorePoints,
        };

        return await api.post("/games", game, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        console.error("Greška prilikom kreiranja igre:", e.message);
      }
    };

    if (player) {
      createGame();
    }
  }, [player, category]);

  useEffect(() => {
    fetchFunFactApi();
  }, []);

  const handleNavigate = () => {
    navigate("/home");
  };

  return (
    <div
      className="score-wrapper"
      style={{ backgroundImage: `url(${backgrounds[category?.number - 1]})` }}
    >
      <div className="score-heading">
        <img src={smallIcons[category?.number - 1]} alt="small-icon" />
        <h2>{category?.name}</h2>
      </div>
      <div
        className="score-points"
        style={{ backgroundColor: `${colors[category?.number - 1]}` }}
      >
        <h3>Rezultat: {scorePoints}</h3>
        <p>Random fun fact:</p>
        <p>{funFact}</p>
      </div>
      <button
        style={{ backgroundColor: `${colors[category?.number - 1]}` }}
        onClick={handleNavigate}
      >
        Nazad na igru
      </button>
      <img src={bigIcons[category?.number - 1]} alt="big-icon" id="BIG-ICON" />
    </div>
  );
};

export default Score;
