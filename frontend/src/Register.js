import React, { useState } from "react";
import "./styles/Register.css";


const Register = () => {  

  return (
    <div className="register-wrapper">
      <form>
        <label htmlFor="ime">Ime:</label>
        <input type="text" name="ime" />
        <label htmlFor="mail">Mail:</label>
        <input type="text" name="mail" />
        <label htmlFor="korisnicko-ime">Korisničko ime:</label>
        <input type="text" name="korisnicko-ime" />
        <label htmlFor="lozinka">Lozinka:</label>
        <input type="password" name="lozinka" />
        <label htmlFor="ponovljena-lozinka">Ponovljena lozinka:</label>
        <input type="password" name="ponovljena-lozinka" />
        <button type="submit">KREIRAJ NALOG</button>
      </form>
    </div>
  );
};

export default Register;
