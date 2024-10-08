import React from "react";
import '@assets/CSS/images.css';
import '@assets/CSS/layout.css';
import '@assets/CSS/puzzle-map.css';

import puzzleBlack from '@assets/images/dashboard-puzzle-map/puzzleBlack.svg';
import puzzleBlue from '@assets/images/dashboard-puzzle-map/puzzleBlue.svg';
import puzzleAqua from '@assets/images/dashboard-puzzle-map/puzzle-aqua.svg';

const PuzzleMap = ({onTileClick }) => {
  
  return (
    <div className="puzzle-map-container">
      <img src={puzzleBlue} alt="Puzzle map" className="puzzle-map" />
    </div>
  );
}

export default PuzzleMap;
