import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import LoginPage from "./LoginPage";
import Register from "./Register";
import Home from "./Home";
import Profile from "./Profile";
import Category from "./Category";
import { useState } from "react";
import { LoginContext } from "./context/LoginContext";
import Stats from "./Stats";
import AdminPage from "./AdminPage";
import Page404 from "./errorPages/Page404";

function App() {
  const [player, setPlayer] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  return (
    <LoginContext.Provider value={{ player, setPlayer }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={<Home setCurrentCategory={setCurrentCategory} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/game"
            element={<Category category={currentCategory} />}
          />
          <Route path="/stats" element={<Stats />} />
          <Route path="/admin" element={<AdminPage/>}/>
          <Route path="*" element={<Page404/>} />
        </Routes>
      </Router>
    </LoginContext.Provider>
  );
}

export default App;
