import React, { forwardRef, useState } from "react";
import { useGameState } from "../../context/GameStateContext";
import InventoryItem from "../items/InventoryItem";
import Conch from "../../assets/images/inventory-items/Conch-Good.webp";
import Pearl from "../../assets/images/inventory-items/pearlOfTheMoon.webp";
import Laser from "../../assets/images/inventory-items/Laser-pistol.webp";
import InsectPouch from "../../assets/images/inventory-items/insect-pouch.png";
import PouchGems from "../../assets/images/inventory-items/pouch-gems.png";
import ECrystal from "../../assets/images/inventory-items/Elitrye-Crystals/E-Crystal.png";
import {
  E_CRYSTAL,
  LEATHER_INSECT_POUCH,
  LEGACY_LEATHER_DRAWSTRING_POUCH,
} from "../utilities/itemKeys";

const coreItemsData = [
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
  },
  {
    key: LEATHER_INSECT_POUCH,
    aliases: [LEGACY_LEATHER_DRAWSTRING_POUCH],
    title: "Leather Insect Pouch",
    description: "A weathered leather drawstring pouch crawling with live, wriggling centipedes and other strange mutated insects.",
    src: InsectPouch,
    alt: "leather insect pouch full of strange insects",
  }
];

const letterGemItemsData = [
  {
    key: E_CRYSTAL,
    title: "",
    description: "",
    src: ECrystal,
    alt: "Tiny etched crystal representing the letter E",
  },
];

const InventoryPage = forwardRef((props, ref) => {
  const { items } = useGameState(); // Access `items` from the context
  const [isLetterGemPouchOpen, setIsLetterGemPouchOpen] = useState(false);

  const renderSection = (title, sectionItems) => {
    const visibleItems = sectionItems.filter((item) => {
      return (
        items.includes(item.key) ||
        (item.aliases || []).some((alias) => items.includes(alias))
      );
    });

    if (visibleItems.length === 0) {
      return null;
    }

    return (
      <>
        <h3 className="center-text blue-text">{title}</h3>
        {visibleItems.map((item) => (
          <InventoryItem
            key={item.title}
            title={item.title}
            description={item.description}
            src={item.src}
            alt={item.alt}
          />
        ))}
      </>
    );
  };

  const visibleLetterGems = letterGemItemsData.filter((item) => {
    return (
      items.includes(item.key) ||
      (item.aliases || []).some((alias) => items.includes(alias))
    );
  });

  return (
    <div ref={ref} className="dynamic-scenes standard-text width-control center">
      <h2 className="center-text underline-text blue-text">Inventory</h2>
      <p>Press <span className="blue-text bold-text">'i'</span> at anytime to open or close this page.</p>
      {renderSection("Core Items", coreItemsData)}

      {visibleLetterGems.length > 0 && (
        <div className="width-control">
          <h3 className="center-text blue-text">Gems ({visibleLetterGems.length})</h3>

          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsLetterGemPouchOpen((prev) => !prev)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsLetterGemPouchOpen((prev) => !prev);
              }
            }}
            aria-expanded={isLetterGemPouchOpen}
            aria-controls="letter-gem-pouch-contents"
            aria-label="Open gem pouch"
            style={{
              background: "transparent",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              display: "block",
              margin: "0.4rem auto 0.8rem",
              padding: 0,
              textAlign: "center",
              outline: "none",
            }}
          >
            <img
              src={PouchGems}
              alt="Gem pouch"
              width="140"
              height="140"
              loading="eager"
              decoding="async"
              style={{
                display: "block",
                margin: "0 auto",
                filter: "drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35))",
              }}
            />
            <div style={{ fontSize: "0.95rem", opacity: 0.92, marginTop: "0.35rem" }}>
              Tiny etched crystals
            </div>
          </div>

          {isLetterGemPouchOpen && (
            <div id="letter-gem-pouch-contents">
              {visibleLetterGems.map((item) => (
                <InventoryItem
                  key={item.key}
                  title={item.title}
                  description={item.description}
                  src={item.src}
                  alt={item.alt}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default InventoryPage;
