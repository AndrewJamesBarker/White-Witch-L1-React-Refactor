import React, { useState, useEffect } from "react";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";
import MultipleChoiceButtons from "../ui/MultipleChoiceButtons";

import trident from '../../assets/images/environment/trident.png';
import sirenCove from '../../assets/images/environment/Siren-NoConch.png';
import ConchShore from '../../assets/images/environment/Conch-Shore.png';
import Conch from '../../assets/images/inventory-items/Conch-Good.png';


function ChapterOne({onComplete, loseLife, setShowLifeLost, showLifeLost, resetSignal, showHelp}) {


  const totalSteps = 6; // Define the total number of steps in ChapterOne
  const [currentStep, setCurrentStep] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [stepThreeCompleted, setStepThreeCompleted] = useState(false);
  const [conchTaken, setConchTaken] = useState(false);

  const choices = [ 
    {label: "Greet the Siren.", value: 1},
    {label: "Attack the Siren!", value: 2},
    {label: "Take the Conch Shell.", value: 3},
  ];

  const handleKeyDown = (event) => {
    if (showHelp) return;
    if (showLifeLost) return;
    const key = event.key.toLowerCase();
    if (key === "c" && currentStep < totalSteps - 1 && (currentStep !== 3 || stepThreeCompleted)) {
      setCurrentStep(currentStep + 1);
    } else if (key === "b" && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChoiceSelect = (choice) => {
    setUserChoice(choice);
    switch (choice.value) {
      case 1:
        setCurrentStep(2);
        break;
      case 2:
        setShowLifeLost(true);
        loseLife();
        break;
      case 3:
        setConchTaken(true);
        setStepThreeCompleted(true); 
        break;
      default:
        setCurrentStep(1);
    }
  }
  
// Reset steps on all lives lost

  useEffect(() => {
    if(resetSignal) {
      setCurrentStep(0);
    }
  }, [resetSignal]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentStep, showHelp, stepThreeCompleted, showLifeLost]); // Update listener when currentStep changes

  
  return (
    <div id="ChapterOnePage" className="widthControl">
      {currentStep === 0 && (
          <h2 id="headLine">Chapter One: The Siren In The Cove</h2>
      )} 
      {currentStep === 0 &&  (
        <div>
          <h3>Press C to continue</h3>
          <h4>You can also press H at anytime for help</h4>
          <img id='trident' src={trident} alt="A beautiful shimering trident" />
        </div>
      )}
      {currentStep === 1 &&  (
        <div>
          <p>You are standing on the beach of a foggy cove. Ten feet out from shore, a beautiful siren sits on a protruding rock. She smiles and her lips move as if singing. Strangely, you hear nothing but the waves lapping at your feet.</p>
          <div className="image-cropper">
            <img className="environ-image" src={sirenCove} alt="Siren on a rock, in a cove." width="500" height="250"></img>
          </div>
          <p className="boldText">C to continue.</p>
          {/* <p className="boldText">B for back.</p> */}
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <p>As you struggle to understand the Siren’s song, a conch shell washes up on the beach.</p>
          <p></p>
          <img className="environ-image" src={ConchShore} alt="Siren on a rock, in a cove." width="500" height="500"></img>
        </div>
      )}
      {currentStep === 3 && (
        <div>
          <h3>Choose wisely.</h3>
          <img className="environ-item" src={Conch} alt="A mystifyingly beautiful conch shell." width="260" height="250">
          </img>
          <MultipleChoiceButtons choices={choices.filter(choice => !conchTaken || choice.value !== 3)} onChoiceSelect={handleChoiceSelect} />
        </div>
      )}
    </div>
  );
}

export default ChapterOne;

