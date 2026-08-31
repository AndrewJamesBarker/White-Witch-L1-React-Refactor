import React, { useEffect, useState } from "react";
import Sundial from "../../../assets/images/environment/Sundial.webp";
import InsectPouch from "../../../assets/images/inventory-items/insect-pouch.png";
import ChapterNames from "../../utilities/ChapterNames"; // Added as per your note
import { useAuth } from "../../../context/AuthContext";
import { useGameState } from "../../../context/GameStateContext";
import {
  LEATHER_INSECT_POUCH,
  LEGACY_LEATHER_DRAWSTRING_POUCH,
} from "../../utilities/itemKeys";
import { Typography, Box, Card, CardMedia } from "@mui/material";

const TOTAL_LETTER_GEMS = 7;

function ChapOneAltState({ obtainItem, onEarlyReturnStateChange, showRewardPopup }) {
  const {
    viewingChapter,
    currentChapter,
    items,
  } = useGameState();
  const { user } = useAuth();
  const [isClaimingPouch, setIsClaimingPouch] = useState(false);
  const hasAltStatePouch =
    items.includes(LEATHER_INSECT_POUCH) ||
    items.includes(LEGACY_LEATHER_DRAWSTRING_POUCH);
  const guestUser = JSON.parse(sessionStorage.getItem("guestUser"));
  const collectedGems =
    user?.gameState?.gems?.collected ||
    guestUser?.gameState?.gems?.collected ||
    [];
  const isChapterThreeUnlocked = currentChapter >= 3;
  const isMissingLetterGems = collectedGems.length < TOTAL_LETTER_GEMS;
  const showEarlyReturnState = isChapterThreeUnlocked && isMissingLetterGems;

  useEffect(() => {
    onEarlyReturnStateChange?.(showEarlyReturnState);
  }, [onEarlyReturnStateChange, showEarlyReturnState]);

  const handlePouchClick = async () => {
    if (
      isClaimingPouch ||
      hasAltStatePouch ||
      typeof obtainItem !== "function"
    ) {
      return;
    }

    setIsClaimingPouch(true);

    try {
      showRewardPopup?.("findInsectPouch");
      await obtainItem(LEATHER_INSECT_POUCH);
    } finally {
      setIsClaimingPouch(false);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        // boxShadow: 3,
        textAlign: "center",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          fontSize: "1.5em", // Smaller font size
          fontWeight: "bold", // Make it bold
          textAlign: "center", // Optional: Center align
        }}
      >
        {ChapterNames[viewingChapter]}
      </Typography>
      <Card sx={{ my: 2, borderRadius: 6, backgroundColor: "#242424" }}>
        <CardMedia component="img" image={Sundial} alt="Sundial" />
      </Card>

      <Typography variant="body1" gutterBottom>
        {showEarlyReturnState
          ? "You're back early! There is still much to be done, be on your way, and stop lollygagging!"
          : "There is a foreboding atmosphere. The Siren is gone, and only a sundial remains. Make haste, time is of the essence!"}
      </Typography>
      {!hasAltStatePouch && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom sx={{ color: "#00d4aa", fontWeight: "bold" }}>
            Something wriggles in the sand. Click it to pick it up.
          </Typography>
          <button
            type="button"
            onClick={handlePouchClick}
            disabled={isClaimingPouch}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: isClaimingPouch ? "default" : "pointer",
            }}
            aria-label="Pick up the leather insect pouch"
          >
            <img
              className="objectPulse imageMaterialize"
              src={InsectPouch}
              alt="A leather insect pouch wriggling in the sand"
              width="140"
              height="140"
              loading="eager"
              decoding="async"
            />
          </button>
        </Box>
      )}
      <Typography variant="body1">
        {!showEarlyReturnState && "You have already completed this chapter."}
      </Typography>
    </Box>
  );
}

export default ChapOneAltState;
