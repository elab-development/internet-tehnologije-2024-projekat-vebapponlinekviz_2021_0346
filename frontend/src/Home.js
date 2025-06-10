import React, { useContext, useEffect, useState } from "react";
import logo from "./media/Logo.png";
import shark from "./media/Shark.png";
import "./styles/Home.css";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./context/LoginContext";
import axios from "axios";

const Home = ({setCurrentCategory}) => {
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:2812/api/",
  });

  const {player} = useContext(LoginContext);

  const [allCategories, setAllCategories] = useState([]);

  const handleNavigate = ()=> {
    navigate("/profile");
  }

  const getAllCategories = async ()=> {
    return await api.get("/categories");
  }

  useEffect(()=>{
    const fetchCategories = async ()=> {
      let categories = await getAllCategories();
      setAllCategories(categories.data);
    }
    fetchCategories();
  },[])

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
          <p>{player ? player.username : "Gost"}</p>
          <img src={shark} alt="shark" />
        </div>
        <div className="category-button-wrapper">
          {allCategories?.map((category, index)=> {
            return <button key={index} className={"category-button " + "button-" + index} onClick={()=>{
              setCurrentCategory(category);
              navigate("/game");
            }}>{category.title}</button>
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
