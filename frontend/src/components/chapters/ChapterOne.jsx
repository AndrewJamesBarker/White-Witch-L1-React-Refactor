import React, { useState, useEffect } from "react";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";
import MultipleChoiceButtons from "../ui/MultipleChoiceButtons";
import ConchDrag from "../dragAndDrop/ChapterOneDrag/ConchDrag";
import AudioPlayer from "../ui/AudioPlayer";
import IntroductionSynopsis from "../pages/IntroductionSynopsis";
import Register from "../pages/Register";
import { useAuth } from '../../context/AuthContext';
import { useGameState } from "../../context/GameStateContext";
import { useNavigate } from "react-router-dom";
// import GlassCard from "../atomic/molecules/GlassCard";

// Images
import trident from "../../assets/images/environment/trident.png";
import sirenCove from "../../assets/images/environment/Siren-NoConch.webp";
import ConchShore from "../../assets/images/environment/Conch-Shore.webp";
import Conch from "../../assets/images/inventory-items/Conch-Good.webp";
import LifeCrystal from "../../assets/images/ui-elements/LifeCrystal.svg";
import DoorVision from "../../assets/images/environment/PortholeDoorVision.webp";
import ConchInSatchel from "../../assets/images/environment/Conch-In-Satchel.webp";
import Sundial from "../../assets/images/environment/Sundial.webp";
import SoldierBlock from "../../assets/images/environment/SoldierBlock.webp";
import PastelMountains from "../../assets/images/environment/PastelMountains1.webp";
import BlackToothMountainSouth from "../../assets/images/environment/BlackToothMountainSouth.webp";
import Marsh from "../../assets/images/environment/Marsh1.webp";
import SirenPortrait from "../../assets/images/portraits/Siren-Portrait.webp";
import WhiteWitchPearl from "../../assets/images/portraits/white-white-in-pearl.webp";
import DirectionalKeys from "../../assets/images/ui-elements/directional-keys.webp";

