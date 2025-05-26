import React from "react";
import logo from "./media/Logo.png";
import "./styles/Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const handleNavigate = ()=> {
    navigate("/home");
  }
  return (
    <div className="profile-wrapper">
      <div className="profile-wrapper-left">
        <img src={logo} alt="logo" onClick={handleNavigate}/>
        <div className="profile-points">
          <p>Kategorija 1: {}</p>
          <p>Kategorija 2: {}</p>
          <p>Kategorija 3: {}</p>
          <p>Kategorija 4: {}</p>
        </div>
      </div>
      <div className="profile-wrapper-right">
        <div className="profile-user-data">
            <p>Ime: {}</p>
            <p>Mail: {}</p>
            <p>Korisničko ime: {}</p>
            <button>Izmeni podatke</button>
        </div>
        <button id="DELETE-DATA">Obriši podatke</button>
      </div>
    </div>
  );
};

export default Profile;
