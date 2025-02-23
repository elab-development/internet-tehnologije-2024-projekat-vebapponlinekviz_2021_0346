import React, { useState } from "react";
import "./styles/Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e)=> {
    e.preventDefault();
    let newUser = {
      name,
      mail,
      username,
      password
    }
    console.log(newUser);
  }

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
        <label htmlFor="ponovljena-lozinka">Ponovljena lozinka:</label>
        <input type="password" name="ponovljena-lozinka" />
        <button type="submit">KREIRAJ NALOG</button>
      </form>
    </div>
  );
};

export default Register;
