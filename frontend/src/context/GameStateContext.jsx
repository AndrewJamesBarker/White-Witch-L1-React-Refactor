import React, { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import useCompleteChapter from "../components/hooks/useCompleteChapter";
import useUpdateItem from "../components/hooks/useUpdateItem";
import useUpdateLife from "../components/hooks/useUpdateLife";
import useRemoveItem from "../components/hooks/useRemoveItem";

// Default game state for new users or guests
const defaultGameState = {
  currentChapter: { level: 1, completed: false },
  items: ["Laser Pistol"], // Starting item
  gems: {
    collected: [],
  },
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
    chapterNine: false,
    chapterTen: false,
    chapterEleven: false,
    chapterTwelve: false,
  },
};

// Create the GameState context
const GameStateContext = createContext();

// Custom hook for consuming the context
export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }) => {
  const { user } = useAuth();

  // State variables
  const [currentChapter, setCurrentChapter] = useState(defaultGameState.currentChapter.level);
  const [viewingChapter, setViewingChapterState] = useState(defaultGameState.currentChapter.level);
  const [hasManualViewingChapter, setHasManualViewingChapter] = useState(false);
  const [livesLeft, setLivesLeft] = useState(defaultGameState.livesLeft);
  const [items, setItems] = useState(defaultGameState.items);
  const [chaptersCompleted, setChaptersCompleted] = useState(defaultGameState.chaptersCompleted);
  const [hasConch, setHasConch] = useState(items.includes("Conch")); // Initialize from items
  const [hasPearl, setHasPearl] = useState(items.includes("Pearl")); // Initialize from items
  const [hasLaser, setHasLaser] = useState(items.includes("Laser Pistol"));

  useEffect(() => {
    // Update `hasLaser` whenever `items` changes
    if (items.includes("Laser Pistol")) {
      setHasLaser(true);
    } else {
      setHasLaser(false);
    }
  }, [items]);
  

  useEffect(() => {
    // Update `hasConch` and `hasPearl` whenever `items` changes
    if (items.includes("Conch")) {
      setHasConch(true);
    } else {
      setHasConch(false);
    }
  
    if (items.includes("Pearl")) {
      setHasPearl(true);
    } else {
      setHasPearl(false);
    }
  }, [items]);

  // Hooks for updating database or session storage
  const completeChapter = useCompleteChapter();
  const updateItem = useUpdateItem();
  const updateLife = useUpdateLife();
  const removeItem = useRemoveItem();

  const setViewingChapter = (chapter) => {
    setHasManualViewingChapter(true);
    setViewingChapterState(chapter);
  };

  useEffect(() => {
    setHasManualViewingChapter(false);
  }, [user?.userId]);

  // Initialize state from user or guest game state
  useEffect(() => {
    const guestUser = JSON.parse(sessionStorage.getItem("guestUser"));
    // Temporary Chapter 2 development lock:
    // keep Chapter 2/3 completion false and prevent loading beyond Chapter 2.
    // Remove this block once Chapter 2 completion flow is ready.

    if (user && user.gameState) {
      const loadedLevel = user.gameState.currentChapter.level || defaultGameState.currentChapter.level;
      const safeLevel = Math.min(loadedLevel, 2);
      setCurrentChapter(safeLevel);
      setViewingChapterState((prev) => (hasManualViewingChapter ? prev : safeLevel));
      setLivesLeft(user.gameState.livesLeft ?? defaultGameState.livesLeft);
      setItems([...new Set([...defaultGameState.items, ...(user.gameState.items || [])])]);
      setChaptersCompleted({
        ...defaultGameState.chaptersCompleted,
        ...user.gameState.chaptersCompleted,
        chapterTwo: false,
        chapterThree: false,
      });
    } else if (guestUser?.gameState) {
      const loadedLevel = guestUser.gameState.currentChapter.level || defaultGameState.currentChapter.level;
      const safeLevel = Math.min(loadedLevel, 2);
      setCurrentChapter(safeLevel);
      setViewingChapterState((prev) => (hasManualViewingChapter ? prev : safeLevel));
      setLivesLeft(guestUser.gameState.livesLeft ?? defaultGameState.livesLeft);
      setItems([...new Set([...defaultGameState.items, ...(guestUser.gameState.items || [])])]);
      setChaptersCompleted({
        ...defaultGameState.chaptersCompleted,
        ...guestUser.gameState.chaptersCompleted,
        chapterTwo: false,
        chapterThree: false,
      });
    }
  }, [user, hasManualViewingChapter]);

  // Context value
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
        setItems,
        chaptersCompleted,
        setChaptersCompleted,
        completeChapter, 
        updateItem, 
        updateLife,
        removeItem, 
        hasConch,
        setHasConch,
        hasPearl,
        setHasPearl,
        hasLaser,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

// Named exports for modular usage
export { defaultGameState };
