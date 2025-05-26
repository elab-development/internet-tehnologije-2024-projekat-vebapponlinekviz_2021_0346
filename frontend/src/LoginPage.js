import React from 'react';
import logo from "./media/Logo.png";
import "./styles/LoginPage.css";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

  const navigate = useNavigate();

  const handleNavigate = ()=> {
    navigate("/home");
  }

  const handleSubmit = (e)=> {
    e.preventDefault();
    handleNavigate();
  }

  return (
    <div className='loginpage-wrapper'> 
        <img src={logo} alt="logo" />
        <form onSubmit={handleSubmit}>
            <div className="form-element upper-element">
                <label htmlFor="username">Korisničko ime:</label>
                <input type="text" name='username' />
            </div>
            <div className="form-element lower-element">
                <label htmlFor="password">Lozinka:</label>
                <input type="password" name='password' />
            </div>
            <button type='submit'>Prijavi se</button>
        </form>
    </div>
  )
}

export default LoginPage