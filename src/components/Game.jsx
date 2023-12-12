import React, { useState, useEffect } from 'react';
import ItemsAndLives from './Items&Lives';
import ChapterOne from './ChapterOne';
import ChapterTwo from './ChapterTwo';
import HelpScreen from './HelpScreen';
import LifeLostPage from './LifeLostPage';

const Game = () => {
  const [livesLeft, setLivesLeft] = useState(3);
  const [skullFlag, setSkullFlag] = useState(false);
  const [backButtonFlag, setBackButtonFlag] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showHelp, setShowHelp] = useState(false);
  const [showLifeLost, setShowLifeLost] = useState(false);

  // Mapping of chapter numbers to names
  const chapterNames = {
    1: 'The Cove',
    2: 'The Enchanted Forest',
    // ... other chapter names
  };

  const loseLife = () => {
    if (livesLeft > 0) {
      setLivesLeft(livesLeft - 1);
    }
    if (livesLeft === 1) {
      setSkullFlag(true);
      setBackButtonFlag(false);
      // Additional logic for game over...
    }
  };

  const handleCloseLifeLostPage = () => {
    setShowLifeLost(false);
  };

  const resetGame = () => {
    setLivesLeft(3);
    setSkullFlag(false);
    setBackButtonFlag(true);
    // Reset other game states as needed
  };

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
    switch (currentChapter) {
      case 1:
        return <ChapterOne onComplete={goToNextChapter} />;
      case 2:
        return <ChapterTwo onComplete={goToNextChapter} />;
      // ... other cases
      default:
        return <div>Game Completed!</div>;
    }
  };

  return (
    <div>
      {renderChapter()}
      {showHelp && <HelpScreen />}
      {showLifeLost && <LifeLostPage livesLeft={livesLeft} onClose={handleCloseLifeLostPage} />}
      <ItemsAndLives livesLeft={livesLeft} />
      
      <div className="chapter-info">
        {chapterNames[currentChapter] || 'Unknown'}
      </div>
    </div>
  );
};

export default Game;
