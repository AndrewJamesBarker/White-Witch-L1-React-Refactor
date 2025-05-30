import React, { forwardRef } from "react";
import { useEffect } from "react";
import skullCrossBones from '../../assets/images/ui-elements/SkullXBones.webp';

const LifeLostPage =  forwardRef(({ livesLeft, onClose, resetGame, deathCause }, ref) => {

// Define the cause of death
const deathTexts = {
  sirenAttack: "As you take aim at her, the siren's eyes flash a deep, ominous red. In an instant, the serene cove transforms into a whirlpool of chaos. The siren's song, once indecipherable, becomes a piercing shriek, summoning the wrath of the sea. Your vision fades to black as a towering wave draws you into the abyss.",
  ignoreSoldiers: "You ignore the soldiers and push your way through them. As you walk, a piercing noise focuses into a splitting headache dead center of your forehead. Before you can turn to see it's too late. One of the Sirens generals leisurely approaches your corpse, and with a flick of his wrist, your body is flung into the mouth of an eagerly awaiting sea serpent.",
  // ... other death causes
};

// Get the death message
const deathMessage = deathTexts[deathCause] || "An unknown force has claimed your life.";

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (livesLeft > 0) {
          onClose();
        } else if (livesLeft === 0) {
          resetGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, livesLeft, resetGame]);

  return (
    <div ref={ref} className="dynamic-scenes width-control center">  
      {livesLeft > 0 ? (
        <>
          <p className="bold-text blue-text">Oh no! You lost a life!</p>
          <img alt="skull and crossbones" src={skullCrossBones} width="200" height="200" loading="eager" decoding="async" className="center"/>
          <p className="standard-text">{deathMessage}</p>
          <p>You now have {livesLeft} {livesLeft > 1 ? 'lives' : 'life' } left.</p>
          <p className="bold-text">Press Escape to continue.</p>
          <p>Good luck!</p>
        </>
      ) : (
        <>
          <p className="bold-text blue-text">Oh no! You lost your last life!</p>
          <img alt="skull and crossbones" src={skullCrossBones} width="200" height="200" loading="eager" decoding="async" className="center"/>
          <p className="standard-text">{deathMessage}</p>
          <p>You now have 0 lives left.</p>
          <p className="bold-text">Press Escape to start again.</p>
          <p>Good luck!</p>
        </>
      )}
    </div>
  );
});

export default LifeLostPage;
