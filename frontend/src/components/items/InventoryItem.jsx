// InventoryItem.js
import React from "react";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";

const InventoryItem = ({ title, description, src, alt }) => (
  <div className="widthControl">
    <h2 className="centerText boldText blueText">{title}</h2>
    <img className="inventoryItem" src={src} alt={alt} />
    <p className="standardText">{description}</p>
  </div>
);

export default InventoryItem;
