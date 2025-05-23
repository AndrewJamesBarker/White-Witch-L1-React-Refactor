import React, { forwardRef } from "react";
import "../../assets/CSS/layout.css";
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
    <div ref={ref} className="dynamicScenes widthControl">
      {livesLeft > 0 ? (
        <div>
          <p className="boldText blueText">Oh no! You lost a life!</p>
          <img alt="skull and crossbones" src={skullCrossBones} width="200" height="200"loading="eager" decoding="async"/>
          <p className="standardText">{deathMessage}</p>
          <p>Don't worry, you can keep playing, but you only have {livesLeft} {livesLeft > 1 ? 'lives' : 'life' } left.</p>
          <p className="boldText">Press Escape to continue.</p>
          <p>Good luck!</p>
        </div>
      ) : (
        <div>
          <p className="boldText">Oh no! You lost your last life!</p>
          <img alt="skull and crossbones" src={skullCrossBones} width="200" height="200" loading="eager" decoding="async"/>
          <p className="standardText">{deathMessage}</p>
          <p>Game Over</p>
          <p className="boldText">Press Escape to start again.</p>
          <p>Good luck!</p>
        </div>
      )}
    </div>
  );
});

export default LifeLostPage;
