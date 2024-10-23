import React, { useState } from "react";
import "@assets/CSS/images.css";
import "@assets/CSS/layout.css";
import "@assets/CSS/puzzle-map.css";
import puzzlePieces from "../svgPuzzlePieces/svgPuzzlePieces";

const PuzzleMap = ({ onTileClick, selectedPiece, tempHighlight }) => {
  const [focusedPiece, setFocusedPiece] = useState(null); // To track focus

  const sortedPuzzlePieces = [...puzzlePieces].sort((a, b) => {
    const aIdNum = parseInt(a.id.replace("piece", ""), 10);
    const bIdNum = parseInt(b.id.replace("piece", ""), 10);
    return aIdNum - bIdNum;
  });

  return (
    <div className="puzzle-map-container">
      <svg
        viewBox="0 0 1345 1014"
        preserveAspectRatio="xMidYMid meet"
        className="puzzle-map-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_96_6)">
          {sortedPuzzlePieces.map((piece) => {
            let innerStrokeColor = piece.stroke; // Default inner stroke color

            // Highlight red if tempHighlight is active
            if (tempHighlight === piece.id) {
              innerStrokeColor = "#A80000";
            }
            // Highlight green if it's the selected piece
            else if (selectedPiece === piece.id) {
              innerStrokeColor = "#00A55B";
            }
            // else default to dark grey
            // else {
            //   innerStrokeColor = "#494949";
            // }

            return (
              <g key={piece.id}>
                {/* Outer stroke for focus, larger stroke width */}
                <path
                  d={piece.d}
                  fill="none"
                  stroke={focusedPiece === piece.id ? "white" : "none"} // Outer stroke only visible on focus
                  strokeWidth="16" // Larger width for focus outline
                  tabIndex={0} // Allow natural tabbing sequence
                  style={{ outline: "none" }}
                  onFocus={() => setFocusedPiece(piece.id)} // Set focus
                  onBlur={() => setFocusedPiece(null)} // Remove focus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault(); // Handle 'Enter' or 'Space' key press
                      onTileClick(piece.id);
                    }
                  }}
                />
                {/* Inner stroke for selected or highlighted state */}
                <path
                  d={piece.d}
                  fill={piece.fill}
                  stroke={innerStrokeColor}
                  strokeWidth="9" // Smaller width for the actual piece
                  onClick={() => onTileClick(piece.id)} // Handle click event
                />
              </g>
            );
          })}
        </g>
        <defs>{/* SVG Filters, etc. */}</defs>
      </svg>
    </div>
  );
};

export default PuzzleMap;
