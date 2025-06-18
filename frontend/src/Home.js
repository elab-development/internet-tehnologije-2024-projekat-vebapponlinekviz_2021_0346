import React, { useContext, useEffect, useState } from "react";
import logo from "./media/Logo.png";
import shark from "./media/Shark.png";
import "./styles/Home.css";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "./context/LoginContext";
import axios from "axios";

const Home = ({ setCurrentCategory }) => {
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:2812/api/",
  });

  const { player } = useContext(LoginContext);

  const [allCategories, setAllCategories] = useState([]);
  const [bestScores, setBestScores] = useState([]);

  const handleNavigate = () => {
    navigate("/profile");
  };

  const getAllCategories = async () => {
    return await api.get("/categories");
  };

  const getBestScoresByCategory = async (playerId) => {
    return await api.get(`/games/best/${playerId}`);
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
  }, []);

  return (
    <div className="home-wrapper">
      <div className="left-wrapper">
        <img src={logo} alt="logo" />
        <div className="points">
          {player ? (
            bestScores?.map((item, index) => (
              <p key={index}>
                {item.categoryTitle}: {item.score}
              </p>
            ))
          ) : (
            <>
              <p><Link to="/login">Ulogujte</Link> se za prikaz poena</p>
              <p>ili <Link to="/register">napravite profil</Link></p>
            </>
          )}
        </div>
      </div>
      <div className="right-wrapper">
        <div className="profile" onClick={handleNavigate}>
          <p>{player ? player.username : "Gost"}</p>
          <img src={shark} alt="shark" />
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
