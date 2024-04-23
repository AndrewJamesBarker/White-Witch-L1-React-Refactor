import React from "react";


// Images
import Bandcamp from "../../assets/images/socials/bandcamp-icon.png";

const SaveGame = ({ onSaveGame, onComplete }) => {
  return (
    <div id="startBox" className="widthControl">
      <div>
        <h3 id="startPrompt">
          Want to save your game?
        </h3>
      </div>
      {/* <p className="standardText">Like the music you heard?</p> */}
      <p className="standardText ">By registering, not only will you be able to store your progress, you will receive a free download code for the album 'White Witch'!</p>
      {/* <div className="imageMaterialize imagePulse">
        <img className="borderRadius" alt="The bandcamp music distributionicon" src={Bandcamp} width="110" height="50"></img>
      </div> */}
      <button onClick={onSaveGame} className="btn">Save Game</button>

    </div>
  );
}

export default SaveGame;