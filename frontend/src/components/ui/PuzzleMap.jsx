import React, { useState } from "react";
import "@assets/CSS/images.css";
import "@assets/CSS/layout.css";
import "@assets/CSS/puzzle-map.css";
import puzzlePieces from "../svgPuzzlePieces/svgPuzzlePieces";

const PuzzleMap = ({ onTileClick, userGameState }) => {
  const [selectedPiece, setSelectedPiece] = useState(null);

  // Handle the click event on a puzzle piece
  const handlePieceClick = (id) => {
    setSelectedPiece(id); // Update the selected piece
    onTileClick(id); // Pass the ID to the Dashboard
  };

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
            // Map piece to chapter number
            const chapter = piece.id.replace("piece", "");
            const isChapterCompleted = userGameState.chaptersCompleted[`chapter${chapter}`];
            const isCurrentChapter = userGameState.currentChapter.level === parseInt(chapter);

            return (
              <path
                key={piece.id}
                d={piece.d}
                fill={piece.fill}
                stroke={selectedPiece === piece.id
                  ? isChapterCompleted || isCurrentChapter ? "green" : "red" // Green if unlocked/completed, red if locked
                  : piece.stroke}
                strokeWidth="2"
                onClick={() => handlePieceClick(piece.id)}
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
