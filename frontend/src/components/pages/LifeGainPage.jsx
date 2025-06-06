import React, { useEffect, forwardRef } from "react";
import LifeCrystal from "../../assets/images/ui-elements/LifeCrystal.svg";

const LifeGainPage = forwardRef(({ livesLeft, onClose, lifeCause, currentScene }, ref) => {

// Define the cause of the regained life
const lifeTexts = {
  livesFullCrystal: {
    title: "You have full lives!",
    message: "You found a life giving crystal, but your lives are already at full.",
    image: LifeCrystal,
  }, 
  findCrystal: {
    title: "You found a life crystal!",
    message: "Congratulations! You found a life crystal! You have gained a life back.",
    image: LifeCrystal,
}
};

const lifeMessage = lifeTexts[lifeCause] || "An unknown force has given you a life.";


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (livesLeft > 0) {
          onClose(currentScene);
        } else if (livesLeft === 0) {
          resetGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, livesLeft, currentScene]);

  return (
    <div ref={ref} className="dynamic-scenes width-control center">  
        <p className="bold-text blue-text">{lifeMessage.title}</p>
        <img alt="life crystal" src={LifeCrystal} width="200" height="200" loading="eager" decoding="async" className="center"/>
        <p className="standard-text">{lifeMessage.message}</p>
        <p>You now have {livesLeft} {livesLeft > 1 ? 'lives' : 'life' } left.</p>
        <p className="bold-text">Press Escape to continue.</p>
        <p>Good luck!</p>
    </div>
  );
});

export default LifeGainPage;
