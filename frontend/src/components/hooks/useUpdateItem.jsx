import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const useUpdateItem = () => {
  const { user, setUser } = useAuth();

  const updateItem = async (item, options = {}) => {
    const { gemName } = options;
    const guestUser = JSON.parse(sessionStorage.getItem('guestUser'));

    // Check if the item already exists in the items array
    if (user) {
      const itemAlreadyExists = user.gameState.items.includes(item);
      const gemAlreadyExists = gemName
        ? (user.gameState.gems?.collected || []).includes(gemName)
        : true;

      if (itemAlreadyExists && gemAlreadyExists) {
        return; 
      }

      const updatedGameState = {
        ...user.gameState,
        items: itemAlreadyExists
          ? user.gameState.items
          : [...user.gameState.items, item],
        gems: gemName
          ? {
              ...(user.gameState.gems || {}),
              collected: [
                ...new Set([...(user.gameState.gems?.collected || []), gemName]),
              ],
            }
          : user.gameState.gems,
      };

      try {
        const response = await api.patch('/auth/gamestate', { gameState: updatedGameState }, { withCredentials: true });
        const updatedUser = { ...user, gameState: response.data.gameState };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        // console.log('Updated user state:', updatedUser);
      } catch (err) {
        console.error('Error updating game state', err);
      }
    } else {
      const itemAlreadyExists = guestUser?.gameState?.items.includes(item);
      const gemAlreadyExists = gemName
        ? (guestUser?.gameState?.gems?.collected || []).includes(gemName)
        : true;

      if (itemAlreadyExists && gemAlreadyExists) {
        return;
      }

      const updatedLocalGameState = {
        ...guestUser,
        gameState: {
          ...guestUser?.gameState,
          items: itemAlreadyExists
            ? guestUser?.gameState?.items
            : [...(guestUser?.gameState?.items || []), item],
          gems: gemName
            ? {
                ...(guestUser?.gameState?.gems || {}),
                collected: [
                  ...new Set([...(guestUser?.gameState?.gems?.collected || []), gemName]),
                ],
              }
            : guestUser?.gameState?.gems,
        }
      };

      // Update session storage for guest users
      sessionStorage.setItem('guestUser', JSON.stringify(updatedLocalGameState));
      // console.log('Updated guest user state:', updatedLocalGameState);
    }
  };

  return updateItem;
};

export default useUpdateItem;
