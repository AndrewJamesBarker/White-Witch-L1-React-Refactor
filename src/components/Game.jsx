// Game.jsx
import React, { useState } from 'react';
import ItemsAndLives from './Items&Lives'
import ChapterOne from './ChapterOne';
import ChapterTwo from './ChapterTwo';
// Import other chapters...

const Game = () => {

  // const [lives, setLives] = useState(initialLives);
  // const [items, setItems] = useState(initialItems);
  const [currentChapter, setCurrentChapter] = useState(1);

  const goToNextChapter = () => {
    setCurrentChapter(currentChapter + 1);
  };

  const renderChapter = () => {
    switch(currentChapter) {
      case 1:
        return <ChapterOne onComplete={goToNextChapter} />;
      case 2:
        return <ChapterTwo onComplete={goToNextChapter} />;
      default:
        return <div>Game Completed!</div>;
    }
  };

  return (
    <div>
      {renderChapter()}
      <ItemsAndLives  />
    </div>
  );
};

export default Game;
