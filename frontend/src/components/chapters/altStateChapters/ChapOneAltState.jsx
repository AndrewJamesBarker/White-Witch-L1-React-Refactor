import React, { useEffect } from "react";
import Sundial from "../../../assets/images/environment/Sundial.webp";
import ChapterNames from "../../utilities/ChapterNames"; // Added as per your note
import { useGameState } from "../../../context/GameStateContext";
import {
  LEATHER_INSECT_POUCH,
  LEGACY_LEATHER_DRAWSTRING_POUCH,
} from "../../utilities/itemKeys";
import { Typography, Box, Card, CardMedia } from "@mui/material";

function ChapOneAltState({ obtainItem }) {
  const {
    viewingChapter,
    items,
  } = useGameState();
  const hasAltStatePouch =
    items.includes(LEATHER_INSECT_POUCH) ||
    items.includes(LEGACY_LEATHER_DRAWSTRING_POUCH);
  const [enteredWithoutAltStatePouch] = React.useState(() => !hasAltStatePouch);

  useEffect(() => {
    if (enteredWithoutAltStatePouch && typeof obtainItem === "function") {
      obtainItem(LEATHER_INSECT_POUCH);
    }
  }, [enteredWithoutAltStatePouch, obtainItem]);

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
        There is a foreboding atmosphere. The Siren is gone, and only a sundial
        remains. Make haste, time is of the essence!
      </Typography>
      {enteredWithoutAltStatePouch && (
        <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold", color: "#00d4aa" }}>
          In the sand, you discover a leather drawstring pouch full of live,
          wriggling centipedes and other strange mutated insects. It has been added to
          your inventory.
        </Typography>
      )}
      <Typography variant="body1">
        You have already completed this chapter.
      </Typography>
    </Box>
  );
}

export default ChapOneAltState;
