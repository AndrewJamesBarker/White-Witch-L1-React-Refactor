import React, { useState, useEffect, useRef } from 'react';
import ItemsAndLives from '../ui/ItemsAndLives';
import ChapterOne from '../chapters/ChapterOne';
import ChapterTwo from '../chapters/ChapterTwo';
import HelpScreen from '../pages/HelpScreen';
import LifeLostPage from '../pages/LifeLostPage';
import LifeGainPage from '../pages/LifeGainPage';
import InventoryPage from '../pages/InventoryPage';
import SaveGame from '../pages/SaveGame';
import AccountForm from '../pages/AccountForm';

const Game = () => {
  const [livesLeft, setLivesLeft] = useState(3);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showHelp, setShowHelp] = useState(false);
  const [showLifeLost, setShowLifeLost] = useState(false);
  const [showLifeGain, setShowLifeGain] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [deathCause, setDeathCause] = useState('');
  const [lifeCause, setLifeCause] = useState('');
  const [showCrystal, setShowCrystal] = useState(true);
  // state of item possession for inventory
  const [hasConch, setHasConch] = useState(false);
  const [hasPearl, setHasPearl] = useState(false);
  // register for when player has taken the conch and pearl
  const [conchTaken, setConchTaken] = useState(false);
  const [pearlTaken, setPearlTaken] = useState(false);
  // track the current scene. Used for directional event listening
  const [currentScene, setCurrentScene] = useState("");
  // Define the current step, starting at 0
  const [currentStep, setCurrentStep] = useState(0);
  // ref for modals
  const helpRef = useRef(null);  // Ref for help modal
  const inventoryRef = useRef(null);  // Ref for help modal
  const lifeLostRef = useRef(null);  // Ref for life lost modal
  const lifeGainRef = useRef(null);  // Ref for life gain modal
  // State to manage sign-in form visibility and save game option
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);  // State to manage sign-in form visibility
  const [saveGameOption, setSaveGameOption] = useState(''); // 'login', 'register', 'save'



  // Function to close modals if clicked outside
  const handleClickOutside = (event) => {
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
      lifeGainClose(currentScene)
    }
    // Repeat for other modals like inventory, life lost/gain pages
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHelp, showInventory, showLifeLost, showLifeGain]); // Add other dependencies as necessary

  // move to next step in chapter
  const nextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };
  // move to previous step in chapter
  const previousStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const changeStep = (step) => {
    setCurrentStep(step);
  };

  // save game progress
  const handleSaveGame = () => {
    if (!isAuthenticated) {
      setShowAccountForm(true); // Show the account form if not logged in
      // Optionally set saveGameOption based on what user needs to do
    } else {
      // Proceed with saving the game directly
      console.log("Save game directly");
    }
  };

  // set conch for inventory
  const obtainConch = () => {
    setHasConch(true);
  };
  // set pearl for inventory
  const obtainPearl = () => { 
    setHasPearl(true);
  }

  const handleSatchelClick = () => {
    console.log("Satchel clicked");
    setShowInventory(prev => !prev);
  }
  
  // Mapping of chapter numbers to names
  const chapterNames = {
    1: 'The Cove',
    2: 'Save Chapter One',
    3: 'The Fields',
    // ... other chapter names
  };

  const loseLife = (cause) => {
    if (livesLeft > 0) {
      setLivesLeft(livesLeft - 1);
      setDeathCause(cause);  // Update the death cause
    }
  };
  
  const handleCloseLifeLostPage = () => {
    setShowLifeLost(false);
    livesLeft === 0 && resetGame();
  };

  const lifeGainClose = (scene) => {
    setShowLifeGain(false);
    setShowCrystal(false);
    setCurrentScene(scene);
  };


  const gainLife = (cause) => {
    if (livesLeft < 3) {
      setLivesLeft(livesLeft + 1);
    }
      setLifeCause(cause); // Update the life giving cause
      setShowLifeGain(true);
  };

  const resetGame = () => {
    setLivesLeft(3);
    setCurrentChapter(1);
    setResetSignal(true);
    setShowLifeLost(false);
    setConchTaken(false);
    setHasConch(false);
  };

  useEffect(() => {
    if(resetSignal) {
      setResetSignal(false);
    }
  }, [resetSignal]);

  const goToNextChapter = () => {
    setCurrentChapter(currentChapter + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'h') {
        setShowHelp(prev => !prev); // toggle showHelp
      }
      if (e.key.toLowerCase() === 'i') {
        setShowInventory(prev => !prev); // toggle showInventory
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const renderChapterContent = () => {
    if (showAccountForm) {
      return <AccountForm />;
    } else if (showHelp) {
      return <HelpScreen ref={helpRef}/>;
    } else if (showInventory) {
      return <InventoryPage hasConch={hasConch} hasPearl={hasPearl} ref={inventoryRef} />;
    } else if (showLifeLost) {
      return <LifeLostPage resetGame={resetGame} livesLeft={livesLeft} onClose={handleCloseLifeLostPage} deathCause={deathCause} ref={lifeLostRef}/>;
    } else if (showLifeGain) {
      return <LifeGainPage livesLeft={livesLeft} onClose={lifeGainClose} lifeCause={lifeCause} currentScene={currentScene} ref={lifeGainRef}/>;
    } 
    else {
      return renderChapter();
    }
  }

  const renderChapter = () => {
    switch (currentChapter) {
      case 1:
        return <ChapterOne 
          onComplete={goToNextChapter} 
          loseLife={loseLife}
          gainLife={gainLife}
          showLifeLost={showLifeLost}
          setShowLifeLost={setShowLifeLost} 
          showLifeGain={showLifeGain}
          setShowLifeGain={setShowLifeGain}
          livesLeft={livesLeft}
          resetSignal={resetSignal}
          showHelp={showHelp}
          showInventory={showInventory}
          obtainConch={obtainConch}
          currentStep={currentStep} 
          setCurrentStep={setCurrentStep}
          nextStep={nextStep}
          previousStep={previousStep}
          conchTaken={conchTaken}
          setConchTaken={setConchTaken}
          showCrystal={showCrystal}
          currentScene={currentScene}
          setCurrentScene={setCurrentScene}
         />;
      
      case 2:
        return <SaveGame 
        onComplete={goToNextChapter} 
        onSaveGame={handleSaveGame}
        />

      case 3:
        return <ChapterTwo
          onComplete={goToNextChapter} 
          loseLife={loseLife}
          gainLife={gainLife}
          showLifeLost={showLifeLost}
          setShowLifeLost={setShowLifeLost} 
          showLifeGain={showLifeGain}
          setShowLifeGain={setShowLifeGain}
          livesLeft={livesLeft}
          resetSignal={resetSignal}
          showHelp={showHelp}
          showInventory={showInventory}
          currentStep={currentStep} 
          changeStep={changeStep}
          previousStep={previousStep}
         />;
    
      default:
        return <div>Game Completed!</div>;
    }
  };

  return (
    <div className='raleway'>
      {renderChapterContent()}
      <ItemsAndLives onSatchelClick={handleSatchelClick} livesLeft={livesLeft} />
      <div className="chapterInfo blueText">
        {chapterNames[currentChapter] || 'Unknown'}
      </div>
    </div>
  );
};

export default Game;
