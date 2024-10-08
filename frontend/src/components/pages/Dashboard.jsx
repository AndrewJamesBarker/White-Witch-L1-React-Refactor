import React, { useState, useEffect }from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PuzzleMap from '../ui/PuzzleMap';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleTileClick = (row, col) => {
    console.log(`Tile clicked at row ${rowIndex}, column ${tileIndex}`);
  };
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleContinue = () => {
    if (user && user.gameState) {
      const currentChapter = user.gameState.currentChapter.level;
      // const livesLeft = user.gameState.livesLeft;
      // Navigate to the current chapter
      navigate(`/`);
    } else {
      console.error('No game state found for the user.');
    }
  };

  return (
    <div>
      <h1>Hello {user.username}</h1>
      <button className="button" onClick={handleContinue}>Continue</button>
      <button className="button" onClick={handleLogout}>Logout</button>
        <PuzzleMap onTileClick={handleTileClick}/>     
    </div>

  );
};

export default Dashboard;
