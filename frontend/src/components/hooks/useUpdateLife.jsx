import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const useUpdateLife = () => {
  const { user, setUser } = useAuth();

  const updateLife = async (lives) => {
    if (!user) {
      // Update local storage for guest users
      let guestUser = JSON.parse(localStorage.getItem('guestUser')) || {
        gameState: { livesLeft: 3, items: [], chaptersCompleted: {}, currentChapter: { level: 1, completed: false } }
      };
      guestUser.gameState.livesLeft = lives;
      localStorage.setItem('guestUser', JSON.stringify(guestUser));
      console.log('Updated guest user state:', guestUser);
      return;
    }

    let updatedGameState = {
      ...user.gameState,
      livesLeft: lives,
    };

    try {
      const response = await api.patch('/api/users/auth/gamestate', { gameState: updatedGameState }, { withCredentials: true });
      const updatedUser = { ...user, gameState: response.data.gameState };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Updated user state:', updatedUser);
    } catch (err) {
      console.error('Error updating game state', err);
    }
  };

  return updateLife;
};

export default useUpdateLife;
