import React from 'react';
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";
import DoorVision from "../../assets/images/environment/PortholeDoorVision.png";


const DynamicOverlay = ({ isVisible, text, image, onClose }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="overlayBox">
      <div className="overlayContent">
        {image && <img className="environImage" src={image.src} alt={image.alt} />}
        {text && <p className='widthControl'>{text}</p>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DynamicOverlay;
