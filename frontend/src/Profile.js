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
  const { player, setPlayer } = useContext(LoginContext);

  const [name, setName] = useState(player?.name || "");
  const [mail, setMail] = useState(player?.mail || "");
  const [username, setUsername] = useState(player?.username || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const updateForm = useRef();
  const deleteForm = useRef();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  const isNewPasswordValid = newPassword.length >= 8;

  const isFormValid = isEmailValid && isNewPasswordValid;
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/home");
  };

  const handleDataChange = () => {
    updateForm.current.style.display = "flex";
  };

  const handleDispose = () => {
    setOldPassword("");
    setNewPassword("");
    updateForm.current.style.display = "none";
  };

  const handleDeleteUser = async () => {
    await api.delete("/users", {
      username: player.username,
    });
    deleteForm.current.style.display = "none";
    setPlayer(null);
  };

  const updateUser = async (newData, oldUsername, oldPassword) => {
    return await api.patch("/users", {
      filter: { username: oldUsername, password: oldPassword },
      update: newData,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newData = {
      username: username,
      name: name,
      mail: mail,
      password: newPassword,
    };

    try {
      let updatedUser = await updateUser(newData, player.username, oldPassword);
      setPlayer(updatedUser.data);
      handleDispose();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Uneli ste neispravnu lozinku");
      } else {
        alert("Korisničo ime ili mejl su već zauzeti");
      }
    }
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
            <button
              id="DELETE-DATA"
              onClick={() => {
                deleteForm.current.style.display = "flex";
              }}
            >
              Obriši podatke
            </button>
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
      <div
        className="register-wrapper update-form-wrapper"
        ref={updateForm}
        onClick={handleDispose}
      >
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
          <label htmlFor="stara-lozinka">Stara lozinka:</label>
          <input
            type="password"
            name="stara-lozinka"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
          />
          <label htmlFor="nova-lozinka">Nova lozinka:</label>
          <input
            type="password"
            name="nova-lozinka"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {newPassword.length > 0 && newPassword.length < 8 && (
            <p className="message">Lozinka mora da ima bar 8 karaktera.</p>
          )}
          <button type="submit" disabled={!isFormValid}>
            PROMENI PODATKE
          </button>
        </form>
      </div>
      <div className="confirm-delete-message" ref={deleteForm}>
        <p>Da li ste sigurni?</p>
        <button
          onClick={() => {
            deleteForm.current.style.display = "none";
          }}
        >
          Odustani
        </button>
        <button onClick={handleDeleteUser}>Obriši</button>
      </div>
    </div>
  );
};

export default Profile;
