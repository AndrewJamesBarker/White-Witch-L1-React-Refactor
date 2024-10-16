import React, { useState } from "react";
import "@assets/CSS/images.css";
import "@assets/CSS/layout.css";
import "@assets/CSS/puzzle-map.css";

import puzzlePieces from "../svgPuzzlePieces/svgPuzzlePieces";

const PuzzleMap = ({ onTileClick }) => {
  // State to track the selected piece
  const [selectedPiece, setSelectedPiece] = useState(null);

  // Handle the click event on a puzzle piece
  const handlePieceClick = (id) => {
    console.log(`Piece clicked: ${id}`);
    setSelectedPiece(id); // Update the selected piece
    onTileClick(id); // Pass the ID to the Dashboard
  };

  return (
    <div className="puzzle-map-container">
      <svg
        viewBox="0 0 1345 1014"
        preserveAspectRatio="xMidYMid meet"
        className="puzzle-map-svg" // Reference to the CSS for responsiveness
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_96_6)">
          {puzzlePieces.map((piece) => (
            <path
              key={piece.id}
              d={piece.d}
              fill={piece.fill}
              stroke={selectedPiece === piece.id ? "red" : piece.stroke} // Change stroke color if selected
              strokeWidth="2"
              onClick={() => handlePieceClick(piece.id)} // Handle piece click
            />
          ))}
        </g>
        <defs>{/* SVG Filters, etc. */}</defs>
      </svg>
    </div>
  );
};

export default PuzzleMap;
