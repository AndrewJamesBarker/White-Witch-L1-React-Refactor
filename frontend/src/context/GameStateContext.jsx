import React, { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import useCompleteChapter from "../components/hooks/useCompleteChapter";
import useUpdateItem from "../components/hooks/useUpdateItem";
import useUpdateLife from "../components/hooks/useUpdateLife";
import useRemoveItem from "../components/hooks/useRemoveItem";

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

// Create the GameState context
const GameStateContext = createContext();

// Custom hook for consuming the context
export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }) => {
  const { user } = useAuth();

  // State variables
  const [currentChapter, setCurrentChapter] = useState(defaultGameState.currentChapter.level);
  const [viewingChapter, setViewingChapter] = useState(defaultGameState.currentChapter.level);
  const [livesLeft, setLivesLeft] = useState(defaultGameState.livesLeft);
  const [items, setItems] = useState(defaultGameState.items);
  const [chaptersCompleted, setChaptersCompleted] = useState(defaultGameState.chaptersCompleted);
  const [hasConch, setHasConch] = useState(items.includes("Conch")); // Initialize from items
  const [hasPearl, setHasPearl] = useState(items.includes("Pearl")); // Initialize from items

  useEffect(() => {
    // Update `hasConch` whenever `items` changes
    setHasConch(items.includes("Conch"));
    setHasPearl(items.includes("Pearl"));
  }, [items]);

  // Hooks for updating database or session storage
  const completeChapter = useCompleteChapter();
  const updateItem = useUpdateItem();
  const updateLife = useUpdateLife();
  const removeItem = useRemoveItem();

  // Initialize state from user or guest game state
  useEffect(() => {
    const guestUser = JSON.parse(sessionStorage.getItem("guestUser"));

    if (user && user.gameState) {
      setCurrentChapter(user.gameState.currentChapter.level || defaultGameState.currentChapter.level);
      setLivesLeft(user.gameState.livesLeft ?? defaultGameState.livesLeft);
      setItems([...new Set([...defaultGameState.items, ...(user.gameState.items || [])])]);
      setChaptersCompleted({ ...defaultGameState.chaptersCompleted, ...user.gameState.chaptersCompleted });
    } else if (guestUser?.gameState) {
      setCurrentChapter(guestUser.gameState.currentChapter.level || defaultGameState.currentChapter.level);
      setLivesLeft(guestUser.gameState.livesLeft ?? defaultGameState.livesLeft);
      setItems([...new Set([...defaultGameState.items, ...(guestUser.gameState.items || [])])]);
      setChaptersCompleted({ ...defaultGameState.chaptersCompleted, ...guestUser.gameState.chaptersCompleted });
    }
  }, [user]);

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
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

// Named exports for modular usage
export { defaultGameState };
