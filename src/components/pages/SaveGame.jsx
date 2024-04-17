import React from "react";


// Images
import Bandcamp from "../../assets/images/socials/bandcamp-icon.png";

const SaveGame = ({ onSaveGame, onComplete }) => {
  return (
    <div id="startBox">
      <div>
        <h3 id="startPrompt">
          Want to save your game?
        </h3>
        <button onClick={onSaveGame} className="btn">Save Game</button>
      </div>
      <div className="imageMaterialize imagePulse">
        <img className="borderRadius" alt="The bandcamp music distributionicon" src={Bandcamp} width="110" height="50"></img>
      </div>
    </div>
  );
}

export default SaveGame;