import React, { useEffect } from 'react';
import CoverArt from '../../assets/images/Poster/Poster-simple.png';

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
        <img className="center" src={CoverArt} alt="a rugged hero named Caballero in a dystopian world, with a mysterious sun emitting new light above and ominous figures looming in the background. Ethereal and ghostly, a Siren appears in the sky, adding a mystical element." />
      </div>
    </div>
  );
}

export default StartPage;
