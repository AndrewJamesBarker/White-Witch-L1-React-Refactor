import React, { useState, useEffect, useRef } from 'react';
import ItemsAndLives from '../ui/ItemsAndLives';
import ChapterOne from '../chapters/ChapterOne';
import ChapterTwo from '../chapters/ChapterTwo';
import HelpScreen from '../pages/HelpScreen';
import LifeLostPage from '../pages/LifeLostPage';
import LifeGainPage from '../pages/LifeGainPage';
import InventoryPage from '../pages/InventoryPage';
import RegisterForm from '../forms/RegisterForm';
import useCompleteChapter from '../hooks/useCompleteChapter'; 
import useUpdateItem from '../hooks/useUpdateItem';
import useUpdateLife from '../hooks/useUpdateLife';
import { useAuth } from '../../context/AuthContext';

const Game = () => {
  const [chapOneCompleted, setChapOneCompleted] = useState(false);
  const [livesLeft, setLivesLeft] = useState(3);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showHelp, setShowHelp] = useState(false);
  const [showLifeLost, setShowLifeLost] = useState(false);
  const [showLifeGain, setShowLifeGain] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [deathCause, setDeathCause] = useState('');
  const [lifeCause, setLifeCause] = useState('');
  const [showCrystal, setShowCrystal] = useState(true);
  const [hasConch, setHasConch] = useState(false);
  const [hasPearl, setHasPearl] = useState(false);
  const [conchTaken, setConchTaken] = useState(false);
  const [currentScene, setCurrentScene] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const helpRef = useRef(null);
  const inventoryRef = useRef(null);
  const lifeLostRef = useRef(null);
  const lifeGainRef = useRef(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const completeChapter = useCompleteChapter(); // update chapter in db
  const updateItem = useUpdateItem(); // update item in db
  const updateLife = useUpdateLife(); // update life in db

  useEffect(() => {
    const guestUser = JSON.parse(localStorage.getItem('guestUser'));
    if (user && user.gameState) {
      // setCurrentChapter(user.gameState.currentChapter.level);
      setLivesLeft(user.gameState.livesLeft);
      if (user.gameState.items.includes('Conch')) setHasConch(true);
      if (user.gameState.items.includes('Pearl')) setHasPearl(true);
    } else if (guestUser && guestUser.gameState) {
      // setCurrentChapter(guestUser.gameState.currentChapter.level);
      setLivesLeft(guestUser.gameState.livesLeft);
      if (guestUser.gameState.items.includes('Conch')) setHasConch(true);
      if (guestUser.gameState.items.includes('Pearl')) setHasPearl(true);
    }
  }, [user]);

  const handleClickOutside = (event) => {
    if (livesLeft === 0) {
      resetGame();
    } else {
      if (showHelp && helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelp(false);
      }
      if (showInventory && inventoryRef.current && !inventoryRef.current.contains(event.target)) {
        setShowInventory(false);
      }
      if (showLifeLost && lifeLostRef.current && !lifeLostRef.current.contains(event.target)) {
        setShowLifeLost(false);
      }
      if (showLifeGain && lifeGainRef.current && !lifeGainRef.current.contains(event.target)) {
        setShowLifeGain(false);
        lifeGainClose(currentScene);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHelp, showInventory, showLifeLost, showLifeGain]);

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const changeStep = (step) => {
    setCurrentStep(step);
  };

  const handleRegister = () => {
    setShowRegisterForm(true);
  };

  const obtainConch = () => {
    setHasConch(true);

    if (isAuthenticated) {
      updateItem('Conch');
    } else {
      const guestUser = JSON.parse(localStorage.getItem('guestUser')) || { gameState: { items: [], chaptersCompleted: {}, currentChapter: { level: 1, completed: false } } };

      if (!guestUser.gameState.items) {
        guestUser.gameState.items = [];
      }

      if (!guestUser.gameState.items.includes('Conch')) {
        guestUser.gameState.items.push('Conch');
        localStorage.setItem('guestUser', JSON.stringify(guestUser));
        console.log('Updated guest user state:', guestUser);
      }
    }
  };

  const obtainPearl = () => {
    setHasPearl(true);
  };

  const handleSatchelClick = () => {
    setShowInventory((prev) => !prev);
  };

  const chapterNames = {
    1: user ? `The Cove - ${user.username}` : 'The Cove',
    2: user ? `The Fields - ${user.username}` : 'The Fields',
    3: user ? `The Ark  ${user.username}` : 'The Ark',
  };

  const loseLife = (cause) => {
    if (livesLeft > 0) {
      const newLivesLeft = livesLeft - 1;
      if (newLivesLeft === 0) {
        setLivesLeft(3);
        updateLife(3);
        resetGame();
      } else {
        setLivesLeft(newLivesLeft);
        updateLife(newLivesLeft);
      }
      setDeathCause(cause);
    }
  };

  const handleCloseLifeLostPage = () => {
    setShowLifeLost(false);
    if (livesLeft === 0) resetGame();
  };

  const lifeGainClose = (scene) => {
    setShowLifeGain(false);
    setShowCrystal(false);
    setCurrentScene(scene);
  };

  const gainLife = (cause) => {
    if (livesLeft < 3) {
      const newLivesLeft = livesLeft + 1;
      setLivesLeft(newLivesLeft);
      setLifeCause(cause);
      setShowLifeGain(true);
      updateLife(newLivesLeft);
    }
  };

  const resetGame = () => {
    setLivesLeft(3);
    setCurrentChapter(user?.gameState?.currentChapter?.level || 1);
    setResetSignal(true);
    setShowLifeLost(false);
    setConchTaken(false);
    setHasConch(false);
    localStorage.removeItem('guestUser');
  };

  useEffect(() => {
    if (resetSignal) {
      setResetSignal(false);
    }
  }, [resetSignal]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      if (e.key.toLowerCase() === 'h') {
        setShowHelp((prev) => !prev);
      }
      if (e.key.toLowerCase() === 'i') {
        setShowInventory((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const renderChapterContent = () => {
    if (showRegisterForm) {
      return <RegisterForm />;
    } else if (showHelp) {
      return <HelpScreen ref={helpRef} />;
    } else if (showInventory) {
      return <InventoryPage hasConch={hasConch} hasPearl={hasPearl} ref={inventoryRef} />;
    } else if (showLifeLost) {
      return <LifeLostPage resetGame={resetGame} livesLeft={livesLeft} onClose={handleCloseLifeLostPage} deathCause={deathCause} ref={lifeLostRef} />;
    } else if (showLifeGain) {
      return <LifeGainPage livesLeft={livesLeft} onClose={lifeGainClose} lifeCause={lifeCause} currentScene={currentScene} ref={lifeGainRef} />;
    } else {
      return renderChapter();
    }
  };

  const renderChapter = () => {
    switch (currentChapter) {
      case 1:
        return (
          <ChapterOne
            onComplete={() => completeChapter(1)}
            loseLife={loseLife}
            gainLife={gainLife}
            showLifeLost={showLifeLost}
            setShowLifeLost={setShowLifeLost}
            showLifeGain={showLifeGain}
            setShowLifeGain={setShowLifeGain}
            livesLeft={livesLeft}
            resetSignal={resetSignal}
            showHelp={showHelp}
            showInventory={showInventory}
            obtainConch={obtainConch}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            nextStep={nextStep}
            previousStep={previousStep}
            hasConch={hasConch}
            setHasConch={setHasConch}
            conchTaken={conchTaken}
            setConchTaken={setConchTaken}
            showCrystal={showCrystal}
            currentScene={currentScene}
            setCurrentScene={setCurrentScene}
            currentChapter={currentChapter}
            setCurrentChapter={setCurrentChapter}
          />
        );

      case 2:
        return (
          <ChapterTwo
            onComplete={() => completeChapter(2)}
            loseLife={loseLife}
            gainLife={gainLife}
            showLifeLost={showLifeLost}
            setShowLifeLost={setShowLifeLost}
            showLifeGain={showLifeGain}
            setShowLifeGain={setShowLifeGain}
            livesLeft={livesLeft}
            resetSignal={resetSignal}
            showHelp={showHelp}
            showInventory={showInventory}
            currentStep={currentStep}
            changeStep={changeStep}
            previousStep={previousStep}
            currentChapter={currentChapter}
            setCurrentChapter={setCurrentChapter}
          />
        );

      default:
        return <div>Game Completed!</div>;
    }
  };

  return (
    <div className='raleway'>
      {renderChapterContent()}
      <ItemsAndLives onSatchelClick={handleSatchelClick} livesLeft={livesLeft} />
      <div className="chapterInfo blueText">
        {chapterNames[currentChapter] || 'Unknown'}
      </div>
    </div>
  );
};

export default Game;
