import React, { useState } from "react";
import "./styles/Register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const api = axios.create({
    baseURL: "http://localhost:2812/api/",
  });

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword;

  const isFormValid = isEmailValid && isPasswordValid && doPasswordsMatch;

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/login");
  };

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
    <div className="register-wrapper">
      <form onSubmit={handleSubmit}>
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
        <label htmlFor="lozinka">Lozinka:</label>
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
        <label htmlFor="ponovljena-lozinka">Ponovljena lozinka:</label>
        <input
          type="password"
          name="ponovljena-lozinka"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {confirmPassword.length > 0 && !doPasswordsMatch && (
          <p className="message">Lozinke se ne poklapaju.</p>
        )}
        <button type="submit" disabled={!isFormValid}>
          KREIRAJ NALOG
        </button>
      </form>
    </div>
  );
};

export default Register;
