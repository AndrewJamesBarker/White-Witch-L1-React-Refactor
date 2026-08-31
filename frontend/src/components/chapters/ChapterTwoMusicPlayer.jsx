import React from "react";
import AudioPlayer from "../ui/AudioPlayer";
import ChapterTwoMusic from "../../assets/audio/mixed-emotion-piano-guitar.mp3";

function ChapterTwoMusicPlayer() {
  return (
    <div
      style={{
        width: "min(75%, 28rem)",
        margin: "0 auto 1rem",
      }}
    >
      <AudioPlayer src={ChapterTwoMusic} autoplay={true} loop={true} />
    </div>
  );
}

export default ChapterTwoMusicPlayer;