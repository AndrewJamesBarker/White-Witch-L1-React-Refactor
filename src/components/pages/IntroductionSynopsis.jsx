import React, { useState, useEffect } from "react";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";


const IntroductionSynopsis = () => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleMouseMove = (event) => {
    // Example logic for scaling and rotating based on mouse position
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element
    const y = event.clientY - rect.top;  // y position within the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const distance = Math.sqrt(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2));
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const scale = 1 + distance / maxDistance; // Example scaling factor

    setScale(scale);
    setRotation(x - centerX); // Example rotation factor
  };

  return (
    <div>
    <div 
      className="introText" 
      onMouseMove={handleMouseMove}
      style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
    >
      <p className="centerText IntroText">
        The proliferation of new plant life by a new solar life cycle has filled
        the planet with radical new chemical compounds, causing myriad mental
        and physical mutations. With the floods, Tundra's Plague compounds the
        tenuous living conditions, rendering many weak in mind and body and
        susceptible to psychic manipulation. Waring telepathic overlords across
        the globe vie for supremacy. One such leader, Therionarch, has conquered
        two other rival factions, amassing armies from the infected population
        and his newly formed, fractious alliance, ‘The Dark Triad.’ Your name is
        Caballero. You are the leader of a ragtag group of men and women. You
        are bearded, dirty, long-haired, strong, and healthy. Born blind, after
        the great floods came, you developed an ability to see using prescience
        and ESP. You wear a black cloak and carry an empty leather satchel-like
        backpack. You are visited in a dream by a Siren. She promises to help
        you gain an equal footing against the telekinetic warlords and provide
        sanctuary for your people. In the dream, she beckons you to her cove,
        where she will guide you on your quest.
      </p>
    </div>
    <p className="boldText positionBottom">Press C to continue</p>
    </div>
    
  );
};

export default IntroductionSynopsis;
