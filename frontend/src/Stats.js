import React, { useContext, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import logo from "./media/Logo.png";
import "./styles/Stats.css";
import { LoginContext } from "./context/LoginContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const options = {
  title: "Broj odigranih partija po kategoriji",
  is3D: true,
  pieSliceText: "value",
  backgroundColor: "transparent",
  titleTextStyle: {
    color: "#ffffff", // bela boja naslova
    fontSize: 20, // veličina fonta naslova
    bold: true,
  },

  legend: {
    position: "right",
    textStyle: {
      color: "#ffffff", // bela boja teksta legende
      fontSize: 16, // veličina fonta legende
    },
  },

  pieSliceTextStyle: {
    color: "#ffffff", // bela boja brojeva na samim delovima pite
    fontSize: 14,
  },

  slices: {
    0: { color: "#FDB3E7" },
    1: { color: "#A79FF1" },
    2: { color: "#5CA1FC" },
    3: { color: "#6051FF" },
  },
};

const Stats = () => {
  const [chartData, setChartData] = useState([["Kategorija", "Broj partija"]]);
  const [allGames, setAllGames] = useState([]);
  const [summary, setSummary] = useState({
    totalGames: 0,
    categoryStats: [],
    bestCategory: "",
  });

  const { player } = useContext(LoginContext);

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:2812/api/",
  });

  const handleNavigate = (route) => {
    navigate(route);
  };

  const getGamesCount = async () => {
    try {
      if (!player?._id) return;

      const res = await api.get(`/games/${player._id}/stats/gameCount`);
      const data = res.data;

      const formatted = [["Kategorija", "Broj partija"]];
      data.forEach((item) => {
        formatted.push([item.categoryTitle, item.gamesPlayed]);
      });

      setChartData(formatted);
    } catch (err) {
      console.error("Greška pri preuzimanju statistike:", err);
    }
  };

  const getAllGames = async () => {
    try {
      const res = await api.get(`games/${player._id}/stats/allGames`);
      console.log(res.data);
      setAllGames(res.data);
    } catch (e) {
      console.error("Greška prilikom dohvatanja igara:", e);
    }
  };

  const calculateSummary = () => {
    let categories = [
      "Zanimljiva geografija",
      "Biljke i životinje",
      "Istorija",
      "Sport",
    ];

    const getAverageScore = (categoryTitle) => {
      let filteredGames = allGames.filter(
        (game) => game.categoryTitle === categoryTitle
      );
      let sum = 0;
      for (let game of filteredGames) {
        sum += game.score;
      }
      return sum / filteredGames.length;
    };

    const populateCategoryStats = () => {
      for (let category of categories) {
        categoryStats.push({ [category]: getAverageScore(category) });
      }
    };

    const calculateBestCategory = () => {
      let max = 0;
      let bestCategory = "";
      for (let game of allGames) {
        if (game.score > max) {
          max = game.score;
          bestCategory = game.categoryTitle;
        }
      }
      return bestCategory;
    };

    let categoryStats = [];
    populateCategoryStats();
    let totalGames = allGames.length;
    let bestCategory = calculateBestCategory();

    setSummary({
      totalGames,
      categoryStats,
      bestCategory,
    });
  };

  useEffect(() => {
    getGamesCount();
    getAllGames();
  }, []);

  useEffect(() => {
    if (allGames && chartData) {
      calculateSummary();
    }
    console.log(summary);
  }, [allGames, chartData]);

  return (
    <div className="stats-wrapper">
      <div className="stats-print-container">
        <h2>🧾 Statistika korisnika</h2>
        <p>
          <strong>Ukupan broj partija:</strong> {summary.totalGames}
        </p>
        <h3>📊 Prosečni rezultati po kategoriji:</h3>
        <ul>
          {summary.categoryStats.map((stat, index) => {
            const category = Object.keys(stat)[0];
            const score = stat[category];
            return (
              <li key={index}>
                {category}: {score.toFixed(1)}
              </li>
            );
          })}
        </ul>
        <p>
          <strong>🏆 Najbolja kategorija:</strong> {summary.bestCategory}
        </p>
      </div>

      <div className="stats-left-wrapper">
        <img src={logo} alt="logo" onClick={() => handleNavigate("/home")} />
        <Chart
          chartType="PieChart"
          data={chartData}
          options={options}
          width={"100%"}
          height={"20rem"}
        />
      </div>
      <div className="stats-right-wrapper">
        <div className="games-list">
          {allGames.map((game, index) => (
            <div key={index} className="game-item">
              <p>Kategorija: {game.categoryTitle}</p>
              <p>Rezultat: {game.score}</p>
              <p>Datum: {new Date(game.playedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
      <button className="pdf-button">
        Preuzmi PDF statistike
      </button>
    </div>
  );
};

export default Stats;
