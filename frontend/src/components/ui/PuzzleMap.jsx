import React from "react";

// Ensure that the images are imported properly
import Frame from '@assets/images/dashboard-puzzle-map/WW-puzzle-frame.svg';
import puzzle1 from '@assets/images/dashboard-puzzle-map/ww-puzzle-1.svg';
import puzzle2 from '@assets/images/dashboard-puzzle-map/ww-puzzle-2.svg';
import puzzle3 from '@assets/images/dashboard-puzzle-map/ww-puzzle-3.svg';
import puzzle4 from '@assets/images/dashboard-puzzle-map/ww-puzzle-4.svg';
import puzzle5 from '@assets/images/dashboard-puzzle-map/ww-puzzle-5.svg';
import puzzle6 from '@assets/images/dashboard-puzzle-map/ww-puzzle-6.svg';
import puzzle7 from '@assets/images/dashboard-puzzle-map/ww-puzzle-7.svg';
import puzzle8 from '@assets/images/dashboard-puzzle-map/ww-puzzle-8.svg';

const PuzzleMap = ({ map, onTileClick }) => {
  const imageMap = {
    'frame': Frame,
    '1': puzzle1,
    '2': puzzle2,
    '3': puzzle3,
    '4': puzzle4,
    '5': puzzle5,
    '6': puzzle6,
    '7': puzzle7,
    '8': puzzle8,
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
