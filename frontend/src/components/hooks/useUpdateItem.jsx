// src/hooks/useUpdateItem.jsx
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const useUpdateItem = () => {
  const { user, setUser } = useAuth();

  const updateItem = async (item) => {
    if (!user) {
      console.error('No user is authenticated.');
      return;
    }

    // Check if the item already exists in the items array
    if (user.gameState.items.includes(item)) {
      return; 
    }

    const updatedGameState = {
      ...user.gameState,
      items: [...user.gameState.items, item], // Add the new item to the items array
      
    };

    try {
      const response = await api.patch('/api/users/auth/gamestate', { gameState: updatedGameState }, { withCredentials: true });
      const updatedUser = { ...user, gameState: response.data.gameState };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Updated user state:', updatedUser); // Log the updated user state

    } catch (err) {
      console.error('Error updating game state', err);
    }
  };

  return updateItem;
};

export default useUpdateItem;
