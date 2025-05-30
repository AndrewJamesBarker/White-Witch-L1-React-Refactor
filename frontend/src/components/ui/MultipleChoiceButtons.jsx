import React from 'react';

const MultipleChoiceButtons = ({ choices, onChoiceSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center mx-auto w-full max-w-2xl space-y-4 p-6">
      {choices.map((choice, index) => (
        <button 
          key={index} 
          onClick={() => onChoiceSelect(choice)}
          className="choose-wisely-button min-w-96 bg-gray-900/80 hover:bg-blue-600/90 active:bg-blue-700/90 
                     border-2 border-white/20 hover:border-blue-400/70 active:border-blue-300/80
                     rounded-xl px-6 py-4 text-base font-medium text-white
                     transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]
                     backdrop-blur-sm shadow-lg hover:shadow-blue-500/20
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <span className="flex items-center justify-center">
            {choice.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MultipleChoiceButtons;

