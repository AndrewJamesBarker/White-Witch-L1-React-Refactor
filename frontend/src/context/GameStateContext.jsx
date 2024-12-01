import React, { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import useCompleteChapter from '../components/hooks/useCompleteChapter';
import useUpdateItem from '../components/hooks/useUpdateItem';
import useUpdateLife from '../components/hooks/useUpdateLife';


// Default game state for new users or guests
const defaultGameState = {
  currentChapter: { level: 1, completed: false },
  items: ["laser pistol"], // Starting item
  livesLeft: 3,
  chaptersCompleted: {
    chapterOne: false,
    chapterTwo: false,
    chapterThree: false,
    chapterFour: false,
    chapterFive: false,
    chapterSix: false,
    chapterSeven: false,
    chapterEight: false,
  },
};

const GameStateContext = createContext();

export const useGameState = () => useContext(GameStateContext);

  const GameStateProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  // State variables initialized from defaultGameState
  const [currentChapter, setCurrentChapter] = useState(defaultGameState.currentChapter.level);
  const [viewingChapter, setViewingChapter] = useState(defaultGameState.currentChapter.level);
  const [livesLeft, setLivesLeft] = useState(defaultGameState.livesLeft);
  const [items, setItems] = useState(defaultGameState.items);
  const [hasConch, setHasConch] = useState(false);
  const [hasPearl, setHasPearl] = useState(false);
  const [chaptersCompleted, setChaptersCompleted] = useState(defaultGameState.chaptersCompleted);
  const [resetSignal, setResetSignal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showLifeLost, setShowLifeLost] = useState(false);
  const [showLifeGain, setShowLifeGain] = useState(false);
  const [deathCause, setDeathCause] = useState('');
  const [lifeCause, setLifeCause] = useState('');
  const [showCrystal, setShowCrystal] = useState(true);
  const [currentScene, setCurrentScene] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  // Hooks for updating data in the database
  const completeChapter = useCompleteChapter();
  const updateItem = useUpdateItem();
  const updateLife = useUpdateLife();

  // Initialize state based on user or guest data
  useEffect(() => {
    const guestUser = JSON.parse(sessionStorage.getItem('guestUser'));

    if (user && user.gameState) {
      setCurrentChapter(user.gameState.currentChapter.level || defaultGameState.currentChapter.level);
      setLivesLeft(user.gameState.livesLeft ?? defaultGameState.livesLeft);
      setItems([...new Set([...defaultGameState.items, ...(user.gameState.items || [])])]);
      setChaptersCompleted({ ...defaultGameState.chaptersCompleted, ...user.gameState.chaptersCompleted });
      setHasConch(user.gameState.items.includes('Conch'));
      setHasPearl(user.gameState.items.includes('Pearl'));
    } else if (guestUser && guestUser.gameState) {
      setCurrentChapter(guestUser.gameState.currentChapter.level || defaultGameState.currentChapter.level);
      setLivesLeft(guestUser.gameState.livesLeft ?? defaultGameState.livesLeft);
      setItems([...new Set([...defaultGameState.items, ...(guestUser.gameState.items || [])])]);
      setChaptersCompleted({ ...defaultGameState.chaptersCompleted, ...guestUser.gameState.chaptersCompleted });
      setHasConch(guestUser.gameState.items.includes('Conch'));
      setHasPearl(guestUser.gameState.items.includes('Pearl'));
    }
  }, [user]);

  // Function to reset the game
  const resetGame = () => {
    setLivesLeft(defaultGameState.livesLeft);
    setCurrentChapter(defaultGameState.currentChapter.level);
    setResetSignal(true);
    setShowLifeLost(false);
    setHasConch(false);
    setHasPearl(false);
    setItems(defaultGameState.items);
    setChaptersCompleted(defaultGameState.chaptersCompleted);
    if (isAuthenticated) {
      updateLife(3);
    } else {
      sessionStorage.removeItem('guestUser');
    }
  };

  // Function to obtain an item
  const obtainItem = (item) => {
    if (!items.includes(item)) {
      setItems((prevItems) => [...prevItems, item]);
      if (item === 'Conch') setHasConch(true);
      if (item === 'Pearl') setHasPearl(true);

      if (isAuthenticated) {
        updateItem(item);
      } else {
        const guestUser = JSON.parse(sessionStorage.getItem('guestUser')) || { gameState: { items: [] } };
        if (!guestUser.gameState.items.includes(item)) {
          guestUser.gameState.items.push(item);
          sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
        }
      }
    }
  };

  return (
    <GameStateContext.Provider value={{
      currentChapter,
      setCurrentChapter,
      viewingChapter,
      setViewingChapter,
      livesLeft,
      setLivesLeft,
      items,
      hasConch,
      hasPearl,
      obtainItem,
      resetSignal,
      showHelp,
      setShowHelp,
      showInventory,
      setShowInventory,
      showLifeLost,
      setShowLifeLost,
      showLifeGain,
      setShowLifeGain,
      deathCause,
      setDeathCause,
      lifeCause,
      setLifeCause,
      showCrystal,
      setShowCrystal,
      currentScene,
      setCurrentScene,
      currentStep,
      setCurrentStep,
      resetGame,
      nextStep: () => setCurrentStep((prev) => prev + 1),
      previousStep: () => setCurrentStep((prev) => prev - 1),
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

// Export both the provider and default game state
export { GameStateProvider, defaultGameState };
