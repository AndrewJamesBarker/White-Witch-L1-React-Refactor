import React, { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import useCompleteChapter from '../components/hooks/useCompleteChapter';
import useUpdateItem from '../components/hooks/useUpdateItem';
import useUpdateLife from '../components/hooks/useUpdateLife';

// Default game state for new users or guests
const defaultGameState = {
  currentChapter: { level: 1, completed: false },
  items: ['laser pistol'], // Starting item
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

// Create a context for game state
const GameStateContext = createContext();

const GameStateProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  // State variables
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
  const [showRegisterForm, setShowRegisterForm] = useState(false);
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

  // Reset game function
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
      updateLife(defaultGameState.livesLeft);
    } else {
      sessionStorage.removeItem('guestUser');
    }
  };

  // Obtain an item
  const obtainItem = (itemName) => {
    if (!items.includes(itemName)) {
      setItems((prevItems) => [...prevItems, itemName]);

      if (itemName === 'Conch') setHasConch(true);
      if (itemName === 'Pearl') setHasPearl(true);

      if (isAuthenticated) {
        updateItem(itemName);
      } else {
        const guestUser = JSON.parse(sessionStorage.getItem('guestUser')) || { gameState: { items: [] } };
        if (!guestUser.gameState.items.includes(itemName)) {
          guestUser.gameState.items.push(itemName);
          sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
        }
      }
    }
  };

  // Lose a life
  const loseLife = (cause) => {
    if (livesLeft > 0) {
      const newLives = livesLeft - 1;
      setLivesLeft(newLives);
      setDeathCause(cause);

      if (isAuthenticated) {
        updateLife(newLives);
      } else {
        const guestUser = JSON.parse(sessionStorage.getItem('guestUser')) || { gameState: { livesLeft: defaultGameState.livesLeft } };
        guestUser.gameState.livesLeft = newLives;
        sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
      }
    }
  };

  // Gain a life
  const gainLife = (cause) => {
    if (livesLeft < defaultGameState.livesLeft) {
      const newLives = livesLeft + 1;
      setLivesLeft(newLives);
      setLifeCause(cause);
      setShowLifeGain(true);

      if (isAuthenticated) {
        updateLife(newLives);
      } else {
        const guestUser = JSON.parse(sessionStorage.getItem('guestUser')) || { gameState: { livesLeft: defaultGameState.livesLeft } };
        guestUser.gameState.livesLeft = newLives;
        sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
      }
    }
  };

  return (
    <GameStateContext.Provider
      value={{
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
        showRegisterForm,
        setShowRegisterForm,
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
        loseLife,
        gainLife,
        nextStep: () => setCurrentStep((prev) => prev + 1),
        previousStep: () => setCurrentStep((prev) => prev - 1),
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

// Exports
export { GameStateProvider, defaultGameState };
export const useGameState = () => useContext(GameStateContext);
