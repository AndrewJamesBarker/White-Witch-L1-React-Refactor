import React from "react";
import Sundial from "../../../assets/images/environment/Sundial.png";
import { useGameState } from "../../../context/GameStateContext";

function ChapOneAltState() {
  const { currentChapter, 
          chaptersCompleted,
          viewingChapter,
          setViewingChapter
         } = useGameState();
  const { level } = currentChapter;

  return (
    <div className="chapter-one">
      <h2>Chapter One</h2>
      <img src={Sundial} alt="Sundial" />
      <p>
        You are standing in front of a sundial. The shadow points to the number{" "}
        <strong>{level}</strong>.
      </p>
      <p>
        {chaptersCompleted.chapterOne
          ? "You have already completed this chapter."
          : "You have not completed this chapter."}
      </p>
    </div>
  );
}

export default ChapOneAltState;