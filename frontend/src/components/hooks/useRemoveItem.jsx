import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const useRemoveItem = () => {
  const { user, setUser } = useAuth();

  const removeItem = async (item) => {
    if (item === "Laser Pistol") {
      return; // Prevent removal
    }
  
    const guestUser = JSON.parse(sessionStorage.getItem('guestUser')) || {
      gameState: { livesLeft: 3, items: [], chaptersCompleted: {}, currentChapter: { level: 1, completed: false } }
    };

    // For guest users
    if (!user) {
      if (!guestUser.gameState.items.includes(item)) {
        // console.log('Item does not exist for guest user:', item);
        return; // Item not present, nothing to remove
      }

      const updatedItems = guestUser.gameState.items.filter(existingItem => existingItem !== item);
      guestUser.gameState.items = updatedItems;
      sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
      console.log('Updated guest user state after item removal:', guestUser);
      return;
    }

    // For authenticated users
    if (!user.gameState.items.includes(item)) {
      // console.log('Item does not exist for authenticated user:', item);
      return; // Item not present, nothing to remove
    }

    const updatedItems = user.gameState.items.filter(existingItem => existingItem !== item);

    const updatedGameState = {
      ...user.gameState,
      items: updatedItems,
    };

    try {
      // Using the same route for all game state updates
      const response = await api.patch('/auth/gamestate', { gameState: updatedGameState }, { withCredentials: true });
      const updatedUser = { ...user, gameState: response.data.gameState };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      // console.log('Updated user state after item removal:', updatedUser);
    } catch (err) {
      console.error('Error updating game state for item removal:', err);
    }
  };

  return removeItem;
};

export default useRemoveItem;
