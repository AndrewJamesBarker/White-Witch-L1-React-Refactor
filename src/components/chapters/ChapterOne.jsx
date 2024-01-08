import React, { useState, useEffect } from "react";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";
import MultipleChoiceButtons from "../ui/MultipleChoiceButtons";

import trident from "../../assets/images/environment/trident.png";
import sirenCove from "../../assets/images/environment/Siren-NoConch.png";
import ConchShore from "../../assets/images/environment/Conch-Shore.png";
import Conch from "../../assets/images/inventory-items/Conch-Good.png";
import LifeCrystal from "../../assets/images/ui-elements/LifeCrystal.svg";
import DoorVision from "../../assets/images/environment/PortholeDoorVision.png";
import ConchInSatchel from "../../assets/images/environment/Conch-In-Satchel.png";
import Sundial from "../../assets/images/environment/Sundial.png";
import SoldierBlock from "../../assets/images/environment/SoldierBlock.png";
import PastelMountains from "../../assets/images/environment/PastelMountains1.png";
import BlackToothMountainSouth from "../../assets/images/environment/BlackToothMountainSouth.png";
import Marsh from "../../assets/images/environment/Marsh1.png";

function ChapterOne({
  currentStep,
  setCurrentStep,
  nextStep,
  previousStep,
  onComplete,
  loseLife,
  gainLife,
  setShowLifeLost,
  showLifeLost,
  showLifeGain,
  setShowLifeGain,
  livesLeft,
  resetSignal,
  showHelp,
  showInventory,
  obtainConch,
  conchTaken,
  setConchTaken,
  showCrystal,
}) {
  // Define the total number of steps in ChapterOne
  const totalSteps = 6;

  // Define the user's choice, starting at null
  const [userChoice, setUserChoice] = useState(null);
  // Define whether the user has completed step 4
  const [stepFourCompleted, setStepFourCompleted] = useState(false);
  // Define whether the user has completed step 3
  const [stepThreeCompleted, setStepThreeCompleted] = useState(false);
  // Track the last direction the user moved
  const [lastDirection, setLastDirection] = useState(null);
  // Track the number of repetitive moves
  const [repetitiveMoves, setRepetitiveMoves] = useState(0);
  // Define the dynamic scene and whether it is visible
  const [dynamicSceneVisible, setDynamicSceneVisible] = useState(false);
  // track the current dynamic scene
  const [currentDynamicSceneKey, setCurrentDynamicSceneKey] = useState(null);

  // On/Off switch for explore scenes
  const [nuetralExploreScene, setNuetralExploreScene] = useState(true);
  const [northScene, setNorthScene] = useState(false);
  const [southScene, setSouthScene] = useState(false);
  const [eastScene, setEastScene] = useState(false);
  const [westScene, setWestScene] = useState(false);

  // Define the choices for step 3
  const [choices, setChoices] = useState([
    { label: "Greet the Siren.", value: 1 },
    { label: "Attack the Siren!", value: 2 },
    { label: "Take the Conch Shell.", value: 3 },
  ]);

  // Update the choices for step 3 depending on whether the conch has been taken
  const updateChoices = () => {
    if (conchTaken) {
      setChoices([
        { label: "Greet the Siren.", value: 1 },
        { label: "Attack the Siren!", value: 2 },
        { label: "Explore.", value: 4 },
      ]);
    } else {
      setChoices([
        { label: "Greet the Siren.", value: 1 },
        { label: "Attack the Siren!", value: 2 },
        { label: "Take the Conch Shell.", value: 3 },
      ]);
    }
  };

  const dynamicSceneData = {
    pickUpConch: {
      text: "What a glorious feeling! For a flash, you feel an electric pulse of pleasure ripple up your arm and into your brain, after which you have a momentary vision of a magical door opening and spilling a radiant white light out into the void of space. The image subsides, but the sensation lingers.",
      imageSrc: DoorVision,
      imageAlt: "A magical door opening into a brilliant white light.",
      imageCSS: "imageMaterialize environImage",
      textCSS: "standardText",
      buttonText: "Continue",
    },
    listenToConch: {
      text: "What happens when you listen to the conch.",
      imageSrc: "path/to/image2.png",
      imageAlt: "Image 2",
      imageCSS: "imageMaterialize environImage",
      textCSS: "standardText",
      buttonText: "Continue",
    },
    sirenGreetNoConch: {
      text: "The Siren smiles and nods her head in the direction of the conch shell. You feel a strange compulsion to pick it up.",
      imageSrc: Conch,
      imageAlt: "A mystifyingly beautiful conch shell.",
      imageCSS: "imageMaterialize environImage",
      textCSS: "standardText",
      buttonText: "Continue",
    },
    sirenGreetWithConch: {
      text: "The Siren speaks in a tongue you still cannot understand. With a smile and a wave of an arm, she gestures that you explore her beach paradise.",
      imageSrc: Sundial,
      imageAlt: "An elaborate sundial protruding from the shore.",
      imageCSS: "environImage",
      textCSS: "standardText",
      buttonText: "Continue",
    },
    soldierBlock: {
      text: "Two of the Sirens soldiers block your path as if materializing from thin air. The soldier on your left stares you in the eye, and from within in your head, you hear his watery voice say, 'You shall not pass until your business with our queen is finished.'",
      imageSrc: SoldierBlock,
      imageAlt: "Intimidating image of the merman soldiers blocking your path.",
      imageCSS: "imageMaterialize environImage",
      textCSS: "standardText",
      buttonText: "Go Back",
    },
  };

  // Handle keydown events

  const handleKeyDown = (event) => {
    // conditions to prevent back and continue from working
    // An overlay is visible
    if (showHelp || showLifeLost || showInventory) return;

    // Multiple choice section is not complete
    if (currentStep === 3 && !stepThreeCompleted) return;

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
      nextStep(); // Use nextStep function passed from Game component
    }
    // Check for 'b' key to go back to the previous step
    else if (key === "b" && currentStep > 0) {
      previousStep(); // Use previousStep function passed from Game component
    }
  };

  // Handle multiple choice selection

  const handleChoiceSelect = (choice) => {
    setUserChoice(choice);
    switch (choice.value) {
      case 1:
        if (!conchTaken) {
          setDynamicSceneVisible(true);
          setCurrentDynamicSceneKey("sirenGreetNoConch");
        } else {
          setDynamicSceneVisible(true);
          setCurrentDynamicSceneKey("sirenGreetWithConch");
        }
        break;
      case 2:
        setShowLifeLost(true);
        loseLife("sirenAttack");
        break;
      case 3:
        // makes the conch option disappear
        setConchTaken(true);
        // for inventory
        obtainConch();
        // show pick up conch scene
        setDynamicSceneVisible(true);
        setCurrentDynamicSceneKey("pickUpConch");
        break;
      case 4:
        setStepThreeCompleted(true);
        setCurrentStep(4);
        break;
      default:
        setCurrentStep(1);
    }
  };

  const handleDynamicSceneClose = () => {
    setDynamicSceneVisible(false);
    resetExplorationState(); // Reset the exploration state
  };

  // Handle exploration

  const resetExplorationState = () => {
    setRepetitiveMoves(0);
    setLastDirection(null);
  };

  const handleExplore = (direction) => {
    if (lastDirection === direction) {
      setRepetitiveMoves(repetitiveMoves + 1);
    } else {
      setRepetitiveMoves(1); // reset to 1 for the first move in a new direction
      setLastDirection(direction); // update lastDirection with the new direction
    }

    if (repetitiveMoves === 2) {
      // Warning threshold
      setDynamicSceneVisible(true);
      setCurrentDynamicSceneKey("soldierBlock");
    }
    else if (repetitiveMoves > 2) {
      // Death threshold
      setShowLifeLost(true);
      loseLife("ignoreSoldiers");
      setRepetitiveMoves(0); // reset after death
    }
    switch (direction) {
      case "ArrowUp":
        setNuetralExploreScene(false);
        setSouthScene(false);
        setEastScene(false);
        setWestScene(false);
        setNorthScene(true);
        break;
      case "ArrowDown":
        setNuetralExploreScene(false);
        setNorthScene(false);
        setEastScene(false);
        setWestScene(false);
        setSouthScene(true);
        break;
      case "ArrowLeft":
        setNuetralExploreScene(false);
        setNorthScene(false);
        setSouthScene(false);
        setEastScene(false);
        setWestScene(true);
        break;
      case "ArrowRight":
        setNuetralExploreScene(false);
        setNorthScene(false);
        setSouthScene(false);
        setWestScene(false);
        setEastScene(true);
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
    showHelp,
    stepThreeCompleted,
    showLifeLost,
    showLifeGain,
    stepFourCompleted,
    lastDirection,
    repetitiveMoves,
    dynamicSceneVisible,
    currentDynamicSceneKey,
    conchTaken,
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
  ]);

  // Update choices for multiple choice section when conch is taken
  useEffect(() => {
    updateChoices();
  }, [conchTaken]);

  return (
    <div id="ChapterOnePage" className="widthControl">
      {dynamicSceneVisible && currentDynamicSceneKey ? (
        // Render only the dynamic scene content
        <div className="dynamicScenes">
          <img
            src={dynamicSceneData[currentDynamicSceneKey].imageSrc}
            alt={dynamicSceneData[currentDynamicSceneKey].imageAlt}
            className={dynamicSceneData[currentDynamicSceneKey].imageCSS}
          />
          <p className="standardText">
            {dynamicSceneData[currentDynamicSceneKey].text}
          </p>
          <button onClick={handleDynamicSceneClose}>
            {dynamicSceneData[currentDynamicSceneKey].buttonText}
          </button>
        </div>
      ) : (
        <>
          {currentStep === 0 && (
            <h2 id="headLine">Chapter One: The Siren In The Cove</h2>
          )}
          {currentStep === 0 && (
            <div>
              <h3>Press C to continue</h3>
              <h4>You can also press H at anytime for help</h4>
              <img
                id="trident"
                src={trident}
                alt="A beautiful shimering trident"
              />
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <p className="standardText">
                You are standing on the beach of a foggy cove. Ten feet out from
                shore, a beautiful siren sits on a protruding rock. She smiles
                and her lips move as if singing. Strangely, you hear nothing but
                the waves lapping at your feet.
              </p>
              <div className="imageCropper">
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
              <p className="standardText">
                As you struggle to understand the Siren’s song, a conch shell
                washes up on the beach.
              </p>
              <p></p>
              <img
                className="environImage imageMaterialize"
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
              <MultipleChoiceButtons
                choices={choices}
                onChoiceSelect={handleChoiceSelect}
              />
            </div>
          )}

          {currentStep === 4 && (
            <>
              {nuetralExploreScene && (
                <div>
                  <p className="standardText">
                    The Siren and her soldiers appear to have become bored by
                    your presence. Now's your chance to explore the cove. Use
                    your keyboard <span className="boldText">'Arrow Keys'</span> and have a look around.
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
              {northScene && (
                <div>
                  <img
                    className="environImage"
                    src={PastelMountains}
                    alt="A mystical range of pastel mountains."
                    width="500"
                    height="500"
                  ></img>
                  <p className="standardText">
                    To your north, you see a mystical range of pastel mountains,
                    something of a mirage. The Siren and her soldiers watch you
                    carefully.
                  </p>
                  {showCrystal && (
                     <button id="lifeCrystalButton" onClick={() => gainLife(livesLeft === 3 ? 'livesFullCrystal' : 'findCrystal')}>
                     <img className="lifeCrystal" src={LifeCrystal} alt="A beuatiful rotating and pulsating orb of light" width="100" height="100"></img>
                   </button>
                  )}  
                </div>
              )}
              {southScene && (
                <div>
                  <img
                    className="environImage"
                    src={BlackToothMountainSouth}
                    alt="The siren and her soldiers onlooking a mountiain on the shore resembling a mounstrous head with its chaws wide open. "
                    width="500"
                    height="500"
                  ></img>
                  <p className="standardText">
                  To the south, an immense cape extends into the sea, its form merging into the shadow of a massive mountain. The mountain's side is marked by a gnarly demonic face intricately carved into its facade. Atop, perched like a crown on the mountain's brow, sits what appears to be a castle. This is the place known to some as Black Tooth Mountain, the fortress of the King of the Zealots and leader of the Dark Triad, Therionarch. A shiver runs up your spine. The Siren and her soldiers watch you carefully.
                  </p>
                </div>
              )}
              {eastScene && (
                <div>
                  <img
                    className="environImage"
                    src={Marsh}
                    alt="A labyrinthine marshland vista."
                    width="500"
                    height="500"
                  ></img>
                  <p className="standardText">
                    To the east lies a vast, wet marsh stretching out for miles. It is dense with reeds and waterlogged plants, creating a labyrinth of natural waterways and muddy banks—this sprawling marshland pulses with the quiet energy of some subtle and possibly dangerous magic. Far in the distance, just at the edge of this expansive wetland, the silhouette of structures, perhaps buildings or settlements, appears. The Siren and her soldiers keep a close eye on you.
                  </p>
                </div>
              )}
              {westScene && (
                <div>
                  <p className="standardText">
                    To your west, the Siren flashes a razor tooth smile and tries to communicate with you again. Is there a ringing in your ears?
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
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ChapterOne;
