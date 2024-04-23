import React from 'react';


const MultipleChoiceButtons = ({ choices, onChoiceSelect }) => {
  return (
    <div className="multiple-choice-container">
      {choices.map((choice, index) => (
        <button className='multiple-choice-buttons' key={index} onClick={() => onChoiceSelect(choice)}>
          {choice.label}
        </button>
      ))}
    </div>
  );
};

export default MultipleChoiceButtons;

