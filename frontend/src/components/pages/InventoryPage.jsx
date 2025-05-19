import React, { forwardRef } from "react";
import { useGameState } from "../../context/GameStateContext";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";
import InventoryItem from "../items/InventoryItem";
import Conch from "../../assets/images/inventory-items/Conch-Good.png";
import Pearl from "../../assets/images/inventory-items/pearlOfTheMoon.png";
import Laser from "../../assets/images/inventory-items/Laser-pistol.png";

const itemsData = [
  {
    key: "Conch",
    title: "The Conch",
    description: "A conch shell, lovely in how it reflects the light. It seems to swirl like a distant galaxy. There's something impenetrable about it, as though it doesn't fully exist in any place at any given time. A powerful tool, as you will learn.",
    src: Conch,
    alt: "conch",
  },
  {
    key: "Pearl",
    title: "The Pearl Of The Moon",
    description: "The Pearl of the Moon, a palm-sized orb, glows softly like moonlight on water. Its surface shimmers with a mystic radiance, hinting at a hidden depth within its iridescent surface. It holds promises, untold insights, and a powerful secret.",
    src: Pearl,
    alt: "pearl",
  },
  {
    key: "Laser Pistol",
    title: "Laser Pistol",
    description: "A masterpiece of engineering harkening from the days of old. Your aim is always true with your trusty laser-pistol (even despite your lack of conventional sight.)",
    src: Laser,
    alt: "laser pistol",
  }
];

const InventoryPage = forwardRef((props, ref) => {
  const { items } = useGameState(); // Access `items` from the context

  return (
    <div ref={ref} className="dynamicScenes standardText widthControl">
      <h2 className="centerText underline blueText">Inventory</h2>
      <p>Press <span className="blueText boldText">'i'</span> at anytime to open or close this page.</p>
      {itemsData.map(item => 
        items.includes(item.key) && (
          <InventoryItem 
            key={item.title}
            title={item.title}
            description={item.description}
            src={item.src}
            alt={item.alt}
          />
        )
      )}
    </div>
  );
});

export default InventoryPage;
