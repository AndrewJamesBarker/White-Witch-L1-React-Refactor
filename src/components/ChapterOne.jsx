import React, { useState, useEffect } from "react";
import "../assets/CSS/layout.css";

function ChapterOne() {

  const [showSecondPart, setShowSecondPart] = useState(false);
  const [showThirdPart, setShowThirdPart] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key.toLowerCase() === "c") {
      if (!showSecondPart) {
        setShowSecondPart(true);
      } else if (!showThirdPart) {
        setShowThirdPart(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSecondPart, showThirdPart]); // Include the states in the dependency array

  return (
    <div id="ChapterOnePage" className="widthControl">
      <h2 id="headLine">Chapter One: The Siren In The Cove</h2>
      {!showSecondPart && !showThirdPart && (
        <div>
          <h3>Press C to continue</h3>
          <h4>You can also press H at anytime for help</h4>
        </div>
      )}
      {showSecondPart && !showThirdPart && (
        <div>
          <p>You are standing on the beach of a foggy cove. Ten feet out from shore, a beautiful woman sits on a protruding rock. She smiles at you seductively and begins singing a song. Strangely, you hear nothing but the waves lapping at your feet.</p>
          <p className="boldText">Press C to continue.</p>
        </div>
      )}
      {showThirdPart && (
        <div>
          <p>As you struggle to hear the Siren’s song, a conch shell washes up on the beach.</p>
        </div>
      )}
    </div>
  );
}

export default ChapterOne;
