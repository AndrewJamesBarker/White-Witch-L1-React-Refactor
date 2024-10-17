import React, { useState, useEffect } from "react";
import "@assets/CSS/images.css";
import "@assets/CSS/layout.css";
import "@assets/CSS/puzzle-map.css";
import puzzlePieces from "../svgPuzzlePieces/svgPuzzlePieces";
import ChapterMap from "../utilities/ChapterMap";

const PuzzleMap = ({ onTileClick, userGameState }) => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [tempHighlight, setTempHighlight] = useState(null); // State to temporarily highlight inaccessible pieces

  // Highlight the current chapter initially
  useEffect(() => {
    const currentChapter = userGameState.currentChapter.level;
    const currentPieceId = `piece${currentChapter}`;
    setSelectedPiece(currentPieceId); // Set the current chapter piece as selected
  }, [userGameState.currentChapter.level]);

  // Handle the click event on a puzzle piece
  const handlePieceClick = (id) => {
    const chapterNumber = id.replace("piece", ""); // Extract the chapter number
    const chapterKey = ChapterMap[chapterNumber]; // Get the corresponding chapter key
    const isChapterCompleted = userGameState.chaptersCompleted[chapterKey]; // Check if chapter is completed
    const isCurrentChapter = userGameState.currentChapter.level === parseInt(chapterNumber);

    if (isChapterCompleted || isCurrentChapter) {
      // Allow the selection
      setSelectedPiece(id);
      onTileClick(id);
    } else {
      // Temporarily highlight inaccessible piece in red
      setTempHighlight(id);
      setTimeout(() => {
        setTempHighlight(null); // Reset the highlight after 1 second
      }, 300);
    }
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
            const chapterNumber = piece.id.replace("piece", ""); // Extract the chapter number
            const chapterKey = ChapterMap[chapterNumber]; // Get the corresponding chapter key
            const isChapterCompleted = userGameState.chaptersCompleted[chapterKey]; // Check if chapter is completed
            const isCurrentChapter = userGameState.currentChapter.level === parseInt(chapterNumber);

            let strokeColor;
            if (tempHighlight === piece.id) {
              strokeColor = "red"; // Temporarily highlight in red if inaccessible
            } else if (selectedPiece === piece.id) {
              strokeColor = "green"; // Highlight selected piece in green
            } else {
              strokeColor = piece.stroke; // Default stroke color
            }

            return (
              <path
                key={piece.id}
                d={piece.d}
                fill={piece.fill}
                stroke={strokeColor}
                strokeWidth="3"
                onClick={() => handlePieceClick(piece.id)} // Handle piece click
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
