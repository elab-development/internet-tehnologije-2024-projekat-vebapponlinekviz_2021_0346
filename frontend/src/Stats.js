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

  const { player } = useContext(LoginContext);
  
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:2812/api/",
  });

  const handleNavigate = (route) => {
    navigate(route)
  }

  const getGamesCount = async () => {
    try {
      console.log("Uslo u metodu");
      console.log(player);
      if (!player?._id) return;

      console.log("desilo se");

      const res = await api.get(`/games/${player._id}/stats/gameCount`);
      const data = res.data;
      console.log(data);

      const formatted = [["Kategorija", "Broj partija"]];
      data.forEach((item) => {
        formatted.push([item.categoryTitle, item.gamesPlayed]);
      });

      setChartData(formatted);
    } catch (err) {
      console.error("Greška pri preuzimanju statistike:", err);
    }
  };

  useEffect(() => {
    getGamesCount();
  }, []);

  return (
    <div className="stats-wrapper">
      <div className="stats-left-wrapper">
        <img src={logo} alt="logo" onClick={()=> handleNavigate("/home")}/>
        <Chart
          chartType="PieChart"
          data={chartData}
          options={options}
          width={"100%"}
          height={"20rem"}
        />
      </div>
      <div className="stats-right-wrapper">
        <table>
          <thead>
            <tr>
              <th>Kategorija</th>
              <th>Rezultat</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Geografija</td>
              <td>45</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>Geografija</td>
              <td>45</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>Geografija</td>
              <td>45</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>Geografija</td>
              <td>45</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>
        <div className="stats-table-control">
          <select>
            <option value="">Filter</option>
            <option value="1">Kategorija 1</option>
          </select>
          <button>{"<"}</button>
          <button>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default Stats;
