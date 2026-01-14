import React, { useContext, useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Chart } from "react-google-charts";
import logo from "./media/Logo.png";
import "./styles/Stats.css";
import { LoginContext } from "./context/LoginContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Page401 from "./errorPages/Page401.js";

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
  const pdfRef = useRef();

  const chartRef = useRef(null);
  const [chartImage, setChartImage] = useState(null);

  const [chartData, setChartData] = useState([["Kategorija", "Broj partija"]]);
  const [allGames, setAllGames] = useState([]);
  const [reverseOrder, setReverseOrder] = useState(false);
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

  const toggleOrder = () => {
    setReverseOrder((prev) => !prev);
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  const getGamesCount = async () => {
    try {
      if (!player?._id) return;

      const token = localStorage.getItem("token");
      const res = await api.get(`/games/${player._id}/stats/gameCount`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
      const token = localStorage.getItem('token');
      const res = await api.get(`games/${player._id}/stats/allGames`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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

  const downloadPDF = () => {
    const input = pdfRef.current;

    // Sačuvaj originalne stilove tela stranice
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlHeight = document.documentElement.style.height;
    const originalBodyHeight = document.body.style.height;

    // Omogući prikaz celog sadržaja
    document.body.style.overflow = "visible";
    document.documentElement.style.overflow = "visible";
    document.body.style.height = "auto";
    document.documentElement.style.height = "auto";

    input.style.display = "block";

    html2canvas(input, {
      scale: 3,
      useCORS: true,
      windowWidth: input.scrollWidth, // ključno!
      windowHeight: input.scrollHeight,
      backgroundColor: null,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      let remainingHeight = imgHeight - pdfHeight;
      while (remainingHeight > -10) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        remainingHeight -= pdfHeight;
      }

      pdf.save(`${player.username}.pdf`);

      // Vrati stilove na prethodno stanje
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.height = originalHtmlHeight;
      input.style.display = "none";
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
  }, [allGames, chartData]);

  if (!player) {
    return <Page401 />;
  }

  return (
    <div className="stats-wrapper">
      <div className="stats-print-container" ref={pdfRef}>
        <img src={logo} alt="logo" className="logo" />
        <div className="print-summary">
          <h2>Statistika korisnika</h2>
          <p>
            <strong>Ukupan broj partija:</strong> {summary.totalGames}
          </p>
          <h3>Prosečni rezultati po kategoriji:</h3>
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
            <strong>Najbolja kategorija:</strong> {summary.bestCategory}
          </p>
        </div>

        <div className="print-chart">
          {chartImage && <img src={chartImage} alt="Pie chart" />}
        </div>

        <div className="print-games">
          <h3>Lista svih odigranih partija</h3>
          {allGames.map((game, index) => (
            <div key={index} className="print-game-item">
              <p>
                <strong>Kategorija:</strong> {game.categoryTitle}
              </p>
              <p>
                <strong>Rezultat:</strong> {game.score}
              </p>
              <p>
                <strong>Datum:</strong>{" "}
                {new Date(game.playedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-left-wrapper">
        <img src={logo} alt="logo" onClick={() => handleNavigate("/home")} />
        <Chart
          chartType="PieChart"
          data={chartData}
          options={options}
          width={"100%"}
          height={"20rem"}
          chartEvents={[
            {
              eventName: "ready",
              callback: ({ chartWrapper }) => {
                const chart = chartWrapper.getChart();
                if (chart && typeof chart.getImageURI === "function") {
                  const uri = chart.getImageURI();
                  setChartImage(uri);
                } else {
                  console.warn("Chart not ready to get image URI.");
                }
              },
            },
          ]}
        />
      </div>
      <div className="stats-right-wrapper">
        <button className="sort-button" onClick={toggleOrder}>
          {reverseOrder ? "Prikaži najnovije prvo" : "Prikaži najstarije prvo"}
        </button>
        <div className="games-list">
          {[...allGames]
            .sort((a, b) =>
              reverseOrder
                ? new Date(a.playedAt) - new Date(b.playedAt)
                : new Date(b.playedAt) - new Date(a.playedAt)
            )
            .map((game, index) => (
              <div key={index} className="game-item">
                <p>Kategorija: {game.categoryTitle}</p>
                <p>Rezultat: {game.score}</p>
                <p>Datum: {new Date(game.playedAt).toLocaleDateString()}</p>
              </div>
            ))}
        </div>
      </div>
      <button className="pdf-button" onClick={downloadPDF}>
        Preuzmi PDF statistike
      </button>
    </div>
  );
};

export default Stats;
