import React, { useEffect } from "react";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PuzzleMap from '../ui/PuzzleMap';
import ChapterMap from '../utilities/ChapterMap';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Get gameState and userGameState from user
  const { gameState } = user;
  const { currentChapter, chaptersCompleted } = gameState;

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

  // Handle tile click (just for navigation, no state change in currentChapter)
  const handleTileClick = (id) => {
    const clickedPuzzlePiece = pieceIdToChapterMap[id];
    const chapterKey = ChapterMap[clickedPuzzlePiece]; // Get chapter key (e.g., "chapterOne")

    const isChapterCompleted = chaptersCompleted[chapterKey]; // Check if chapter is completed
    const isCurrentChapter = currentChapter.level === clickedPuzzlePiece;

    if (isChapterCompleted || isCurrentChapter) {
      console.log(`Chapter ${clickedPuzzlePiece} is accessible.`);
    } else {
      console.log(`Chapter ${clickedPuzzlePiece} is locked.`);
    }
  };

  return (
    <div>
      <h1>Hello {user.username}</h1>
      <button className="button" onClick={() => navigate('/')}>Continue</button>
      <button className="button" onClick={() => logout()}>Logout</button>
      
      <PuzzleMap 
        onTileClick={handleTileClick}
        userGameState={gameState} // Pass game state to PuzzleMap
      />
    </div>
  );
};

export default Dashboard;
