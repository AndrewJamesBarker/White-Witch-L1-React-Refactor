import React from "react";
import { useEffect } from "react";
import skullCrossBones from '../../assets/images/ui-elements/SkullXBones.png';

const LifeLostPage = ({ livesLeft, onClose, resetGame }) => {
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
    <div>
      {livesLeft > 0 ? (
        <div id="lifeLostBox">
          <p className="boldText">Oh no! You lost a life!</p>
          <img alt="skull and crossbones" src={skullCrossBones} width="200" height="200" />
          <p>Don't worry, you can keep playing, but you only have {livesLeft} lives left.</p>
          <p className="boldText">Press Escape to continue.</p>
          <p>Good luck!</p>
        </div>
      ) : (
        <div id="lifeLostBox">
          <p className="boldText">Oh no! You lost your last life!</p>
          <img alt="skull and crossbones" src={skullCrossBones} width="200" height="200" />
          <p>Game Over</p>
          <p className="boldText">Press Escape to start again.</p>
          <p>Good luck!</p>
        </div>
      )}
    </div>
  );
};

export default LifeLostPage;
