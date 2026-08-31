import React, { useState, useEffect, useRef } from 'react';
import ItemsAndLives from '../ui/ItemsAndLives';
import LevelItemsMap from '../utilities/levelItemsMap';
import ChapterOne from '../chapters/ChapterOne';
import ChapOneAltState from "../chapters/altStateChapters/ChapOneAltState";
import ChapterTwo from '../chapters/ChapterTwo';
import ChapterTwoMusicPlayer from '../chapters/ChapterTwoMusicPlayer';
import ChapterTwoAltState from "../chapters/altStateChapters/ChapterTwoAltState";
import ChapterThree from '../chapters/ChapterThree';
import HelpScreen from '../pages/HelpScreen';
import LifeLostPage from '../pages/LifeLostPage';
import LifeGainPage from '../pages/LifeGainPage';
import InventoryPage from '../pages/InventoryPage';
import RegisterForm from '../forms/RegisterForm';
import { useAuth } from '../../context/AuthContext';
import { useGameState } from "../../context/GameStateContext";
import api from '../../services/api';
import { E_CRYSTAL } from '../utilities/itemKeys';

const Game = () => {

  const {
    currentChapter,
    setCurrentChapter,
    livesLeft,
    setLivesLeft,
    items,
    setItems,
    chaptersCompleted,
    setChaptersCompleted,
    viewingChapter,
    setViewingChapter,
    completeChapter,
    updateItem,
    updateLife,
    removeItem,
    hasConch,
    setHasConch,
    hasPearl,
    setHasPearl,
    hasLaser,
  } = useGameState(); // Context-provided state and functions

  const [showHelp, setShowHelp] = useState(false);
  const [showLifeLost, setShowLifeLost] = useState(false);
  const [showLifeGain, setShowLifeGain] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [deathCause, setDeathCause] = useState('');
  const [lifeCause, setLifeCause] = useState('');
  const [showCrystal, setShowCrystal] = useState(true);
  const [currentScene, setCurrentScene] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [showChapterTwoCompletionScreen, setShowChapterTwoCompletionScreen] = useState(false);
  const [isChapterOneEarlyReturnActive, setIsChapterOneEarlyReturnActive] = useState(false);
  const helpRef = useRef(null);
  const inventoryRef = useRef(null);
  const lifeLostRef = useRef(null);
  const lifeGainRef = useRef(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const { isAuthenticated, user, setUser } = useAuth();
  

  useEffect(() => {
    const guestUser = JSON.parse(sessionStorage.getItem('guestUser'));

    if (user && user.gameState) {
        setCurrentChapter(user.gameState.currentChapter.level || 1);
        setLivesLeft(user.gameState.livesLeft ?? 3);
        setItems(user.gameState.items || []); // Update items directly
    } else if (guestUser && guestUser.gameState) {
        setCurrentChapter(guestUser.gameState.currentChapter.level || 1);
        setLivesLeft(guestUser.gameState.livesLeft ?? 3);
        setItems(guestUser.gameState.items || []); // Update items directly
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

  const handleChapterTwoComplete = async () => {
    setShowChapterTwoCompletionScreen(true);
    setViewingChapter(2);
    await completeChapter(2);
    setChaptersCompleted((previous) => ({
      ...previous,
      chapterOne: false,
      chapterTwo: true,
    }));
    setCurrentChapter(3);
  };

  const unlockChapterOneAfterChapterTwoAltState = async () => {
    setChaptersCompleted((previous) => ({
      ...previous,
      chapterOne: true,
    }));

    if (isAuthenticated) {
      const currentUser = JSON.parse(sessionStorage.getItem('user')) || user;
      const updatedGameState = {
        ...currentUser?.gameState,
        chaptersCompleted: {
          ...currentUser?.gameState?.chaptersCompleted,
          chapterOne: true,
        },
      };

      try {
        const response = await api.patch(
          '/auth/gamestate',
          { gameState: updatedGameState },
          { withCredentials: true }
        );
        const updatedUser = { ...currentUser, gameState: response.data.gameState };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (err) {
        console.error('Error restoring Chapter One access', err);
      }

      return;
    }

    const guestUser = JSON.parse(sessionStorage.getItem('guestUser')) || {};
    const updatedGuestUser = {
      ...guestUser,
      gameState: {
        ...guestUser.gameState,
        chaptersCompleted: {
          ...guestUser.gameState?.chaptersCompleted,
          chapterOne: true,
        },
      },
    };

    sessionStorage.setItem('guestUser', JSON.stringify(updatedGuestUser));
  };

  const relockChapterOneAfterEarlyReturn = async () => {
    setChaptersCompleted((previous) => ({
      ...previous,
      chapterOne: false,
    }));

    if (isAuthenticated) {
      const currentUser = JSON.parse(sessionStorage.getItem('user')) || user;
      const updatedGameState = {
        ...currentUser?.gameState,
        chaptersCompleted: {
          ...currentUser?.gameState?.chaptersCompleted,
          chapterOne: false,
        },
      };

      try {
        const response = await api.patch(
          '/auth/gamestate',
          { gameState: updatedGameState },
          { withCredentials: true }
        );
        const updatedUser = { ...currentUser, gameState: response.data.gameState };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (err) {
        console.error('Error relocking Chapter One access', err);
      }

      return;
    }

    const guestUser = JSON.parse(sessionStorage.getItem('guestUser')) || {};
    const updatedGuestUser = {
      ...guestUser,
      gameState: {
        ...guestUser.gameState,
        chaptersCompleted: {
          ...guestUser.gameState?.chaptersCompleted,
          chapterOne: false,
        },
      },
    };

    sessionStorage.setItem('guestUser', JSON.stringify(updatedGuestUser));
  };

  useEffect(() => {
    if (viewingChapter !== 2 && showChapterTwoCompletionScreen) {
      setShowChapterTwoCompletionScreen(false);
    }
  }, [showChapterTwoCompletionScreen, viewingChapter]);

  useEffect(() => {
    if (viewingChapter === 1 || !isChapterOneEarlyReturnActive) {
      return;
    }

    setIsChapterOneEarlyReturnActive(false);
    relockChapterOneAfterEarlyReturn();
  }, [isChapterOneEarlyReturnActive, viewingChapter]);

  useEffect(() => {
    return () => {
      if (isChapterOneEarlyReturnActive) {
        relockChapterOneAfterEarlyReturn();
      }
    };
  }, [isChapterOneEarlyReturnActive]);


  const obtainItem = async (itemName) => {
    const gemName = itemName === E_CRYSTAL ? "E Crystal" : null;
    const itemAlreadyExists = items.includes(itemName);

    // Keep local context state in sync for newly found items.
    if (!itemAlreadyExists) {
      setItems([...items, itemName]);
    }

    if (isAuthenticated) {
      // For gems, always attempt sync so nested gem data can be backfilled.
      if (!itemAlreadyExists || gemName) {
        await updateItem(itemName, gemName ? { gemName } : undefined);
      }
      return;
    }

    const guestUser = JSON.parse(sessionStorage.getItem('guestUser')) || {
      gameState: {
        items: [],
        gems: { collected: [] },
        chaptersCompleted: {},
        currentChapter: { level: 1, completed: false }
      }
    };

    const guestItems = guestUser.gameState.items || [];
    if (!guestItems.includes(itemName)) {
      guestUser.gameState.items = [...guestItems, itemName];
    }

    if (gemName) {
      guestUser.gameState.gems = {
        ...(guestUser.gameState.gems || {}),
        collected: [
          ...new Set([...(guestUser.gameState.gems?.collected || []), gemName]),
        ],
      };
    }

    sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
  };
    

  const handleSatchelClick = () => {
    setShowInventory((prev) => !prev);
  };

  const chapterNames = {
    1: 'The Cove',
    2: 'The Fields',
    3: 'Arkra',
  };

  const loseLife = (cause) => {
    if (livesLeft > 0) {
      const newLives = livesLeft - 1;
      setLivesLeft(newLives);
      setDeathCause(cause);
      if (!isAuthenticated) {
        const guestUser = JSON.parse(sessionStorage.getItem('guestUser')) || { gameState: { livesLeft: 3, items: [], chaptersCompleted: {}, currentChapter: { level: 1, completed: false } } };
        guestUser.gameState.livesLeft = newLives;
        sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
        // console.log('Updated guest user state:', guestUser);
      } else {
        updateLife(newLives);
      }
    }
  };

  const handleCloseLifeLostPage = () => {
    setShowLifeLost(false);
    if (livesLeft === 0) {
      resetGame()};
  };

  const lifeGainClose = (scene) => {
    
    setShowLifeGain(false);
    setShowCrystal(false);
    setCurrentScene(scene);
  };

  const gainLife = (cause) => {
    if (livesLeft < 3) {
      const newLives = livesLeft + 1;
   
      setLivesLeft(newLives);
      if (!isAuthenticated) {
        const guestUser = JSON.parse(sessionStorage.getItem('guestUser')) || { gameState: { livesLeft: 3, items: [], chaptersCompleted: {}, currentChapter: { level: 1, completed: false } } };
        guestUser.gameState.livesLeft = newLives;
        sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
        // console.log('Updated guest user state:', guestUser);
      } else {
        updateLife(newLives);
      }
    }
    setLifeCause(cause);
    setShowLifeGain(true);
  };

  const resetGame = async () => {
    // Step 1: Get level-specific items for the current chapter
    const levelSpecificItems = LevelItemsMap[currentChapter] || [];
  
    // Step 2: Remove level-specific items from the backend
    if (isAuthenticated) {
      for (const item of levelSpecificItems) {
        await removeItem(item); // Ensure items are removed one by one before proceeding
      }
    } else {
      // For guest users, remove items locally
      const guestUser = JSON.parse(sessionStorage.getItem("guestUser")) || {
        gameState: { items: [], chaptersCompleted: {}, currentChapter: { level: 1, completed: false } },
      };
      guestUser.gameState.items = guestUser.gameState.items.filter((item) => !levelSpecificItems.includes(item));
      sessionStorage.setItem("guestUser", JSON.stringify(guestUser));
    }
  
    // Step 3: Reset state variables
    setCurrentChapter(user?.gameState?.currentChapter?.level || 1);
    setLivesLeft(3); // Reset lives to default
    updateLife(3); // Update lives in the backend
    setResetSignal(true);
    setShowLifeLost(false);
  
    // Optional: Clear guest user data from session storage
    sessionStorage.removeItem("guestUser");
  };
  
  // This helps execute state changes that were inoperable directly in the resetGame function
  useEffect(() => {
    if (resetSignal) {
      setLivesLeft(3);
      updateLife(3);
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
    switch (viewingChapter) {
      case 1:
        return chaptersCompleted.chapterOne ? (
          <ChapOneAltState
            obtainItem={obtainItem}
            onEarlyReturnStateChange={setIsChapterOneEarlyReturnActive}
          />
        ) : (
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
            obtainItem={obtainItem}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            nextStep={nextStep}
            previousStep={previousStep}
            showCrystal={showCrystal}
            currentScene={currentScene}
            setCurrentScene={setCurrentScene}
          />
        );

      case 2:
        return chaptersCompleted.chapterTwo && !showChapterTwoCompletionScreen ? (
          <ChapterTwoAltState
            loseLife={loseLife}
            onComplete={unlockChapterOneAfterChapterTwoAltState}
            setShowLifeLost={setShowLifeLost}
            showLifeLost={showLifeLost}
            showHelp={showHelp}
            showInventory={showInventory}
            resetSignal={resetSignal}
          />
        ) : (
          <ChapterTwo
            onComplete={handleChapterTwoComplete}
            loseLife={loseLife}
            gainLife={gainLife}
            showLifeLost={showLifeLost}
            obtainItem={obtainItem}
            setShowLifeLost={setShowLifeLost}
            showLifeGain={showLifeGain}
            setShowLifeGain={setShowLifeGain}
            livesLeft={livesLeft}
            resetSignal={resetSignal}
            showHelp={showHelp}
            showInventory={showInventory}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            nextStep={nextStep}
            previousStep={previousStep}
            currentChapter={currentChapter}
            setCurrentChapter={setCurrentChapter}
          />
        );

      case 3:
        return <ChapterThree />;

      default:
        return <div>Game Completed!</div>;
    }
  };

  const shouldShowChapterTwoMusic = viewingChapter === 2;

  return (
    <div className='font-raleway '>
      {shouldShowChapterTwoMusic && <ChapterTwoMusicPlayer />}
      {renderChapterContent()}
      <ItemsAndLives onSatchelClick={handleSatchelClick} livesLeft={livesLeft} />
      <div className="chapter-info blue-text">
        <div>Chapter: {chapterNames[viewingChapter] || 'Unknown'}</div>
        {user && <div>Player: {user.username}</div>}
      </div>
    </div>
  );
};

export default Game;
