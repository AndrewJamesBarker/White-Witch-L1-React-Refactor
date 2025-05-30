// InventoryItem.js
import React from "react";

const InventoryItem = ({ title, description, src, alt }) => (
  <div className="width-control">
    <h2 className="center-text bold-text blue-text">{title}</h2>
    <img className="inventoryItem" src={src} alt={alt} />
    <p className="standard-text">{description}</p>
  </div>
);

export default InventoryItem;
