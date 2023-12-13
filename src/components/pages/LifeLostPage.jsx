import React from "react";
import { useEffect } from "react";

import skullCrossBones from '../../assets/images/ui-elements/skull_crossbones.png';


const LifeLostPage = ({ livesLeft, onClose }) => {


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div id="lifeLostBox">
      <img alt="skull and crossbones" src={skullCrossBones} width="100" height="100" />
      <p className="boldText">Oh no! You lost a life!</p>
      <p>Don't worry, you can keep playing, but you only have {livesLeft} lives left.</p>
      <p className="boldText">Press Escape to continue.</p>
      <p>Good luck!</p>
    </div>
  );
}

export default LifeLostPage;