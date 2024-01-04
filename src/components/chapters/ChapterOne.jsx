import React, { useState, useEffect } from "react";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";
import MultipleChoiceButtons from "../ui/MultipleChoiceButtons";

import DynamicOverlay from "../pages/DynamicOverlay";

import trident from "../../assets/images/environment/trident.png";
import sirenCove from "../../assets/images/environment/Siren-NoConch.png";
import ConchShore from "../../assets/images/environment/Conch-Shore.png";
import Conch from "../../assets/images/inventory-items/Conch-Good.png";
import DoorVision from "../../assets/images/environment/PortholeDoorVision.png";
import ConchInSatchel from "../../assets/images/environment/Conch-In-Satchel.png";
import Sundial from "../../assets/images/environment/Sundial.png";
import SoldierBlock from "../../assets/images/environment/SoldierBlock.png";

function ChapterOne({
  onComplete,
  loseLife,
  setShowLifeLost,
  showLifeLost,
  resetSignal,
  showHelp,
  showInventory,
  obtainConch,
}) {
  // Define the total number of steps in ChapterOne
  const totalSteps = 6;
  // Define the current step, starting at 0
  const [currentStep, setCurrentStep] = useState(0);
  // Define the user's choice, starting at null
  const [userChoice, setUserChoice] = useState(null);
  // Define whether the user has completed step 4
  const [stepFourCompleted, setStepFourCompleted] = useState(false);
  // Define whether the user has completed step 3
  const [stepThreeCompleted, setStepThreeCompleted] = useState(false);
  // Define whether the user has taken the conch shell
  const [conchTaken, setConchTaken] = useState(false);
  // Define the current overlay, starting at null
  const [currentOverlay, setCurrentOverlay] = useState(null);
  // Define whether the overlay is visible
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  // Track the last direction the user moved
  const [lastDirection, setLastDirection] = useState(null);
  // Track the number of repetitive moves
  const [repetitiveMoves, setRepetitiveMoves] = useState(0);
  // Define the dynamic scene and whether it is visible
  const [dynamicSceneVisible, setDynamicSceneVisible] = useState(false);
  // track the current dynamic scene
  const [currentDynamicSceneKey, setCurrentDynamicSceneKey] = useState(null);

  // Define the choices for step 3

  const [choices, setChoices] = useState([
    { label: "Greet the Siren.", value: 1 },
    { label: "Attack the Siren!", value: 2 },
    { label: "Take the Conch Shell.", value: 3 },
  ]);

  const dynamicSceneData = {
    pickUpConch: {
      text: "What a glorious feeling! For a flash, you feel an electric pulse of pleasure ripple up your arm and into your brain, after which you have a momentary vision of a magical door opening and spilling a radiant white light out into the void of space. The image subsides, but its memory lingers.",
      imageSrc: DoorVision,
      imageAlt: "A magical door opening into a brilliant white light.",
    },
    listenToConch: {
      text: "What happens when you listen to the conch.",
      imageSrc: "path/to/image2.png",
      imageAlt: "Image 2",
    },
    sirenGreetNoConch: {
      text: "The Siren smiles and nods her head in the direction of the conch shell. You feel a strange compulsion to pick it up.",
      imageSrc: Conch,
      imageAlt: "A mystifyingly beautiful conch shell.",
    },
    sirenGreetWithConch: {
      text: "The Siren speaks in a tongue you still cannot understand. With a smile and a wave of an arm, she gestures that you explore her beach paradise.",
      imageSrc: Sundial,
      imageAlt: "An elaborate sundial protruding from the shore.",
    },
    soldierBlock: {
      text: "As if materializing from thin air, two of the Sirens soldiers block your path. The one to your right stares you in the eye and you hear his watery voice in your head say, 'You shall not pass until your business with our queen is finished.'",
      imageSrc: SoldierBlock,
      imageAlt: "Intimidating image of the merman soldiers blocking your path.",
    },
    // ... other scenarios
  };

  // Handle keydown events

  const handleKeyDown = (event) => {
    // conditions to prevent back and continue from working
    // An overlay is visible
    if (showHelp || showLifeLost || showInventory || isOverlayVisible) return;

    // Multiple choice section is not complete
    if (currentStep === 3 && !stepThreeCompleted && !isOverlayVisible) return;

    if (isOverlayVisible === true) return;
    // Allows key listener for arrows but not c and b during step 4
    if (
      (event.key.toLowerCase() === "c" || event.key.toLowerCase() === "b") &&
      currentStep === 4 &&
      !stepFourCompleted
    ) {
      return;
    }
    // Handle keydown events for exploration

    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      if (lastDirection === event.key) {
        setRepetitiveMoves(repetitiveMoves + 1);
      } else {
        setRepetitiveMoves(0);
        setLastDirection(event.key);
      }
      handleExplore(event.key);
    }

    // Handle keydown events for Continue and Back

    const key = event.key.toLowerCase();
    if (
      key === "c" &&
      currentStep < totalSteps - 1 &&
      (currentStep !== 3 || stepThreeCompleted)
    ) {
      setCurrentStep(currentStep + 1);
    } else if (key === "b" && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle multiple choice selection

  const handleChoiceSelect = (choice) => {
    setUserChoice(choice);
    switch (choice.value) {
      case 1:
        if (!conchTaken) {
          setIsOverlayVisible(true);
          setCurrentOverlay("sirenGreetNoConch");
        } else {
          setIsOverlayVisible(true);
          setCurrentOverlay("sirenGreetWithConch");
        }
        break;
      case 2:
        setShowLifeLost(true);
        loseLife("sirenAttack");
        break;
      case 3:
        // makes the conch option disappear
        setConchTaken(true);
        obtainConch();
        // setIsOverlayVisible(true);
        // Sets overlay to pickUpConch
        // setCurrentOverlay('pickUpConch');
        setChoices([
          { label: "Greet the Siren.", value: 1 },
          { label: "Attack the Siren!", value: 2 },
          { label: "Explore.", value: 4 },
        ]);
        setCurrentDynamicSceneKey("pickUpConch");
        setShowDynamicScene(true);

        // update mulitiple choice buttons

        break;
      case 4:
        setStepThreeCompleted(true);
        setCurrentStep(4);
        break;
      default:
        setCurrentStep(1);
    }
  };

  // Handle exploration

  const handleExplore = (direction) => {
    if (repetitiveMoves > 2) {
      setIsOverlayVisible(true);
      setCurrentOverlay("SoldierBlock");
    } else if (repetitiveMoves > 3) {
      setShowLifeLost(true);
      loseLife("ignoreSoldiers");
    }
    switch (direction) {
      case "ArrowUp":
        console.log("up");
        break;
      case "ArrowDown":
        break;
      case "ArrowLeft":
        break;
      case "ArrowRight":
        break;
      default:
        setCurrentStep(1);
    }
  };

  // Reset steps on all lives lost

  useEffect(() => {
    if (resetSignal) {
      setCurrentStep(0);
    }
  }, [resetSignal]);

  // Keydown listener and dependency array

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    currentStep,
    showHelp,
    stepThreeCompleted,
    showLifeLost,
    isOverlayVisible,
    currentOverlay,
    stepFourCompleted,
    lastDirection,
    repetitiveMoves,
    dynamicSceneVisible,
    currentDynamicSceneKey,
    conchTaken,
  ]);

  return (
    <div id="ChapterOnePage" className="widthControl">
      {currentStep === 0 && (
        <h2 id="headLine">Chapter One: The Siren In The Cove</h2>
      )}
      {currentStep === 0 && (
        <div>
          <h3>Press C to continue</h3>
          <h4>You can also press H at anytime for help</h4>
          <img id="trident" src={trident} alt="A beautiful shimering trident" />
        </div>
      )}
      {currentStep === 1 && (
        <div>
          <p>
            You are standing on the beach of a foggy cove. Ten feet out from
            shore, a beautiful siren sits on a protruding rock. She smiles and
            her lips move as if singing. Strangely, you hear nothing but the
            waves lapping at your feet.
          </p>
          <div className="imageCropper environImage">
            <img
              className="environImage"
              src={sirenCove}
              alt="Siren on a rock, in a cove."
              width="500"
              height="250"
            ></img>
          </div>
          <p className="boldText">C to continue.</p>
          {/* <p className="boldText">B for back.</p> */}
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <p>
            As you struggle to understand the Siren’s song, a conch shell washes
            up on the beach.
          </p>
          <p></p>
          <img
            className="environImage"
            src={ConchShore}
            alt="Siren on a rock, in a cove."
            width="500"
            height="500"
          ></img>
        </div>
      )}
      {currentStep === 3 && (
        <div>
          <h3>Choose wisely.</h3>
          {!conchTaken && (
            <img
              className="conchItem"
              src={Conch}
              alt="A mystifyingly beautiful conch shell."
              width="260"
              height="250"
            />
          )}
          {conchTaken && (
            <img
              className="environImage"
              src={ConchInSatchel}
              alt="The conch inside of a satchel beside a pistol."
            />
          )}
          {dynamicSceneVisible && currentDynamicSceneKey && (
            <div className="dynamicSceneContent">
              <p>{dynamicSceneData[currentDynamicSceneKey].text}</p>
              <img
                src={dynamicSceneData[currentDynamicSceneKey].imageSrc}
                alt={dynamicSceneData[currentDynamicSceneKey].imageAlt}
                className="dynamicSceneImage"
              />
            </div>
          )}
          <MultipleChoiceButtons
            choices={choices}
            onChoiceSelect={handleChoiceSelect}
          />
        </div>
      )}

      {currentStep === 4 && (
        <div>
          <p>
            The Siren and her soldiers appear to have become bored by your
            presence. Now's your chance to explore the cove. Use your keyboard
            arrow keys and have a look around.
          </p>
          <img
            className="environImage"
            src={Sundial}
            alt="A sundial protruding from the shore."
            width="500"
            height="500"
          ></img>
        </div>
      )}
    </div>
  );
}

export default ChapterOne;
