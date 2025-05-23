import React from "react";
import Sundial from "../../../assets/images/environment/Sundial.webp";
import ChapterNames from "../../utilities/ChapterNames"; // Added as per your note
import { useGameState } from "../../../context/GameStateContext";
import { Typography, Box, Card, CardMedia } from "@mui/material";

function ChapOneAltState() {
  const {
    currentChapter,
    chaptersCompleted,
    viewingChapter,
    setViewingChapter,
  } = useGameState();
  const { level } = currentChapter;

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
      <Typography variant="body1">
        You have already completed this chapter.
      </Typography>
    </Box>
  );
}

export default ChapOneAltState;
