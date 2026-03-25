import React, { useState } from "react";
import "@assets/CSS/images.css";
import "@assets/CSS/layout.css";
import "@assets/CSS/puzzle-map.css";
import puzzlePieces from "../svgPuzzlePieces/svgPuzzlePieces";

const CYPHER_TEXT = `xsm ifgwsy nefuw, eyl ltypid zbjc alpzx wjiws wgtc pmgmw;
pmyv smtir rsh okfuw weqec, zc lpz pzjp, jcwf kfi tzqlfl wlp obmcxl
mg myc gsyka'j ulmdxxi, wsy hmkv jih lamiyc,
jzz lyc lswll tjswp pxi qigcmmj, wix nthjcv lpz iicc.

xz anitmzp bav mmp'd dbkpmswqv dsxeeqhe,
qyfxqm km iptbkpc, syc abicr wltorrmsy.
btbc lic pteb, pill avp qiy, igu dexsmk ycv otv,
yfp xlp ltii xvtiw igwid, igu rlij unjrr'x hqg.

jm lipl mycwi hwkuq, jsc ebkfsye pxi ayvp,
ghlp lilzm ngpp qiekcv, eyl wvyxl ta llpi.
sytr zl lic mfspegp kte wsy qqgu pitcqxmc,
nstv avp sv amkzql, jzz rfs legm uvcr hpkxztih.`;

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

  const shouldShowCypherLayer = CYPHER_REVEAL_MODE !== "forceNone";
  const shouldRevealAllCypher = CYPHER_REVEAL_MODE === "forceAll";
  const shouldUseForcedIds = CYPHER_REVEAL_MODE === "forceIds";

  const revealedPieceIds = shouldUseForcedIds
    ? new Set(CYPHER_REVEAL_FORCE_IDS)
    : unlockedPieceIds;

  return (
    <div className="puzzle-map-container">
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
                  color: "#f5f5f5",
                  fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
                  fontSize: "31px",
                  lineHeight: "1.65",
                  letterSpacing: "0.08em",
                  wordSpacing: "0.2em",
                  whiteSpace: "pre-wrap",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "90px 120px",
                  boxSizing: "border-box",
                  textShadow: "0 1px 6px rgba(0,0,0,0.75)",
                }}
              >
                {`"${CYPHER_TEXT}"`}
              </div>
            </foreignObject>
          </g>
        )}
        <defs>{/* SVG Filters, etc. */}</defs>
      </svg>
    </div>
  );
};

export default PuzzleMap;
