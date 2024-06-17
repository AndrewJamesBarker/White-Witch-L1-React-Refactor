import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleContinue = () => {
    if (user && user.gameState) {
      const currentChapter = user.gameState.currentChapter.level;
      // Navigate to the current chapter
      navigate(`/`);
    } else {
      console.error('No game state found for the user.');
    }
  };

  const handleSave = async () => {
    try {
      const gameState = { /* your game state data */ };
      const response = await axios.patch(`/api/users/gamestate/${user.userId}`, gameState, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Game state saved', response.data);
    } catch (err) {
      console.error('Error saving game state', err);
    }
  };

  return (
    <div>
      <h1>Greetings {user.username}!</h1>
      <button className="button" onClick={handleContinue}>Continue</button>
      <button className="button" onClick={handleSave}>Save Game</button>
      <button className="button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
