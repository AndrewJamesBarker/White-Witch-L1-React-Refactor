import React from "react";

const PuzzleMap = ({ map, onTileClick }) => {
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
              {tile}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default PuzzleMap;