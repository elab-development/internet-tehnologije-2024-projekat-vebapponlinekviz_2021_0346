import React, { useContext, useState, useRef } from "react";
import logo from "./media/Logo.png";
import "./styles/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "./context/LoginContext";
import axios from "axios";

const Profile = () => {
  const api = axios.create({
    baseURL: "http://localhost:2812/api/",
  });
  const { player } = useContext(LoginContext);

  const [name, setName] = useState(player?.name || "");
  const [mail, setMail] = useState(player?.mail || "");
  const [username, setUsername] = useState(player?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateForm = useRef();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword;

  const isFormValid = isEmailValid && isPasswordValid && doPasswordsMatch;
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/home");
  };

  const handleDataChange = () => {
    updateForm.current.style.display = "flex";
  }

  const handleDispose = ()=> {
    updateForm.current.style.display = "none";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newUser = {
      name,
      mail,
      username,
      password,
    };
    try {
      await createUser(newUser);
      handleNavigate();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Greška prilikom kreiranja korisnika.");
      }
    }
  };

  const createUser = async (userData) => {
    return await api.post("users", userData);
  };

  return (
    <div className="profile-wrapper">
      {player ? (
        <>
          <div className="profile-wrapper-left">
            <img src={logo} alt="logo" onClick={handleNavigate} />
            <div className="profile-points">
              <p>Kategorija 1: {}</p>
              <p>Kategorija 2: {}</p>
              <p>Kategorija 3: {}</p>
              <p>Kategorija 4: {}</p>
            </div>
          </div>
          <div className="profile-wrapper-right">
            <div className="profile-user-data">
              <p>
                Ime: <span>{player.name}</span>
              </p>
              <p>
                Mail: <span>{player.mail}</span>
              </p>
              <p>
                Korisničko ime: <span>{player.username}</span>
              </p>
              <button onClick={handleDataChange}>Izmeni podatke</button>
            </div>
            <button id="DELETE-DATA">Obriši podatke</button>
          </div>
        </>
      ) : (
        <div className="guest-prompt">
          <p>Morate biti ulogovani da biste videli profil</p>
          <p>
            Ukoliko već imate profil, ulogujte se <Link to="/login">ovde</Link>
          </p>
          <p>
            Ukoliko se niste registrovali, možete to učiniti{" "}
            <Link to="/register">ovde</Link>
          </p>
          <button onClick={handleNavigate}>Nazad na igru</button>
        </div>
      )}
      <div className="register-wrapper update-form-wrapper" ref={updateForm} onClick={handleDispose}>
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
          <label htmlFor="ime">Ime:</label>
          <input
            type="text"
            name="ime"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <label htmlFor="mail">Mail:</label>
          <input
            type="text"
            name="mail"
            value={mail}
            onChange={(e) => {
              setMail(e.target.value);
            }}
          />
          {!isEmailValid && mail.length > 0 && (
            <p className="message">Unesite ispravan email.</p>
          )}
          <label htmlFor="korisnicko-ime">Korisničko ime:</label>
          <input
            type="text"
            name="korisnicko-ime"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <label htmlFor="lozinka">Stara lozinka:</label>
          <input
            type="password"
            name="lozinka"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {password.length > 0 && password.length < 8 && (
            <p className="message">Lozinka mora da ima bar 8 karaktera.</p>
          )}
          <label htmlFor="ponovljena-lozinka">Nova lozinka:</label>
          <input
            type="password"
            name="ponovljena-lozinka"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword.length > 0 && !doPasswordsMatch && (
            <p className="message">Lozinke se ne poklapaju.</p>
          )}
          <button type="submit" disabled={!isFormValid}>
            PROMENI PODATKE
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
