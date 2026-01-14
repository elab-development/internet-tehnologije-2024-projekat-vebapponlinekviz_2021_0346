import React, { useEffect, useState } from "react";
import "./styles/Category.css";
import C1big from "./media/C1big.png";
import C2big from "./media/C2big.png";
import C3big from "./media/C3big.png";
import C4big from "./media/C4big.png";
import C1small from "./media/C1small.png";
import C2small from "./media/C2small.png";
import C3small from "./media/C3small.png";
import C4small from "./media/C4small.png";
import C1bg from "./media/C1bg.png";
import C2bg from "./media/C2bg.png";
import C3bg from "./media/C3bg.png";
import C4bg from "./media/C4bg.png";
import Score from "./Score";

const Category = ({ category }) => {
  const bigIcons = [C1big, C2big, C3big, C4big];
  const smallIcons = [C1small, C2small, C3small, C4small];
  const backgrounds = [C1bg, C2bg, C3bg, C4bg];
  const colors = ["#00c3ff", "#F3ADDF", "#FFA007", "#1F1A53"];
  const defaultTimerValue = 10;
  const defaultRoundsValue = 10;

  const [roundQuestions, setRoundQuestions] = useState([]);
  const [remainingTime, setRemainingTime] = useState(defaultTimerValue);
  const [stopTimer, setStopTimer] = useState(false);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [score, setScore] = useState(0);

  const nextRound = () => {
    setRound((prev) => prev + 1);
    setRemainingTime(defaultTimerValue);
  };

  const getRandomElements = (array, n) => {
    if (n > array.length) {
      throw new Error("n ne sme biti veće od dužine niza");
    }

    const shuffled = [...array]; // pravimo kopiju da ne menjamo original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Fisher-Yates shuffle
    }

    return shuffled.slice(0, n);
  };

  useEffect(() => {
    if (round > defaultRoundsValue - 1) {
      console.log(score);
      setGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    setRoundQuestions(
      getRandomElements(category.questions, defaultRoundsValue)
    );
  }, []);

  useEffect(() => {
    if (remainingTime === 0) {
      setButtonsDisabled(true);
      setShowCorrectAnswer(true);

      setTimeout(() => {
        setShowCorrectAnswer(false);
        nextRound();
        setButtonsDisabled(false);
      }, 1000);

      return;
    }

    const timeout = setTimeout(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [remainingTime]);

  const handleAnswer = (e) => {
    if (remainingTime === 0 || buttonsDisabled) return;

    const currentTime = remainingTime;
    setButtonsDisabled(true); // Disable odmah

    if (roundQuestions[round]?.answer === e.target.value) {
      setScore((prev) => prev + currentTime);
      console.log(`Poeni u rundi ${round} : ${currentTime} a ukupno: ${score}`);
    }

    setShowCorrectAnswer(true);

    setTimeout(() => {
      setShowCorrectAnswer(false);
      nextRound();
      setButtonsDisabled(false); // enable dugmad tek nakon promene runde
    }, 1000);
  };

  return (
    <>
      {!gameOver ? (
        <div
          className="category-wrapper"
          style={{
            backgroundImage: `url(${backgrounds[category.number - 1]})`,
          }}
        >
          <div className="category-heading">
            <div className="category-name">
              <img src={smallIcons[category.number - 1]} alt="small-icon" />
              <h2>{category.title}</h2>
            </div>
            <div
              className="category-timer"
              style={{ backgroundColor: `${colors[category.number - 1]}` }}
            >
              {remainingTime}
            </div>
          </div>
          <div className="category-questions">
            <div
              className="category-question"
              style={{ backgroundColor: `${colors[category.number - 1]}` }}
            >
              {roundQuestions[round]?.question}
            </div>
            <div className="category-answers">
              {roundQuestions[round]?.choices.map((choice, index) => {
                return (
                  <button
                    key={index}
                    className={
                      "answer " +
                      "answer" +
                      (index + 1) +
                      (showCorrectAnswer &&
                      choice === roundQuestions[round]?.answer
                        ? " correct-answer"
                        : "")
                    }
                    style={{
                      backgroundColor: colors[category.number - 1],
                    }}
                    onClick={handleAnswer}
                    value={choice}
                    disabled={buttonsDisabled}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
          <img
            src={bigIcons[category.number - 1]}
            alt="big-icon"
            id="BIG-ICON"
          />
        </div>
      ) : (
        <Score category={category} scorePoints={score} />
      )}
    </>
  );
};

export default Category;
