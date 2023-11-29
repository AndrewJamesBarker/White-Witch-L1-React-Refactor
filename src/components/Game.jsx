import React, { useState, useEffect } from 'react';
import ItemsAndLives from './Items&Lives'
import ChapterOne from './ChapterOne';
import ChapterTwo from './ChapterTwo';
import HelpScreen from './HelpScreen';

const Game = () => {

  // const [lives, setLives] = useState(initialLives);
  // const [items, setItems] = useState(initialItems);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showHelp, setShowHelp] = useState(false);

  const goToNextChapter = () => {
    setCurrentChapter(currentChapter + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'h') {
        setShowHelp(prev => !prev); // toggle showHelp
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      {showHelp && <HelpScreen />}
      <ItemsAndLives />
    </div>
  );
  
};

export default Game;
