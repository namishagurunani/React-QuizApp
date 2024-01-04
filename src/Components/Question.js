import React from 'react';

const Question = ({ question, options, onSelectAnswer }) => {
  return (
    <div>
      <h2>{question}</h2>
      <ul>
        {options.map((option, index) => (
          <li key={index} onClick={() => onSelectAnswer(option)}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
