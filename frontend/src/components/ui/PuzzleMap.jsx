import React from "react";

// Ensure that the images are imported properly

import puzzle from '@assets/images/dashboard-puzzle-map/puzzle-complete-trans.png';


const PuzzleMap = ({ map, onTileClick }) => {
  const imageMap = {
    '1': puzzle,
  };

  return (
    <div className="puzzle-map">
      {map.map((row, rowIndex) => (
        <div key={rowIndex} className="puzzle-row">
          {row.map((tile, tileIndex) => (
            <button
              key={tileIndex}
              className={`puzzle-tile ${tile}`}
              onClick={() => onTileClick(rowIndex, tileIndex)}
            >
              <img src={imageMap[tile]} alt={`Puzzle piece ${tile}`} />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default PuzzleMap;
