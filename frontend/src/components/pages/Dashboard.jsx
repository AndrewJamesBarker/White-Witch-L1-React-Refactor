import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h1>Greetings {user.username}!</h1>
      <button className="button">Resume Game</button>
      <button className="button">Save Game</button>
      <button className="button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
