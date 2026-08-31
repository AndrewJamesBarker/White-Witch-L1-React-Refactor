import React, { useEffect, forwardRef } from "react";
import LifeCrystal from "../../assets/images/ui-elements/LifeCrystal.svg";
import InsectPouch from "../../assets/images/inventory-items/insect-pouch.png";

const LifeGainPage = forwardRef(({ livesLeft, onClose, lifeCause, currentScene }, ref) => {

const rewardTexts = {
  livesFullCrystal: {
    title: "You have full lives!",
    message: "You found a life giving crystal, but your lives are already at full.",
    image: LifeCrystal,
    imageAlt: "life crystal",
    showLivesRemaining: true,
  },
  findCrystal: {
    title: "You found a life crystal!",
    message: "Congratulations! You found a life crystal! You have gained a life back.",
    image: LifeCrystal,
    imageAlt: "life crystal",
    showLivesRemaining: true,
  },
  findInsectPouch: {
    title: "You found a leather insect pouch!",
    message:
      "In the sand, you discover a leather drawstring pouch full of live, wriggling centipedes and other strange mutated insects. It has been added to your inventory.",
    image: InsectPouch,
    imageAlt: "leather insect pouch full of strange insects",
    showLivesRemaining: false,
  },
};

const rewardMessage = rewardTexts[lifeCause] || {
  title: "A reward has been found.",
  message: "Something useful has been added to your journey.",
  image: LifeCrystal,
  imageAlt: "reward item",
  showLivesRemaining: false,
};


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
        <p className="bold-text blue-text">{rewardMessage.title}</p>
        <img alt={rewardMessage.imageAlt} src={rewardMessage.image} width="200" height="200" loading="eager" decoding="async" className="center"/>
        <p className="standard-text">{rewardMessage.message}</p>
        {rewardMessage.showLivesRemaining && (
          <p>You now have {livesLeft} {livesLeft > 1 ? 'lives' : 'life' } left.</p>
        )}
        <p className="bold-text">Press Escape to continue.</p>
        <p>Good luck!</p>
    </div>
  );
});

export default LifeGainPage;
