import React from "react";
import "./styles/Category.css";
import C1big from './media/C1big.png';
import C2big from './media/C2big.png';
import C3big from './media/C3big.png';
import C4big from './media/C4big.png';
import C1small from './media/C1small.png';
import C2small from './media/C2small.png';
import C3small from './media/C3small.png';
import C4small from './media/C4small.png';
import C1bg from './media/C1bg.png';
import C2bg from './media/C2bg.png';
import C3bg from './media/C3bg.png';
import C4bg from './media/C4bg.png';

const Cateogory = ({category}) => {
    const bigIcons = [C1big,C2big,C3big,C4big];
    const smallIcons = [C1small,C2small,C3small,C4small];
    const backgrounds = [C1bg,C2bg,C3bg,C4bg];
    const colors = ["#00c3ff","#F3ADDF", "#FFA007", "#1F1A53"];
  return (
    <div className="category-wrapper" style={{backgroundImage: `url(${backgrounds[category.number - 1]})`}}>
      <div className="category-heading">
        <div className="category-name">
          <img src={smallIcons[category.number - 1]} alt="small-icon" />
          <h2>{category.title}</h2>
        </div>
        <div className="category-timer" style={{backgroundColor: `${colors[category.number - 1]}`}}>29</div>
      </div>
      <div className="category-questions">
        <div className="category-question" style={{backgroundColor: `${colors[category.number - 1]}`}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla est ex, fermentum et nulla tristique, rhoncus interdum ligula. Etiam egestas pretium imperdiet. Suspendisse sit amet scelerisque mauris. Cras tortor ante.</div>
        <div className="category-answers">
          <button className="answer answer1" style={{backgroundColor: `${colors[category.number - 1]}`}}>Odgovor 1</button>
          <button className="answer answer2" style={{backgroundColor: `${colors[category.number - 1]}`}}>Odgovor 2</button>
          <button className="answer answer3" style={{backgroundColor: `${colors[category.number - 1]}`}}>Odgovor 3</button>
          <button className="answer answer4" style={{backgroundColor: `${colors[category.number - 1]}`}}>Odgovor 4</button>
        </div>
      </div>
      <img src={bigIcons[category.number - 1]} alt="big-icon" id="BIG-ICON"/>
    </div>
  );
};

export default Cateogory;
