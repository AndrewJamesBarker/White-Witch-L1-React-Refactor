import { useState } from 'react';
import './App.css';
import Game from './components/core/Game';
import StartPage from './components/pages/StartPage';
import NoPlayPage from './components/utilities/NoPlayPage';
import SignInSaveButton from './components/ui/SignInSaveButton';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext'; 


function App() {
  const [startGame, setStartGame] = useState(null);

  const [userId, setUserId] = useState(null);

  const handleStartGame = (start) => {
    setStartGame(start);
  };

  const handleSaveGame = async () => {
    try {
      const gameState = { /* your game state data */ };
      const response = await axios.patch(`/api/user/gamestate/${userId}`, { gameState }, {
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
    // Registration logic here

    console.log('User registered');
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    // Sign in logic here

    setUserId('user-id'); // Replace with actual user ID after sign in
    console.log('User signed in');
  };

  return (
    <AuthProvider>
    <div className="App">
      {
        startGame === null ? 
          <StartPage onStartGame={handleStartGame} /> : 
          startGame ? 
            <Game /> : 
            <NoPlayPage />
      }
      <SignInSaveButton 
        onSaveGame={handleSaveGame} 
        onSignIn={handleSignIn}
      />
    </div>
    </AuthProvider>
  )
}

export default App;
