import React, { useState, useEffect } from 'react';
import ItemsAndLives from '../ui/ItemsAndLives';
import ChapterOne from '../chapters/ChapterOne';
import ChapterTwo from '../chapters/ChapterTwo';
import HelpScreen from '../utilities/HelpScreen';
import LifeLostPage from '../pages/LifeLostPage';

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
    2: 'The Fields',
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
    livesLeft === 0 && resetGame();
  };

  const resetGame = () => {
    setLivesLeft(3);
    setSkullFlag(false);
    setBackButtonFlag(true);
    setCurrentChapter(1);
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
        return <ChapterOne 
          onComplete={goToNextChapter} 
          loseLife={loseLife}
          setShowLifeLost={setShowLifeLost} 
         />;
      case 2:
        return <ChapterTwo
          onComplete={goToNextChapter} 
          loseLife={loseLife}
          setShowLifeLost={setShowLifeLost} 
         />;
    
      default:
        return <div>Game Completed!</div>;
    }
  };

  return (
    <div>
      {renderChapter()}
      {showHelp && <HelpScreen />}
      {showLifeLost && <LifeLostPage resetGame={resetGame} livesLeft={livesLeft} onClose={handleCloseLifeLostPage} />}
      <ItemsAndLives livesLeft={livesLeft} />
      
      <div className="chapter-info">
        {chapterNames[currentChapter] || 'Unknown'}
      </div>
    </div>
  );
};

export default Game;
