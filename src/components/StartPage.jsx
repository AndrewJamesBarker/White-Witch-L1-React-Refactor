import React, { useEffect, useState } from 'react';


const StartPage = ({ onStartGame }) => {  
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'y') {
        onStartGame(true);
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
        <h3 id="startPrompt">Want to play a game? Type Y/N</h3>
      </div>
    </div>
  );

}

export default StartPage;