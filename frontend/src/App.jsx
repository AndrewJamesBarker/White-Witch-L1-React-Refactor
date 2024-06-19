import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/core/Game';
import StartPage from './components/pages/StartPage';
import NoPlayPage from './components/utilities/NoPlayPage';
import SignInDashButton from './components/ui/SignInDashButton';
import Dashboard from './components/pages/Dashboard';
import PrivateRoute from './components/pages/PrivateRoute';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext';
import RegisterForm from './components/forms/RegisterForm';
import SignInForm from './components/forms/SignInForm';
import { useAuth } from './context/AuthContext';

const AppContent = () => {
  const [startGame, setStartGame] = useState(null);
  const { logout, user } = useAuth();

  // Clear guest user data on page load
  useEffect(() => {
    localStorage.removeItem('guestUser');
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      logout();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [logout]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.tagName === 'SELECT'
      ) {
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
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const gameState = { /* your game state data */ };
      const response = await axios.patch(`/api/user/gamestate/${user.userId}`, gameState, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      console.log('Game state saved', response.data);
    } catch (err) {
      console.error('Error saving game state', err);
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            startGame === null ? (
              <StartPage onStartGame={handleStartGame} />
            ) : startGame ? (
              <Game />
            ) : (
              <NoPlayPage />
            )
          }
        />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <SignInDashButton />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
