import React, { useContext, useEffect, useState } from "react";
import logo from "./media/Logo.png";
import shark from "./media/Shark.png";
import "./styles/Home.css";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "./context/LoginContext";
import axios from "axios";

const iconMap = {
  113: "☀️", // Sunny / Clear
  116: "⛅", // Partly Cloudy
  119: "☁️", // Cloudy
  122: "🌥️", // Overcast
  143: "🌫️", // Mist
  176: "🌦️", // Patchy rain
  179: "🌧️❄️", // Patchy snow
  182: "🌧️❄️", // Patchy sleet
  185: "🌧️❄️", // Patchy freezing drizzle
  200: "⛈️", // Thundery outbreaks
  227: "🌨️", // Blowing snow
  230: "❄️💨", // Blizzard
  248: "🌫️", // Fog
  260: "🌫️", // Freezing fog
  263: "🌦️", // Light drizzle
  266: "🌧️", // Light rain
  281: "🌧️❄️", // Freezing drizzle
  284: "🌧️❄️", // Heavy freezing drizzle
  293: "🌦️", // Patchy light rain
  296: "🌧️", // Light rain
  299: "🌧️", // Moderate rain at times
  302: "🌧️", // Moderate rain
  305: "🌧️", // Heavy rain at times
  308: "🌧️", // Heavy rain
  311: "🌧️❄️", // Light freezing rain
  314: "🌧️❄️", // Heavy freezing rain
  317: "🌧️❄️", // Light sleet
  320: "🌧️❄️", // Heavy sleet
  323: "🌨️", // Patchy light snow
  326: "🌨️", // Light snow
  329: "❄️", // Patchy moderate snow
  332: "❄️", // Moderate snow
  335: "❄️", // Patchy heavy snow
  338: "❄️", // Heavy snow
  350: "🧊", // Ice pellets
  353: "🌧️", // Light rain shower
  356: "🌧️", // Moderate or heavy rain shower
  359: "🌧️", // Torrential rain
  362: "🌧️❄️", // Light sleet showers
  365: "🌧️❄️", // Moderate or heavy sleet showers
  368: "🌨️", // Light snow showers
  371: "❄️", // Heavy snow showers
  374: "🧊", // Light showers of ice pellets
  377: "🧊", // Heavy showers of ice pellets
  386: "⛈️🌧️", // Patchy rain with thunder
  389: "⛈️", // Moderate/heavy rain with thunder
  392: "❄️⚡", // Patchy snow with thunder
  395: "❄️⛈️", // Heavy snow with thunder
};

const Home = ({ setCurrentCategory }) => {
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:2812/api/",
  });

  const { player } = useContext(LoginContext);

  const [allCategories, setAllCategories] = useState([]);
  const [bestScores, setBestScores] = useState([]);

  const [weatherIcon, setWeatherIcon] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [location, setLocation] = useState(null);

  const handleNavigate = (route) => {
    navigate(route);
  };

  const getAllCategories = async () => {
    return await api.get("/categories");
  };

  const getBestScoresByCategory = async (playerId) => {
    const token = localStorage.getItem("token");
    return await api.get(`/games/best/${playerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const getWeather = async () => {
    try {
      const response = await axios.get("https://wttr.in/?format=j1");
      const weather = response.data.current_condition[0];
      const city = response.data.nearest_area[0].areaName[0].value;
      setTemperature(weather.temp_C);
      const code = weather.weatherCode;
      setWeatherIcon(iconMap[code] || "❓");
      setLocation(city);
    } catch (error) {
      console.error("Greška pri ucitavanju vremena:", error);
    }
  };

  useEffect(() => {
    const getScores = async () => {
      if (player) {
        let scores = await getBestScoresByCategory(player._id);
        setBestScores(scores.data);
      }
    };
    getScores();
  }, [player]);

  useEffect(() => {
    const fetchCategories = async () => {
      let categories = await getAllCategories();
      setAllCategories(categories.data);
    };
    fetchCategories();
    getWeather();
  }, []);

  return (
    <div className="home-wrapper">
      <div className="left-wrapper">
        <img src={logo} alt="logo" />
        <div className="points">
          {player ? (
            <>
              {bestScores?.map((item, index) => (
                <p key={index}>
                  {item.categoryTitle}: {item.score}
                </p>
              ))}
              <button
                className="home-stats-button"
                onClick={() => handleNavigate("/stats")}
              >
                Moja statistika
              </button>
            </>
          ) : (
            <>
              <p>
                <Link to="/login">Ulogujte</Link> se za prikaz poena
              </p>
              <p>
                ili <Link to="/register">napravite profil</Link>
              </p>
            </>
          )}
        </div>
      </div>
      <div className="right-wrapper">
        <div className="profile" onClick={() => handleNavigate("/profile")}>
          <div className="weather-info">
            <p>{weatherIcon}</p>
            <p>{temperature}°C</p>
            <p id="cityName">{location}</p>
          </div>
          <div>
            <p>{player ? player.username : "Gost"}</p>
            <img src={shark} alt="shark" />
          </div>
        </div>
        <div className="category-button-wrapper">
          {allCategories?.map((category, index) => {
            return (
              <button
                key={index}
                className={"category-button " + "button-" + index}
                onClick={() => {
                  setCurrentCategory(category);
                  navigate("/game");
                }}
              >
                {category.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
