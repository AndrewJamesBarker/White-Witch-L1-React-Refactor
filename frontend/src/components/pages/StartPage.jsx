import React, { useEffect } from 'react';
import CoverArt from '../../assets/images/Poster/Poster-simple.webp';
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
        <img className="center titleImage" src={CoverArt} alt="a rugged hero in a dystopian world." loading="eager" decoding="async"/>
      </div>
    </div>
  );
}

export default StartPage;
