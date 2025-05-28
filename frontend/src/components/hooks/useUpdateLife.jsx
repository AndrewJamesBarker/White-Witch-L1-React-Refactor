import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const useUpdateLife = () => {
  const { user, setUser } = useAuth();

  const updateLife = async (lives) => {
    if (!user) {
      // Update session storage for guest users
      let guestUser = JSON.parse(sessionStorage.getItem('guestUser')) || {
        gameState: { livesLeft: 3, items: [], chaptersCompleted: {}, currentChapter: { level: 1, completed: false } }
      };
      guestUser.gameState.livesLeft = lives;
      sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
      console.log('Updated guest user state:', guestUser);
      return;
    }

    let updatedGameState = {
      ...user.gameState,
      livesLeft: lives,
    };

    try {
      const response = await api.patch('/auth/gamestate', { gameState: updatedGameState }, { withCredentials: true });
      const updatedUser = { ...user, gameState: response.data.gameState };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Updated user state:', updatedUser);
    } catch (err) {
      console.error('Error updating game state', err);
    }
  };

  return updateLife;
};

export default useUpdateLife;