// Music
import Listen from "../../assets/audio/listen.mp3";
import deniseSirenVocal from "../../assets/audio/deniseSirenVocal.mp3";

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
  resetSignal,
  showHelp,
  showInventory,
  obtainItem,
  showCrystal,
  currentScene,
  setCurrentScene,
}) {
  const {
    currentChapter,
    setCurrentChapter,
    livesLeft,
    hasConch,
  } = useGameState();

  const { isAuthenticated } = useAuth();

  const totalSteps = 8;
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [userChoice, setUserChoice] = useState(null);
  const [stepFourCompleted, setStepFourCompleted] = useState(false);
  const [stepThreeCompleted, setStepThreeCompleted] = useState(false);
  const [lastDirection, setLastDirection] = useState(null);
  const [repetitiveMoves, setRepetitiveMoves] = useState(0);
  const [dynamicSceneVisible, setDynamicSceneVisible] = useState(false);
  const [currentDynamicSceneKey, setCurrentDynamicSceneKey] = useState(null);
  const [allowDirectionChange, setAllowDirectionChange] = useState(true);
  const [neutralExploreScene, setNeutralExploreScene] = useState(true);
  const [northScene, setNorthScene] = useState(false);
  const [southScene, setSouthScene] = useState(false);
  const [eastScene, setEastScene] = useState(false);
  const [westScene, setWestScene] = useState(false);
  const [conchListened, setConchListened] = useState(false);
  const [chapterComplete, setChapterComplete] = useState(false); 
  const navigate = useNavigate();

  const handleDragEnd = (event) => {
    setConchListened(true);
  };

  const [choices, setChoices] = useState([
    { label: "Greet the Siren.", value: 1 },
    { label: "Attack the Siren!", value: 2 },
    { label: "Take the Conch Shell.", value: 3 },
  ]);

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
      imageCSS: "imageMaterialize environImage padding-all-1 borderRadius",
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
      imageCSS: "environImage padding-all-1 borderRadius imageMaterialize",
      textCSS: "standardText",
      buttonText: "Continue",
    },
    soldierBlock: {
      text: "Two of the Sirens soldiers block your path as if materializing from thin air. The soldier on your left stares you in the eye, and from within in your head, you hear his watery voice say, 'You shall not pass until your business with our queen is finished!'",
      imageSrc: SoldierBlock,
      imageAlt: "Intimidating image of the merman soldiers blocking your path.",
      imageCSS: "imageMaterialize environImage padding-all-1 borderRadius",
      textCSS: "standardText",
      buttonText: "Go Back",
    },
  };

  const handleKeyDown = (event) => {
    if (showHelp || showLifeLost || showInventory) return;
    if (currentStep === 0 && !isIntroComplete && event.key === "c") {
      setIsIntroComplete(true);
      return;
    }
    if (currentStep === 3 && !stepThreeCompleted) return;
    if (
      (event.key.toLowerCase() === "c" || event.key.toLowerCase() === "b") &&
      currentStep === 4 &&
      !stepFourCompleted
    ) {
      return;
    }
    if (event.key.toLowerCase() === "b" && currentStep > 4) {
      return;
    }
    if (event.key.toLowerCase() === "c" && currentStep === 5) {
      return;
    }
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
    const key = event.key.toLowerCase();
    if (
      key === "c" &&
      currentStep < totalSteps - 1 &&
      (currentStep !== 3 || stepThreeCompleted)
    ) {
      nextStep();
    } else if (key === "b" && currentStep > 0) {
      previousStep();
    } else if (currentStep === 6) {
      nextStep();
    } else if (key === "c" && currentStep === totalSteps - 1) {
      nextStep();
    }
  };

  
  const handleChoiceSelect = (choice) => {
    setUserChoice(choice);
    switch (choice.value) {
      case 1:
        setDynamicSceneVisible(true);
        setCurrentDynamicSceneKey(
          hasConch ? "sirenGreetWithConch" : "sirenGreetNoConch"
        );
        break;
      case 2:
        setShowLifeLost(true);
        loseLife("sirenAttack");
        break;
      case 3:
        obtainItem("Conch"); // Use context's obtainItem method
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


  const handleDynamicSceneClose = () => {
    setDynamicSceneVisible(false);
    resetExplorationState();
    setAllowDirectionChange(true);
  };

  const resetExplorationState = () => {
    setRepetitiveMoves(0);
    setLastDirection(null);
  };

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

  const handleExplore = (direction) => {
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
      return;
    }
    if (lastDirection !== direction || repetitiveMoves === 0) {
      setRepetitiveMoves(1);
      setLastDirection(direction);
    } else {
      const newRepetitiveMoves = repetitiveMoves + 1;
      setRepetitiveMoves(newRepetitiveMoves);

      if (
        !stepFourCompleted &&
        direction === "ArrowLeft" &&
        newRepetitiveMoves === 2
      ) {
        setStepFourCompleted(true);
        setCurrentStep(5);
        return;
      }
      if (newRepetitiveMoves === 2) {
        setDynamicSceneVisible(true);
        setCurrentDynamicSceneKey("soldierBlock");
        setAllowDirectionChange(false);
      }
    }
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
                loading="eager"
                decoding="async"
              ></img>
            </p>
            <img
              className="environImage"
              src={Sundial}
              alt="A sundial protruding from the shore."
              width="500"
              height="500"
              loading="eager"
              decoding="async"
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
              loading="eager"
              decoding="async"
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
                  loading="eager"
                  decoding="async"
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
              alt="The siren and her soldiers onlooking a mountiain on the shore resembling a mounstrous head. "
              width="500"
              height="500"
              loading="eager"
              decoding="async"
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
              loading="eager"
              decoding="async"
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
              loading="eager"
              decoding="async"
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
              loading="eager"
              decoding="async"
            ></img>
          </div>
        );
    }
  };

  useEffect(() => {
    updateChoices();
  }, [hasConch]);

  useEffect(() => {
    if (resetSignal) {
      setCurrentStep(0);
    }
  }, [resetSignal]);

  useEffect(() => {
    if (currentStep === 8) {
      onComplete();
      setChapterComplete(true); // Mark chapter as complete
    }
  }, [currentStep]);


  useEffect(() => {
    if (chapterComplete) {
      if (isAuthenticated) {
        navigate("/dashboard"); // Redirect to Dashboard
      }
    }
  }, [chapterComplete, isAuthenticated, navigate]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    showHelp,
    showInventory,
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
    totalSteps,
  ]);


  return (

<div id="ChapterOnePage" className="widthControl">
      {dynamicSceneVisible && currentDynamicSceneKey ? (
        <div className="dynamicScenes">
          <img
            src={dynamicSceneData[currentDynamicSceneKey].imageSrc}
            alt={dynamicSceneData[currentDynamicSceneKey].imageAlt}
            className={dynamicSceneData[currentDynamicSceneKey].imageCSS}
            loading="eager"
            decoding="async"
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
                Press <span className="blueText">C</span> to continue. You can
                also press<span className="blueText"> H</span> at anytime for
                help
              </h3>
              <img
                id="trident"
                src={trident}
                alt="A beautiful shimmering trident"
                loading="eager"
                decoding="async"
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
                  loading="eager"
                  decoding="async"
                ></img>
              </div>
              <p className="boldText blueText">C to continue.</p>
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
                loading="eager"
                decoding="async"
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
                  loading="eager"
                  decoding="async"
                />
              )}
              {hasConch && (
                <img
                  className="environImage"
                  src={ConchInSatchel}
                  alt="The conch inside of a satchel beside a pistol."
                  loading="eager"
                  decoding="async"
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
          {currentStep === 6 && (
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
                The Siren speaks, and thanks to the creature now living in your
                ear, her previously indecipherable squeaking transforms into a
                melodious voice: “You are brave, and it is noble of you to seek
                help for your people in this dark age… but if you are to
                succeed, you will need powers beyond your means. Head east, go
                to the Cave of Mirrors, retrieve the Pearl Of The Moon, and free
                my sister, The White Witch. Only she can match the evil that is
                afoot. Take heed that your mirrored reflection may have more
                substance than you know. The pearl is a crystal ball that allows
                access to the door of the future, yet it also holds another
                powerful secret: Use it wisely, or be consumed by its power."
              </p>
              <img
                className="paddingMarginReset standardImage"
                alt="faint image of the white witches face within a magical orb"
                src={WhiteWitchPearl}
                loading="eager"
                decoding="async"
              ></img>
              <p className="standardText blueText">Press C to continue</p>
            </>
          )}
          {currentStep === 8 && !isAuthenticated && <Register />}
        </>
      )}
    </div>

    
  );
}

export default ChapterOne;
