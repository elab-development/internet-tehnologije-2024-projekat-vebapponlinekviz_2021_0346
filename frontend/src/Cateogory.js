import React from "react";
import smallIcon from "./media/C1small.png";
import bigIcon from "./media/C1big.png";
import "./styles/Category.css";

const Cateogory = () => {
  return (
    <div className="category-wrapper">
      <div className="category-heading">
        <div className="category-name">
          <img src={smallIcon} alt="small-icon" />
          <h2>Kategorija 1</h2>
        </div>
        <div className="category-timer">29</div>
      </div>
      <div className="category-questions">
        <div className="category-question">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla est ex, fermentum et nulla tristique, rhoncus interdum ligula. Etiam egestas pretium imperdiet. Suspendisse sit amet scelerisque mauris. Cras tortor ante.</div>
        <div className="category-answers">
          <button className="answer answer1">Odgovor 1</button>
          <button className="answer answer2">Odgovor 2</button>
          <button className="answer answer3">Odgovor 3</button>
          <button className="answer answer4">Odgovor 4</button>
        </div>
      </div>
      <img src={bigIcon} alt="big-icon" id="BIG-ICON"/>
    </div>
  );
};

export default Cateogory;
