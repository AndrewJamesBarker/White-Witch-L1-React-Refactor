import React, { useEffect, useRef } from "react";
import ItemsAndLives from "../ui/ItemsAndLives";
import ChapterOne from "../chapters/ChapterOne";
import ChapterTwo from "../chapters/ChapterTwo";
import HelpScreen from "../pages/HelpScreen";
import LifeLostPage from "../pages/LifeLostPage";
import LifeGainPage from "../pages/LifeGainPage";
import InventoryPage from "../pages/InventoryPage";
import RegisterForm from "../forms/RegisterForm";
import { useGameState } from "../../context/GameStateContext";
import { useAuth } from "../../context/AuthContext";

const Game = () => {
  const {
    currentChapter,
    livesLeft,
    showHelp,
    showLifeLost,
    showLifeGain,
    showInventory,
    resetSignal,
    deathCause,
    lifeCause,
    showCrystal,
    hasConch,
    hasPearl,
    currentScene,
    currentStep,
    showRegisterForm,
    setShowHelp,
    setShowLifeLost,
    setShowLifeGain,
    setShowInventory,
    setShowRegisterForm,
    loseLife,
    gainLife,
    resetGame,
    obtainItem,
    nextStep,
    previousStep,
    changeStep,
  } = useGameState();

  const { user } = useAuth();

  const helpRef = useRef(null);
  const inventoryRef = useRef(null);
  const lifeLostRef = useRef(null);
  const lifeGainRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (livesLeft === 0) {
        resetGame();
      } else {
        if (showHelp && helpRef.current && !helpRef.current.contains(event.target)) {
          setShowHelp(false);
        }
        if (showInventory && inventoryRef.current && !inventoryRef.current.contains(event.target)) {
          setShowInventory(false);
        }
        if (showLifeLost && lifeLostRef.current && !lifeLostRef.current.contains(event.target)) {
          setShowLifeLost(false);
        }
        if (showLifeGain && lifeGainRef.current && !lifeGainRef.current.contains(event.target)) {
          setShowLifeGain(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHelp, showInventory, showLifeLost, showLifeGain, livesLeft]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "SELECT"
      ) {
        return;
      }

      if (e.key.toLowerCase() === "h") {
        setShowHelp((prev) => !prev);
      }
      if (e.key.toLowerCase() === "i") {
        setShowInventory((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const renderChapterContent = () => {
    if (showRegisterForm) {
      return <RegisterForm />;
    } else if (showHelp) {
      return <HelpScreen ref={helpRef} />;
    } else if (showInventory) {
      return (
        <InventoryPage
          hasConch={hasConch}
          hasPearl={hasPearl}
          ref={inventoryRef}
        />
      );
    } else if (showLifeLost) {
      return (
        <LifeLostPage
          resetGame={resetGame}
          livesLeft={livesLeft}
          onClose={() => setShowLifeLost(false)}
          deathCause={deathCause}
          ref={lifeLostRef}
        />
      );
    } else if (showLifeGain) {
      return (
        <LifeGainPage
          livesLeft={livesLeft}
          onClose={() => setShowLifeGain(false)}
          lifeCause={lifeCause}
          currentScene={currentScene}
          ref={lifeGainRef}
        />
      );
    } else {
      return renderChapter();
    }
  };

  const renderChapter = () => {
    switch (currentChapter) {
      case 1:
        return (
          <ChapterOne
            loseLife={loseLife}
            gainLife={gainLife}
            obtainItem={obtainItem}
            nextStep={nextStep}
            previousStep={previousStep}
            currentStep={currentStep}
            resetSignal={resetSignal}
          />
        );
      case 2:
        return (
          <ChapterTwo
            loseLife={loseLife}
            gainLife={gainLife}
            obtainItem={obtainItem}
            nextStep={nextStep}
            previousStep={previousStep}
            currentStep={currentStep}
          />
        );
      default:
        return <div>Game Completed!</div>;
    }
  };

  const chapterNames = {
    1: user ? `The Cove - ${user.username}` : "The Cove",
    2: user ? `The Fields - ${user.username}` : "The Fields",
    3: user ? `The Ark  ${user.username}` : "The Ark",
  };

  return (
    <div className="raleway">
      {renderChapterContent()}
      <ItemsAndLives onSatchelClick={() => setShowInventory((prev) => !prev)} livesLeft={livesLeft} />
      <div className="chapterInfo blueText">
        {chapterNames[currentChapter] || "Unknown"}
      </div>
    </div>
  );
};

export default Game;
