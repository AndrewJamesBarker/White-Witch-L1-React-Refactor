import React, { useState, useEffect } from "react";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";
import Conch from "../../assets/images/inventory-items/Conch-Good.png";
import Pearl from "../../assets/images/inventory-items/pearlOfTheMoon.png";


const InventoryOverlay = ({ hasConch, hasPearl }) => {

  const hasAnyItems = hasConch || hasPearl;
  return (
    <div className="overlayBox">
      <h2 className="centerText underline">Inventory</h2>
      <p>Press i at anytime to open or close this page.</p>
      {!hasAnyItems && (
        <p className="centerText">You don't have any items. It's time to go and get some!</p>
      )}
      {hasConch && (
        <div className="widthControl">
          <h3 className="centerText itemTitle">The Conch</h3>
          <img className="conchItem" src={Conch} alt="conch" />
          <p>A conch shell, lovely in how it reflects the light. It seems to swirl like a distant galaxy. There's something impenetrable about it, as though it doesn't fully exist in any place at any given time. A powerful tool, as you will learn.</p>
        </div>
      )}
      {hasPearl && (
        <div>
          <h3 className="centerText itemTitle">The Pearl Of The Moon</h3>
          <img className="pearlItem" src={Pearl} alt="pearl" />
          <p>The Pearl of the Moon, a palm-sized orb, glows softly like moonlight on water. Its surface shimmers with a mystic radiance, hinting at a hidden depth within its iridescent surface. It holds promises, untold insights, and a powerful secret.</p>
        </div>
      )}  
    </div>
  );
}

export default InventoryOverlay;