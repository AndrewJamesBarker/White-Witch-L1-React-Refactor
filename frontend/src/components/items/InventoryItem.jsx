// InventoryItem.js
import React from "react";

const InventoryItem = ({ title, description, src, alt }) => (
  <div className="width-control">
    {title ? <h2 className="center-text bold-text blue-text">{title}</h2> : null}
    <img className="inventoryItem" src={src} alt={alt} />
    {description ? <p className="standard-text">{description}</p> : null}
  </div>
);

export default InventoryItem;
