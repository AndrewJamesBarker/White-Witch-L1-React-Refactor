import React from "react";
import Sundial from "../../../assets/images/environment/Sundial.png";
import ChapterNames from "../../utilities/ChapterNames";
import { useGameState } from "../../../context/GameStateContext";
import chapterNames from "../../utilities/ChapterNames";

function ChapOneAltState() {
  const { currentChapter, 
          chaptersCompleted,
          viewingChapter,
          setViewingChapter
         } = useGameState();
  const { level } = currentChapter;

  return (
    <div className="chapter-one">
      <h2>{chapterNames[viewingChapter]}</h2>
      <img className="environImage imageMaterialize" src={Sundial} alt="Sundial" />
      <p>
      There is a foreboding atmosphere. The Siren is gone, and only a sundial remains. Make haste, time is of the essence! 
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