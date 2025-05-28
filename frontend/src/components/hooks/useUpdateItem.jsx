import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const useUpdateItem = () => {
  const { user, setUser } = useAuth();

  const updateItem = async (item) => {
    const guestUser = JSON.parse(sessionStorage.getItem('guestUser'));

    // Check if the item already exists in the items array
    if (user) {
      if (user.gameState.items.includes(item)) {
        return; 
      }

      const updatedGameState = {
        ...user.gameState,
        items: [...user.gameState.items, item], // Add the new item to the items array
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
    } else {
      if (guestUser?.gameState?.items.includes(item)) {
        return;
      }

      const updatedLocalGameState = {
        ...guestUser,
        gameState: {
          ...guestUser?.gameState,
          items: [...guestUser?.gameState?.items, item],
        }
      };

      // Update session storage for guest users
      sessionStorage.setItem('guestUser', JSON.stringify(updatedLocalGameState));
      console.log('Updated guest user state:', updatedLocalGameState);
    }
  };

  return updateItem;
};

export default useUpdateItem;
