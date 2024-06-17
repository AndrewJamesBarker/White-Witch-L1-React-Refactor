import React, { useState, useEffect } from "react";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";
import MultipleChoiceButtons from "../ui/MultipleChoiceButtons";
import ConchDrag from "../dragAndDrop/ChapterOneDrag/ConchDrag";
import AudioPlayer from "../ui/AudioPlayer";
import IntroductionSynopsis from "../pages/IntroductionSynopsis";
import Register from "../pages/Register";
import { useAuth } from '../../context/AuthContext';


// Images
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
import SirenPortrait from "../../assets/images/portraits/Siren-Portrait.png";
import WhiteWitchPearl from "../../assets/images/portraits/white-white-in-pearl.png";
import DirectionalKeys from "../../assets/images/ui-elements/directional-keys.png";


// Music
import Listen from "../../assets/audio/listen.mp3";
import deniseSirenVocal from "../../assets/audio/deniseSirenVocal.mp3";
import Dashboard from "../pages/Dashboard";

function ChapterOne({
  currentChapter,
  setCurrentChaper,
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
  livesLeft,
  resetSignal,
  showHelp,
  showInventory,
  obtainConch,
  hasConch,
  setHasConch,
  showCrystal,
  currentScene,
  setCurrentScene,
}) {
  // Define the total number of steps in ChapterOne
  const totalSteps = 8; 
  // Define whether the user has completed the introduction
  const [isIntroComplete, setIsIntroComplete] = useState(false);
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
  // allow directional event listening to be active or not
  const [allowDirectionChange, setAllowDirectionChange] = useState(true);

  // On/Off switch for explore scenes
  const [neutralExploreScene, setNeutralExploreScene] = useState(true);
  const [northScene, setNorthScene] = useState(false);
  const [southScene, setSouthScene] = useState(false);
  const [eastScene, setEastScene] = useState(false);
  const [westScene, setWestScene] = useState(false);
  // State for conch drag and drop success
  const [conchListened, setConchListened] = useState(false);
  // Drag and drop items
  const items = ["Conch"];
  // Update items in db with hook


  const { isAuthenticated } = useAuth();

  const handleDragEnd = (event) => {
    // set the conch as listened to true on drag end
    setConchListened(true);
    // nextStep();
  };

  // Define the choices for step 3
  const [choices, setChoices] = useState([
    { label: "Greet the Siren.", value: 1 },
    { label: "Attack the Siren!", value: 2 },
    { label: "Take the Conch Shell.", value: 3 },
  ]);

  // Update the choices for step 3 depending on whether the conch has been taken
  const updateChoices = () => {
    if (hasConch) {
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
      imageCSS: "imageMaterialize environImage padding-all-1",
      textCSS: "standardText",
      buttonText: "Continue",
    },
    sirenGreetNoConch: {
      text: "The Siren smiles and nods her head in the direction of the conch shell. You feel a strange compulsion to pick it up.",
      imageSrc: Conch,
      imageAlt: "A mystifyingly beautiful conch shell.",
      imageCSS: "imageMaterialize environImage padding-all-1",
      textCSS: "standardText",
      buttonText: "Continue",
    },
    sirenGreetWithConch: {
      text: "The Siren speaks in a tongue you still cannot understand. With a smile and a wave of an arm, she gestures that you explore her beach paradise.",
      imageSrc: Sundial,
      imageAlt: "An elaborate sundial protruding from the shore.",
      imageCSS: "environImage padding-all-1",
      textCSS: "standardText",
      buttonText: "Continue",
    },
    soldierBlock: {
      text: "Two of the Sirens soldiers block your path as if materializing from thin air. The soldier on your left stares you in the eye, and from within in your head, you hear his watery voice say, 'You shall not pass until your business with our queen is finished!'",
      imageSrc: SoldierBlock,
      imageAlt: "Intimidating image of the merman soldiers blocking your path.",
      imageCSS: "imageMaterialize environImage padding-all-1",
      textCSS: "standardText",
      buttonText: "Go Back",
    },
  };

  // Handle keydown events

  const handleKeyDown = (event) => {
    // console.log(`Key pressed: ${event.key}`);
    
    // conditions to prevent back and continue from working
    // An overlay is visible
    if (showHelp || showLifeLost || showInventory) return;
    // Intro is not complete and user presses 'c'
    if (currentStep === 0 && !isIntroComplete && event.key === "c") {
      setIsIntroComplete(true);
      return;
    }

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
    // Remove ability to go back to previous step after step 4
    if (event.key.toLowerCase() === "b" && currentStep > 4) {
      return;
    }

    if (event.key.toLowerCase() === "c" && currentStep === 5) {
      return;
    }
    // Handle keydown events for exploration

    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key) &&
      currentStep > 4
    ) {
      return;
    }

    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key) &&
      currentStep === 4
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
       // C and B Temp disabled during multiple choice section
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
    else if (currentStep === 6) {
      nextStep();
    }
    else if (key === 'c' && currentStep === totalSteps - 1) {
      nextStep();
    }
    

  };

  // Handle multiple choice selection

  const handleChoiceSelect = (choice) => {
    setUserChoice(choice);
    switch (choice.value) {
      case 1:
        if (!hasConch) {
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
        setHasConch(true);
        // for inventory
        obtainConch();
        // show pick up conch scene
        setDynamicSceneVisible(true);
        setCurrentDynamicSceneKey("pickUpConch");
        break;
      case 4:
        setStepThreeCompleted(true);
        setCurrentStep(4);
        setCurrentScene("neutral");
        break;
      default:
        setCurrentStep(1);
    }
  };

  // Handle dynamic scene close
  const handleDynamicSceneClose = () => {
    setDynamicSceneVisible(false);
    // allow directional tracking to resume
    resetExplorationState();
    // Re-enable direction change when dynamic scene is closed
    setAllowDirectionChange(true);
  };

  // Handle exploration

  const resetExplorationState = () => {
    setRepetitiveMoves(0);
    setLastDirection(null);
  };

  // Update repetitive moves
  const updateRepetitiveMoves = (direction) => {
    if (lastDirection === direction) {
      const newRepetitiveMoves = repetitiveMoves + 1;
      setRepetitiveMoves(newRepetitiveMoves);

      if (newRepetitiveMoves === 2) {
        setDynamicSceneVisible(true);
        setCurrentDynamicSceneKey("soldierBlock");
      }
    } else {
      setRepetitiveMoves(1);
      setLastDirection(direction);
    }
  };

  // Handle exploration moves
  const handleExplore = (direction) => {
    // Check if in soldierBlock scene and direction change is not allowed
    if (
      dynamicSceneVisible &&
      currentDynamicSceneKey === "soldierBlock" &&
      !allowDirectionChange
    ) {
      if (direction === lastDirection) {
        setShowLifeLost(true);
        loseLife("ignoreSoldiers");
      } else {
        setDynamicSceneVisible(false);
        setAllowDirectionChange(true);
      }
      return; // Important to return here to stop further processing
    }

    // If the direction has changed or this is the first move
    if (lastDirection !== direction || repetitiveMoves === 0) {
      setRepetitiveMoves(1);
      setLastDirection(direction);
    } else {
      // Increment repetitive moves
      const newRepetitiveMoves = repetitiveMoves + 1;
      setRepetitiveMoves(newRepetitiveMoves);

      // Check if it's time to move to step 5
      if (
        !stepFourCompleted &&
        direction === "ArrowLeft" &&
        newRepetitiveMoves === 2
      ) {
        setStepFourCompleted(true);
        setCurrentStep(5);
        return; // Stop further processing
      }

      // Check for soldier block scene
      if (newRepetitiveMoves === 2) {
        setDynamicSceneVisible(true);
        setCurrentDynamicSceneKey("soldierBlock");
        setAllowDirectionChange(false);
      }
    }

    // Update the current scene
    setCurrentScene(
      direction === "ArrowUp"
        ? "north"
        : direction === "ArrowDown"
        ? "south"
        : direction === "ArrowLeft"
        ? "west"
        : direction === "ArrowRight"
        ? "east"
        : "neutral"
    );
  };

  const renderScene = () => {
    switch (currentScene) {
      case "neutral":
        return (
          <div>
            <p className="standardText">
              The Siren and her soldiers appear to have become bored by your
              presence. Now's your chance to explore the cove. Use your keyboard{" "}
              <span className="boldText">'Arrow Keys'</span> and have a look
              around.
              <img
                className="directionalArrows"
                src={DirectionalKeys}
                alt="keyboard directional arrows"
                width="45"
                height="35"
              ></img>
            </p>

            <img
              className="environImage"
              src={Sundial}
              alt="A sundial protruding from the shore."
              width="500"
              height="500"
            ></img>
          </div>
        );
      case "north":
        return (
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
              <button
                id="lifeCrystalButton"
                onClick={() =>
                  gainLife(livesLeft === 3 ? "livesFullCrystal" : "findCrystal")
                }
              >
                <img
                  className="objectPulse"
                  src={LifeCrystal}
                  alt="A beuatiful rotating and pulsating orb of light"
                  width="100"
                  height="100"
                ></img>
              </button>
            )}
          </div>
        );
      case "south":
        return (
          <div>
            <img
              className="environImage"
              src={BlackToothMountainSouth}
              alt="The siren and her soldiers onlooking a mountiain on the shore resembling a mounstrous head with its chaws wide open. "
              width="500"
              height="500"
            ></img>
            <p className="standardText">
              To the south, an immense cape extends into the sea, its form
              merging into the shadow of a massive mountain. The mountain's side
              is marked by a gnarly demonic face intricately carved into its
              facade. Atop, perched like a crown on the mountain's brow, sits
              what appears to be a castle. This is the place known to some as
              Black Tooth Mountain, the fortress of the King of the Zealots and
              leader of the Dark Triad, Therionarch. A shiver runs up your
              spine. The Siren and her soldiers watch you carefully.
            </p>
          </div>
        );
      case "east":
        return (
          <div>
            <img
              className="environImage"
              src={Marsh}
              alt="A labyrinthine marshland vista."
              width="500"
              height="500"
            ></img>
            <p className="standardText">
              To the east lies a vast, wet marsh stretching out for miles. It is
              dense with reeds and waterlogged plants, creating a labyrinth of
              natural waterways and muddy banks. Far in the distance, just at
              the edge of this expansive wetland, the silhouette of buildings or
              settlements appears. The Siren and her soldiers keep a close eye
              on you.
            </p>
          </div>
        );
      case "west":
        return (
          <div>
            <img
              className="environImage"
              src={SirenPortrait}
              alt="The Sirens beautiful face."
              width="500"
              height="500"
            ></img>
            <p className="standardText">
              Like the sirens in the stories of old, the Sirens beauty bids you
              closer (west). Perhaps you should continue exploring, if you
              havent already done so.
            </p>
          </div>
        );
      default:
        return (
          <div>
            <p className="standardText">
              Use your keyboard <span className="boldText">'Arrow Keys'</span>{" "}
              and have a look around.
            </p>
            <img
              className="environImage"
              src={Sundial}
              alt="A sundial protruding from the shore."
              width="500"
              height="500"
            ></img>
          </div>
        ); // Should never happen
    }
  };

  // Reset steps on all lives lost

  useEffect(() => {
    if (resetSignal) {
      setCurrentStep(0);
    }
  }, [resetSignal]);

  // useEffect to track current step and trigger chapter completion
  useEffect(() => {
    if (currentStep === 8) {
      onComplete(); // Call onComplete when chapter is completed
    }
  }, [currentStep]);
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
    hasConch,
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    isIntroComplete,
    totalSteps
  ]);

  // Update choices for multiple choice section when conch is taken
  useEffect(() => {
    updateChoices();
  }, [hasConch]);

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
          <button className="margin-btm-1" onClick={handleDynamicSceneClose}>
            {dynamicSceneData[currentDynamicSceneKey].buttonText}
          </button>
        </div>
      ) : (
        <>
          {currentStep === 0 && !isIntroComplete ? (
            <IntroductionSynopsis />
          ) : currentStep === 0 && isIntroComplete ? (
            <div>
              <h2 id="headLine">
                Chapter One:{" "}
                <span className="blueText">The Siren In The Cove</span>
              </h2>
              <h3>
                Press <span className="blueText">C</span> to continue.
                You can also press<span className="blueText"> H</span> at
                anytime for help
              </h3>
              <img
                id="trident"
                src={trident}
                alt="A beautiful shimmering trident"
              />
            </div>
          ) : null}
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
              <p className="boldText blueText">C to continue.</p>
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
              <p className="standardText blueText">Press C to continue</p>
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <h3>Choose wisely.</h3>
              {!hasConch && (
                <img
                  className="conchItem"
                  src={Conch}
                  alt="A mystifyingly beautiful conch shell."
                  width="260"
                  height="250"
                />
              )}
              {hasConch && (
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
          {currentStep === 4 && renderScene()}
          {currentStep === 5 && (
            <div>
              <p className="standardText">
                As you approach her, the Siren flashes you a razor tooth smile
                and appears to speak, though you still cannot hear her voice. Is
                the ocean getting louder, or is that sound coming from the
                Conch?
              </p>
              <ConchDrag
                onDragComplete={() => {
                  setConchListened(true);
                  nextStep();
                }}
              />
              <p className="standardText">
                Remember, you can press{" "}
                <strong className="blueText">'H'</strong> at any time for help.
              </p>
              <AudioPlayer
                src={Listen}
                autoplay={true}
                alt="Audio of a creepy voice repeating the word 'listen'"
              />
            </div>
          )}
          {conchListened && currentStep === 6 && (
            <>
              <p className="standardText">
                Oooouch!! Something slithers down your ear canal, tears through
                your eardrum, and nestles into your cochlea. Overcome with some
                strange euphoria, you hear a beautiful voice singing:
              </p>
              <AudioPlayer
                src={deniseSirenVocal}
                autoplay={true}
                alt="A sweet voice singing over the ocean 'I grew up insid of it, I grew up in the light of it."
              />
              <p className="standardText blueText">Press C to continue</p>
              <p className="boldText">'I grew up inside of it,</p>
              <p className="boldText">I grew up in the light of it.'</p>
              
            </>
          )}
          {currentStep === 7 && (
            <>
              <p className="standardText">
                The Siren speaks, and thanks to the creature now living in your ear, her previously indecipherable squeaking transforms into a melodious voice: “You are brave, and it is noble of you to seek help for your people in this dark age… but if you are to succeed, you will need powers beyond your means. Head east, go to the Cave of Mirrors, retrieve the Pearl Of The Moon, and free my sister, The White Witch. Only she can match the evil that is afoot. Take heed that your mirrored reflection may have more substance than you know. The pearl is a crystal ball that allows access to the door of the future, yet it also holds another powerful secret: Use it wisely, or be consumed by its power."
              </p>
              <img className="paddingMarginReset standardImage"
                alt="faint image of the white witches face within a magical orb" 
                src={WhiteWitchPearl}
              ></img>
              <p className="standardText blueText">Press C to continue</p>
            </>
          )}
          {currentStep === 8 && ( // This is the end of the chapter
          <>  
            {isAuthenticated ? (
              <Dashboard />
            ) : (  
              <Register />
            )}  
          </>
           
          )}
        </>
      )}
    </div>
  );
}

export default ChapterOne;
