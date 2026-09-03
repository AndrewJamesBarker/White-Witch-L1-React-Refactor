import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useGameState } from "../../context/GameStateContext";
import { useNavigate } from "react-router-dom";
import PuzzleMap from "../ui/PuzzleMap";
import ChapterMap from "../utilities/ChapterMap";
import ChapterNames from "../utilities/ChapterNames";
import ErrorBoundary from "../utilities/ErrorBoundary"; // Error boundary to catch rendering issues
import Footer from "../layout/Footer";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    viewingChapter,
    setViewingChapter,
    currentChapter,
    chaptersCompleted,
    resetProgressForTesting,
  } = useGameState();

  // Get gameState from user and ensure defaults
  // const { gameState = { currentChapter: { level: 1 }, chaptersCompleted: {} } } = user;

  // State management in Dashboard
  const [selectedLevel, setSelectedLevel] = useState(viewingChapter);
  const [selectedPiece, setSelectedPiece] = useState(`piece${viewingChapter}`);
  const [chapterName, setChapterName] = useState(ChapterNames[viewingChapter]);

  const [inaccessibleLevel, setInaccessibleLevel] = useState(null);
  const [tempHighlight, setTempHighlight] = useState(null); // State for temporary red highlight
  const hasInitializedChapterSelection = useRef(false);

  useEffect(() => {
    if (
      !hasInitializedChapterSelection.current &&
      chaptersCompleted.chapterTwo &&
      currentChapter === 3
    ) {
      hasInitializedChapterSelection.current = true;
      setViewingChapter(3);
    }
  }, [chaptersCompleted.chapterTwo, currentChapter, setViewingChapter]);

  // Set the default selected piece and chapter name when the viewingChapter changes
  useEffect(() => {
    setSelectedPiece(`piece${viewingChapter}`);
    setSelectedLevel(viewingChapter);
    setChapterName(ChapterNames[viewingChapter]);
  }, [viewingChapter]);

  // Log when inaccessibleLevel is updated
  useEffect(() => {
    console.log("inaccessibleLevel in Dashboard updated:", inaccessibleLevel);
  }, [inaccessibleLevel]);

  // Map piece IDs to chapters
  const pieceIdToChapterMap = {
    piece1: 1,
    piece2: 2,
    piece3: 3,
    piece4: 4,
    piece5: 5,
    piece6: 6,
    piece7: 7,
    piece8: 8,
    piece9: 9,
    piece10: 10,
    piece11: 11,
    piece12: 12,
  };

  const handleTileClick = (id) => {
    const clickedPuzzlePiece = pieceIdToChapterMap[id];
    const chapterKey = ChapterMap[clickedPuzzlePiece];
    const isChapterCompleted = chaptersCompleted[chapterKey];
    const isCurrentChapter = currentChapter === clickedPuzzlePiece;

    if (isChapterCompleted || isCurrentChapter) {
      setSelectedLevel(clickedPuzzlePiece);
      setInaccessibleLevel(null);
      setChapterName(ChapterNames[clickedPuzzlePiece]);
      setSelectedPiece(id);
      setViewingChapter(clickedPuzzlePiece);
    } else {
      setInaccessibleLevel(clickedPuzzlePiece);
      setTempHighlight(id);

      // Reset the highlight after 300 milliseconds
      setTimeout(() => {
        setTempHighlight(null);
      }, 300);
    }
  };

  const handleResetTestProgress = async () => {
    if (!window.confirm("Reset all game progress for testing?")) {
      return;
    }

    const wasReset = await resetProgressForTesting();
    if (wasReset) {
      navigate("/");
    }
  };

  return (
    <div>
      <div>
        <h1>Greetings {user.username}</h1>
        {/* Display the selected level */}
        <h2>
          Selected Region: {selectedLevel ? chapterName : "None"}
        </h2>

        {inaccessibleLevel && (
          <div className="inaccessible-level" aria-live="polite">
            <p className="errorMessage">
              {ChapterNames[inaccessibleLevel] || inaccessibleLevel} region is currently locked.
            </p>
          </div>
        )}

        <button className="button" onClick={() => navigate("/")}>
          Continue
        </button>
        <button className="button topRight" onClick={() => logout()}>
          Logout
        </button>
        {import.meta.env.DEV && (
          <button className="button" onClick={handleResetTestProgress}>
            Reset Test Progress
          </button>
        )}

        <PuzzleMap
          onTileClick={handleTileClick}
          selectedPiece={`piece${viewingChapter}`} // Highlight the viewingChapter by default
          tempHighlight={tempHighlight}
          currentChapter={currentChapter}
          chaptersCompleted={chaptersCompleted}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
