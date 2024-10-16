import React, { useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PuzzleMap from '../ui/PuzzleMap';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Map piece IDs to chapters
  const pieceIdToChapterMap = {
    piece1: 1,
    piece2: 2,
    piece3: 3,
    piece4: 4,
    piece5: 5,
    piece6: 6,
    piece7: 7,
    piece8: 8,
    piece9: 9,
    piece10: 10,
    piece11: 11,
    piece12: 12,
  };

  // Handle tile click to update game state and send information to PuzzleMap
  const handleTileClick = (id) => {
    console.log(`Tile clicked: ${id}`);
    const chapter = pieceIdToChapterMap[id];

    const { currentChapter, chaptersCompleted } = user.gameState;
    const isChapterCompleted = chaptersCompleted[`chapter${chapter}`];
    const isCurrentChapter = currentChapter.level === chapter;

    if (isChapterCompleted || isCurrentChapter) {
      console.log(`Chapter ${chapter} is unlocked or completed. Setting as current.`);
      user.gameState.currentChapter.level = chapter; // Update current chapter
      // Possibly trigger a re-render or update user state
    } else {
      console.log(`Chapter ${chapter} is locked. Cannot select.`);
    }
  };

  return (
    <div>
      <h1>Hello {user.username}</h1>
      <button className="button" onClick={() => navigate('/')}>Continue</button>
      <button className="button" onClick={() => logout()}>Logout</button>
      
      <PuzzleMap 
        onTileClick={handleTileClick} 
        userGameState={user.gameState}  // Pass game state to PuzzleMap
      />
    </div>
  );
};

export default Dashboard;
