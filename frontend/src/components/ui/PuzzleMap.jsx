import React from "react";
import "@assets/CSS/images.css";
import "@assets/CSS/layout.css";
import "@assets/CSS/puzzle-map.css";
import puzzlePieces from "../svgPuzzlePieces/svgPuzzlePieces";

const PuzzleMap = ({ onTileClick, selectedPiece, tempHighlight, userGameState }) => {
  return (
    <div className="puzzle-map-container">
      <svg
        viewBox="0 0 1345 1014"
        preserveAspectRatio="xMidYMid meet"
        className="puzzle-map-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_96_6)">
          {puzzlePieces.map((piece) => {
            let strokeColor = piece.stroke; // Default stroke color

            // Highlight red if tempHighlight is active
            if (tempHighlight === piece.id) {
              strokeColor = "red";
            }
            // Highlight green if it's the selected piece
            else if (selectedPiece === piece.id) {
              strokeColor = "green";
            }

            return (
              <path
                key={piece.id}
                d={piece.d}
                fill={piece.fill}
                stroke={strokeColor}
                strokeWidth="3"
                onClick={() => onTileClick(piece.id)} // Send click event directly to Dashboard
              />
            );
          })}
        </g>
        <defs>{/* SVG Filters, etc. */}</defs>
      </svg>
    </div>
  );
};

export default PuzzleMap;
