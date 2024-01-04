import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchQuizQuestions } from '../Services/api';
import Question from './Question';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5);
  const timerRef = useRef();

  const handleAnswerSelect = useCallback(
    (selectedOption) => {
      clearInterval(timerRef.current); // Clear the interval when moving to the next question

      if (selectedOption === questions[currentQuestion].correct_answer) {
        setScore((prevScore) => prevScore + 1);
      }

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
        setTimer(5); // Reset the timer for the next question
      } else {
        clearInterval(timerRef.current); // Clear the interval when the quiz is completed
      }
    },
    [questions, currentQuestion]
  );

  const skipQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setTimer(5); // Reset the timer for the next question
    } else {
      clearInterval(timerRef.current); // Clear the interval when the quiz is completed
    }
  };

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      handleAnswerSelect(); // Automatically move to the next question when the timer reaches 0
    }

    return () => clearInterval(timerRef.current);
  }, [timer, handleAnswerSelect]);

  const startQuiz = () => {
    setTimer(5); // You can adjust the initial timer value as needed
    setCurrentQuestion(0);
    setScore(0);
  };

  useEffect(() => {
    const loadQuizQuestions = async () => {
      const data = await fetchQuizQuestions();
      setQuestions(data);
      startQuiz(); // Start the quiz once questions are loaded
    };

    loadQuizQuestions();
  }, []); // Empty dependency array ensures that this effect runs once on component mount

  const restartQuiz = () => {
    startQuiz(); // Restart the quiz
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }
  if (currentQuestion === questions.length) {
    return (
      <div className="Quiz">
        <h2>Quiz Completed!</h2>
        <p>Your final score is: {score}</p>
        <button onClick={restartQuiz}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className="Quiz">
      <Question
        question={questions[currentQuestion].question}
        options={questions[currentQuestion].incorrect_answers.concat(
          questions[currentQuestion].correct_answer
        )}
        onSelectAnswer={handleAnswerSelect}
      />
      <p>Time remaining: {timer} seconds</p>
      <p>Score: {score}</p>
      <p>
        Question {currentQuestion + 1} of {questions.length}
      </p>
      <button className="skip-button" onClick={skipQuestion}>Skip Question</button>
    </div>
  );
};

export default Quiz;
