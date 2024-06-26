import React, { useEffect } from 'react';
import CoverArt from '../../assets/images/Poster/Poster-simple.png';
import AudioPlayer from '../ui/AudioPlayer';
import TheDarktower from '../../assets/audio/Darktower-WhiteWitch-Version.mp3';

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
      <div>
        <h2 id="startPrompt">Want to play a game? <span className="blueText">Type Y/N</span></h2>
        <AudioPlayer src={TheDarktower} autoplay={false} />
        <img className="center titleImage" src={CoverArt} alt="a rugged hero named Caballero in a dystopian world, with a mysterious sun emitting new light above and ominous figures looming in the background. Ethereal and ghostly, a Siren appears in the sky, adding a mystical element." />
      </div>
    </div>
  );
}

export default StartPage;
