import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PuzzleMap from '../ui/PuzzleMap';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleTileClick = (id) => {
    console.log(`Tile clicked: ${id}`);
    // Example logic: You can map the piece ID to chapters here later
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

    console.log(`Chapter for ${id}: ${pieceIdToChapterMap[id]}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleContinue = () => {
    if (user && user.gameState) {
      const currentChapter = user.gameState.currentChapter.level;
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
      {/* Pass the handleTileClick function to PuzzleMap */}
      <PuzzleMap onTileClick={handleTileClick} />
    </div>
  );
};

export default Dashboard;
