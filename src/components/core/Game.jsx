import React, { useState, useEffect } from 'react';
import ItemsAndLives from '../ui/ItemsAndLives';
import ChapterOne from '../chapters/ChapterOne';
import ChapterTwo from '../chapters/ChapterTwo';
import HelpScreen from '../pages/HelpScreen';
import LifeLostPage from '../pages/LifeLostPage';
import InventoryOverlay from '../pages/InventoryOverlay';

const Game = () => {
  const [livesLeft, setLivesLeft] = useState(3);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showHelp, setShowHelp] = useState(false);
  const [showLifeLost, setShowLifeLost] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [deathCause, setDeathCause] = useState('');
  const [hasConch, setHasConch] = useState(false);
  const [hasPearl, setHasPearl] = useState(false);

  const obtainConch = () => {
    setHasConch(true);
  };

  const obtainPearl = () => { 
    setHasPearl(true);
  }

  // Mapping of chapter numbers to names
  const chapterNames = {
    1: 'The Cove',
    2: 'The Fields',
    // ... other chapter names
  };

  const loseLife = (cause) => {
    if (livesLeft > 0) {
      setLivesLeft(livesLeft - 1);
      setDeathCause(cause);  // Update the death cause
    }
  };
  
  const handleCloseLifeLostPage = () => {
    setShowLifeLost(false);
    livesLeft === 0 && resetGame();
  };

  const resetGame = () => {
    setLivesLeft(3);
    setCurrentChapter(1);
    setResetSignal(true);
    setShowLifeLost(false);
  };

  useEffect(() => {
    if(resetSignal) {
      setResetSignal(false);
    }
  }, [resetSignal]);

  const goToNextChapter = () => {
    setCurrentChapter(currentChapter + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'h') {
        setShowHelp(prev => !prev); // toggle showHelp
      }
      if (e.key.toLowerCase() === 'i') {
        setShowInventory(prev => !prev); // toggle showInventory
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
          showLifeLost={showLifeLost}
          setShowLifeLost={setShowLifeLost} 
          resetSignal={resetSignal}
          showHelp={showHelp}
          showInventory={showInventory}
          obtainConch={obtainConch}
         />;
      case 2:
        return <ChapterTwo
          onComplete={goToNextChapter} 
          loseLife={loseLife}
          showLifeLost={showLifeLost}
          setShowLifeLost={setShowLifeLost} 
          resetSignal={resetSignal}
          showHelp={showHelp}
          showInventory={showInventory}
         />;
    
      default:
        return <div>Game Completed!</div>;
    }
  };

  return (
    <div>
      {renderChapter()}
      {showHelp && <HelpScreen />}
      {showInventory && <InventoryOverlay hasConch={hasConch} hasPearl={hasPearl} />}
      {showLifeLost && <LifeLostPage resetGame={resetGame} livesLeft={livesLeft} onClose={handleCloseLifeLostPage} deathCause={deathCause} />}
      <ItemsAndLives livesLeft={livesLeft} />
      
      <div className="chapter-info">
        {chapterNames[currentChapter] || 'Unknown'}
      </div>
    </div>
  );
};

export default Game;
