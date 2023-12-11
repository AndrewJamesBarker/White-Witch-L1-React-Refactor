import React, { useState, useEffect } from "react";
import "../assets/CSS/layout.css";
import "../assets/CSS/images.css";

import sirenCove from '../assets/images/environment/Siren-NoConch.png';
import ConchShore from '../assets/images/environment/Conch-Shore.png';


function ChapterOne() {

  const totalSteps = 6; // Define the total number of steps in ChapterOne
  const [currentStep, setCurrentStep] = useState(0);

  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    if (key === "c" && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else if (key === "b" && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentStep]); // Update listener when currentStep changes


  return (
    <div id="ChapterOnePage" className="widthControl">
      <h2 id="headLine">Chapter One: The Siren In The Cove</h2>
      {currentStep === 0 &&  (
        <div>
          <h3>Press C to continue</h3>
          <h4>You can also press H at anytime for help</h4>
        </div>
      )}
      {currentStep === 1 &&  (
        <div>
          <p>You are standing on the beach of a foggy cove. Ten feet out from shore, a beautiful woman sits on a protruding rock. She smiles at you seductively and begins singing a song. Strangely, you hear nothing but the waves lapping at your feet.</p>
          <p className="boldText">Press C to continue.</p>
          <div className="image-cropper">
            <img className="environ-image" src={sirenCove} alt="Siren on a rock, in a cove." width="500" height="250"></img>
          </div>
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <p>As you struggle to understand the Siren’s song, a conch shell washes up on the beach.</p>
          <img className="environ-image" src={ConchShore} alt="Siren on a rock, in a cove." width="500" height="500"></img>

        </div>
      )}
    </div>
  );
}

export default ChapterOne;

