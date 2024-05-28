import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/core/Game';
import StartPage from './components/pages/StartPage';
import NoPlayPage from './components/utilities/NoPlayPage';
import SignInSaveButton from './components/ui/SignInSaveButton';
import Dashboard from './components/pages/Dashboard'; // Assuming you have a Dashboard component
import axios from 'axios';
import { AuthProvider } from './context/AuthContext'; 

function App() {
  const [startGame, setStartGame] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA' ||
          document.activeElement.tagName === 'SELECT') {
        return;
      }
      if (event.key === 's') {
        setStartGame(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStartGame = (start) => {
    setStartGame(start);
  };

  const handleSaveGame = async () => {
    try {
      const gameState = { /* your game state data */ };
      const response = await axios.patch(`/api/user/gamestate/${userId}`, gameState, {
        headers: {
          Authorization: `Bearer ${yourAuthToken}`, // Replace with your actual token
        },
      });
      console.log('Game state saved', response.data);
    } catch (err) {
      console.error('Error saving game state', err);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    console.log('User registered');
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setUserId('user-id'); // Replace with actual user ID after sign in
    console.log('User signed in');
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={
              startGame === null ? 
              <StartPage onStartGame={handleStartGame} /> : 
              startGame ? 
              <Game /> : 
              <NoPlayPage />
            } />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <SignInSaveButton 
            onSaveGame={handleSaveGame} 
            onSignIn={handleSignIn}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
