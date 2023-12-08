import React, { useEffect } from 'react';
import trident from '../assets/images/environment/trident.png';

const StartPage = ({ onStartGame }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'y') {
        onStartGame(true);
      } else if (e.key.toLowerCase() === 'n') {
        onStartGame(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onStartGame]);

  return (
    <div id="startBox">
      <div className="cursorBox">
        <h3 id="startPrompt">Want to play a game? Type Y/N.</h3>
        <img src={trident} alt="A beautiful shimering trident" />
      </div>
    </div>
  );
}

export default StartPage;
