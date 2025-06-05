import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import LoginPage from "./LoginPage";
import Register from "./Register";
import Home from "./Home";
import Profile from "./Profile";
import Cateogory from "./Cateogory";
import Score from "./Score";
import { useState } from "react";
import { LoginContext } from "./context/LoginContext";

function App() {
  const [player, setPlayer] = useState(null);

  const category1 = {
    number: 1,
    name: "Kategorija 1",
  };
  const category2 = {
    number: 2,
    name: "Kategorija 2",
  };
  const category3 = {
    number: 3,
    name: "Kategorija 3",
  };
  const category4 = {
    number: 4,
    name: "Kategorija 4",
  };

  return (
    <LoginContext.Provider value={{ player, setPlayer }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/game" element={<Cateogory category={category2} />} />
          <Route path="/score" element={<Score category={category2} />} />
        </Routes>
      </Router>
    </LoginContext.Provider>
  );
}

export default App;
