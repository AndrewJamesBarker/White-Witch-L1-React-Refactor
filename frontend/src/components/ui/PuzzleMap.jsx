import React, { useState } from "react";
import "@assets/CSS/images.css";
import "@assets/CSS/layout.css";
import "@assets/CSS/puzzle-map.css";
import puzzlePieces from "../svgPuzzlePieces/svgPuzzlePieces";

const CYPHER_TEXT = `Xsm ifgwsy nefuw, eyl ltypid zbjc alpzx wjiws wgtc pmgmw;
Pmyv smtir rsh okfuw weqec, zc lpz pzjp, jcwf kfi tzqlfl wlp obmcxl
Mg myc gsyka'j ulmdxxi, wsy hmkv jih lamiyc,
Jzz lyc lswll tjswp pxi qigcmmj, wix nthjcv lpz iicc.

Xz anitmzp ghlp qyeimzmr,
Wfjfzr xs Ptbkpci, zck jgviy atctextwg.
Kyoi smk yyrh, wmtu fiv xmg, rlh jlbavp lic sbe,
Dsv epx uyvo ezbrb vmdml, rlh xsmr dswxy'b pzl.

Ws smxu rlidm pfphw, qwk ngxlzcm ycv gfzx,
Pmyv smtir amwt yrjxic, igu bieep bj qyvp.
Wgcw mr smk vkfvlkx tyr czc yzlh vpxkzczi,
Uwbe fiv zz ivpmws, nhi wsy siov ziiy lxtcmzpl.`;

const DECODED_TEXT = `The poison flows, and scales rise where flesh once lived;
Your heart now grows still, by her will, from the poison she giveth
By the conch’s whisper, you were led astray,
For she holds close her secrets, yet closer her prey.
To survive your mutation,
Submit to Elitrye, our siren salvation.
Take her hand, lead her men, and father her kin,
For the dark triad rises, and they mustn’t win.
So heed these words, for without her cure,
Your heart will falter, and death is sure.
Only in her embrace can you find reprieve,
Join her or perish, for you have been deceived.`;

const CYPHER_REVEAL_MODE = "auto";
const CYPHER_REVEAL_FORCE_IDS = [];

const CHAPTER_TO_PIECE_MAP = {
  chapterOne: "piece1",
  chapterTwo: "piece2",
  chapterThree: "piece3",
  chapterFour: "piece4",
  chapterFive: "piece5",
  chapterSix: "piece6",
  chapterSeven: "piece7",
  chapterEight: "piece8",
  chapterNine: "piece9",
  chapterTen: "piece10",
  chapterEleven: "piece11",
  chapterTwelve: "piece12",
};

