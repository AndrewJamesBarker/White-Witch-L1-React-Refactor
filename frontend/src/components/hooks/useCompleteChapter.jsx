// src/hooks/useCompleteChapter.js
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';


const useCompleteChapter = () => {
  const { user, setUser } = useAuth();

  const completeChapter = async (chapter) => {
    if (!user) {
      return; 
    }

    const chapterMap = {
      1: 'chapterOne',
      2: 'chapterTwo',
      3: 'chapterThree',
      4: 'chapterFour',
      5: 'chapterFive',
      6: 'chapterSix',
      7: 'chapterSeven',
      8: 'chapterEight'
    };
    const chapterName = chapterMap[chapter];
    if (!chapterName) {
      console.error(`Invalid chapter number: ${chapter}`);
      return;
    }

    const updatedGameState = {
      ...user.gameState,
      currentChapter: { level: chapter + 1, completed: false },
      chaptersCompleted: {
        ...user.gameState.chaptersCompleted,
        [chapterName]: true,
      },
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

  return completeChapter;
};

export default useCompleteChapter;