const PuzzleMap = ({
  onTileClick,
  selectedPiece,
  tempHighlight,
  currentChapter,
  chaptersCompleted,
}) => {
  const [focusedPiece, setFocusedPiece] = useState(null); // To track focus
  const [cypherKey, setCypherKey] = useState("");

  const sortedPuzzlePieces = [...puzzlePieces].sort((a, b) => {
    const aIdNum = parseInt(a.id.replace("piece", ""), 10);
    const bIdNum = parseInt(b.id.replace("piece", ""), 10);
    return aIdNum - bIdNum;
  });

  const unlockedPieceIds = new Set();

  if (typeof currentChapter === "number") {
    unlockedPieceIds.add(`piece${currentChapter}`);
  }

  if (chaptersCompleted) {
    Object.entries(chaptersCompleted).forEach(([chapterKey, isCompleted]) => {
      if (isCompleted) {
        const pieceId = CHAPTER_TO_PIECE_MAP[chapterKey];
        if (pieceId) {
          unlockedPieceIds.add(pieceId);
        }
      }
    });
  }

  const allChaptersCompleted =
    chaptersCompleted &&
    Object.keys(CHAPTER_TO_PIECE_MAP).every((key) => chaptersCompleted[key]);

  const shouldShowCypherLayer = CYPHER_REVEAL_MODE !== "forceNone";
  const shouldRevealAllCypher =
    CYPHER_REVEAL_MODE === "forceAll" ||
    (CYPHER_REVEAL_MODE === "auto" && allChaptersCompleted);
  const shouldUseForcedIds = CYPHER_REVEAL_MODE === "forceIds";

  const revealedPieceIds = shouldUseForcedIds
    ? new Set(CYPHER_REVEAL_FORCE_IDS)
    : unlockedPieceIds;

  const keyUnlocked = cypherKey.trim().toLowerCase() === "elitrye";
  const displayText = keyUnlocked ? DECODED_TEXT : CYPHER_TEXT;
  const cypherQuotedText = `"${displayText}"`;

  return (
    <div className="puzzle-map-container">
      {shouldShowCypherLayer && (
        <span
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Revealed cypher text: {cypherQuotedText}
        </span>
      )}
      <svg
        viewBox="0 0 1345 1014"
        preserveAspectRatio="xMidYMid meet"
        className="puzzle-map-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="cypherRevealMask">
            <rect x="0" y="0" width="1345" height="1014" fill="black" />
            {shouldRevealAllCypher && (
              <rect x="0" y="0" width="1345" height="1014" fill="white" />
            )}
            {!shouldRevealAllCypher &&
              sortedPuzzlePieces
                .filter((piece) => revealedPieceIds.has(piece.id))
                .map((piece) => <path key={`mask-${piece.id}`} d={piece.d} fill="white" />)}
          </mask>
        </defs>

        <g filter="url(#filter0_d_96_6)">
          {sortedPuzzlePieces.map((piece) => {
            let innerStrokeColor = piece.stroke; // Default inner stroke color

            // Highlight red if tempHighlight is active
            if (tempHighlight === piece.id) {
              innerStrokeColor = "#b90101";
            }
            // Highlight green if it's the selected piece
            else if (selectedPiece === piece.id) {
              innerStrokeColor = "#00A55B";
            }
            // else default to dark grey
            else {
              innerStrokeColor = "#494949";
            }

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
        {shouldShowCypherLayer && (
          <g style={{ pointerEvents: "none" }}>
            <foreignObject
              x="0"
              y="0"
              width="1345"
              height="1014"
              mask="url(#cypherRevealMask)"
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  width: "100%",
                  height: "100%",
                  color: "#DDFBEF",
                  fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
                  fontSize: "31px",
                  fontWeight: "900",
                  fontStyle: "italic",
                  fontSynthesis: "style",
                  letterSpacing: "0.08em",
                  wordSpacing: "0.2em",
                  whiteSpace: "pre-wrap",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "90px 120px",
                  boxSizing: "border-box",
                  WebkitTextStroke: "0.35px rgba(0, 165, 91, 0.35)",
                  textShadow:
                    "0 0 6px rgba(120, 255, 190, 0.38), 0 0 14px rgba(70, 220, 150, 0.26), 0 1px 3px rgba(0, 0, 0, 0.5)",
                }}
              >
                {cypherQuotedText}
              </div>
            </foreignObject>
          </g>
        )}
        <defs>{/* SVG Filters, etc. */}</defs>
      </svg>
      {shouldRevealAllCypher && (
        <div
          style={{
            marginTop: "1.5rem",
            marginBottom: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <label
            htmlFor="cypher-key-input"
            style={{
              color: "#DDFBEF",
              fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
              fontSize: "0.95rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            The Sirens True Name
          </label>
          <input
            id="cypher-key-input"
            type="text"
            value={cypherKey}
            onChange={(e) => setCypherKey(e.target.value)}
            autoComplete="off"
            style={{
              background: "rgba(8, 18, 12, 0.85)",
              border: "1px solid rgba(0, 165, 91, 0.5)",
              borderRadius: "4px",
              color: "#DDFBEF",
              fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
              fontSize: "1rem",
              letterSpacing: "0.12em",
              padding: "0.5rem 1.2rem",
              width: "320px",
              textAlign: "center",
              outline: "none",
              boxShadow: "0 0 8px rgba(0, 165, 91, 0.2)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PuzzleMap;
