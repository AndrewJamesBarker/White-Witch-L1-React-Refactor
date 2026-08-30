import React, { useEffect, useRef, useState } from "react";
import "../chapterTwoMaze.css";
import {
  REED_MAZE_GRID,
  REED_ROUTE_POSITIONS,
  POSITION_BY_ARROW,
  positionsMatch,
  getRouteIndexForPosition,
} from "../chapterTwoMazeData";
import Caballero from "../../../assets/images/ui-elements/Caballero.webp";

const RETREAT_TIME_LIMIT_MS = 45000;
const GOAL_INDEX = REED_ROUTE_POSITIONS.length - 1;
const HOME_POSITION = REED_ROUTE_POSITIONS[0];

// Revisit challenge: player must retrace the Chapter Two maze route backward, from memory, with no Grinn guidance.
function ChapterTwoAltState({
  loseLife,
  setShowLifeLost,
  showLifeLost,
  showHelp,
  showInventory,
  onComplete,
  resetSignal,
}) {
  const [playerPosition, setPlayerPosition] = useState(
    REED_ROUTE_POSITIONS[GOAL_INDEX]
  );
  const [deadline, setDeadline] = useState(
    () => Date.now() + RETREAT_TIME_LIMIT_MS
  );
  const [timeLeftMs, setTimeLeftMs] = useState(RETREAT_TIME_LIMIT_MS);
  const [hasFailed, setHasFailed] = useState(false);
  const [hasArrivedHome, setHasArrivedHome] = useState(false);
  const failureHandledRef = useRef(false);
  const hasUnlockedChapterOneRef = useRef(false);

  useEffect(() => {
    if (!resetSignal) {
      return;
    }

    setPlayerPosition(REED_ROUTE_POSITIONS[GOAL_INDEX]);
    setDeadline(Date.now() + RETREAT_TIME_LIMIT_MS);
    setTimeLeftMs(RETREAT_TIME_LIMIT_MS);
    setHasFailed(false);
    setHasArrivedHome(false);
    failureHandledRef.current = false;
  }, [resetSignal]);

  useEffect(() => {
    if (
      !hasArrivedHome ||
      typeof onComplete !== "function" ||
      hasUnlockedChapterOneRef.current
    ) {
      return;
    }

    hasUnlockedChapterOneRef.current = true;
    onComplete();
  }, [hasArrivedHome, onComplete]);

  useEffect(() => {
    if (hasFailed || hasArrivedHome || showHelp || showInventory || showLifeLost) {
      return;
    }

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, deadline - Date.now());
      setTimeLeftMs(remaining);

      if (remaining <= 0 && !failureHandledRef.current) {
        failureHandledRef.current = true;
        setHasFailed(true);
        setShowLifeLost(true);
        loseLife("marshRetreatTimeout");
      }
    }, 100);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    deadline,
    hasArrivedHome,
    hasFailed,
    loseLife,
    setShowLifeLost,
    showHelp,
    showInventory,
    showLifeLost,
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (hasFailed || hasArrivedHome || showHelp || showInventory || showLifeLost) {
        return;
      }

      const delta = POSITION_BY_ARROW[event.key];
      if (!delta) {
        return;
      }

      event.preventDefault();
      const nextPosition = [
        playerPosition[0] + delta[0],
        playerPosition[1] + delta[1],
      ];
      const currentRouteIndex = getRouteIndexForPosition(playerPosition);
      const nextRouteIndex = getRouteIndexForPosition(nextPosition);

      // Backward navigation: only the previous route index (relative to current) is a valid step.
      if (nextRouteIndex === -1 || nextRouteIndex !== currentRouteIndex - 1) {
        failureHandledRef.current = true;
        setHasFailed(true);
        setShowLifeLost(true);
        loseLife("wrongMarshRetreatPath");
        return;
      }

      setPlayerPosition(nextPosition);
      if (positionsMatch(nextPosition, HOME_POSITION)) {
        setHasArrivedHome(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    hasArrivedHome,
    hasFailed,
    loseLife,
    playerPosition,
    setShowLifeLost,
    showHelp,
    showInventory,
    showLifeLost,
  ]);

  const secondsLeft = Math.ceil(timeLeftMs / 1000);

  return (
    <div id="ChapterTwoAltStatePage" className="width-control">
      <h2 className="bold-text">The Fields, Revisited</h2>
      <div className="cursorBox">
        <p id="bodyText" className="standard-text">
          {hasArrivedHome
            ? "You retrace your steps out of the marsh, alone this time. Grinn is nowhere to be seen."
            : "The marsh looks different from this side. Find your way back out the way you came, without Grinn's help this time."}
        </p>

        {!hasArrivedHome && (
          <div className="reed-maze__panel">
            <div className="reed-maze__frame">
              <div className="reed-maze" aria-label="Reed maze retreat">
                {REED_MAZE_GRID.map((row, rowIndex) =>
                  row.map((_, colIndex) => {
                    const isPlayer =
                      rowIndex === playerPosition[0] && colIndex === playerPosition[1];
                    const isHome =
                      rowIndex === HOME_POSITION[0] && colIndex === HOME_POSITION[1];
                    const tileKey = `${rowIndex}-${colIndex}`;
                    const tileClasses = [
                      "reed-maze__cell",
                      "reed-maze__cell--path",
                      isHome ? "reed-maze__cell--goal" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <div key={tileKey} className={tileClasses}>
                        <span className="reed-maze__tile-sheen" aria-hidden="true" />
                        {isHome && (
                          <span className="reed-maze__goal-glyph" aria-hidden="true" />
                        )}
                        {isPlayer && (
                          <img
                            className="reed-maze__player"
                            src={Caballero}
                            alt="Player marker"
                            width="28"
                            height="28"
                            loading="eager"
                            decoding="async"
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div
                className="reed-maze__hud standard-text blue-text"
                role="list"
                aria-label="Maze controls"
              >
                <p className="reed-maze__control-line" role="listitem">
                  <span className="reed-maze__keycap">Time Left</span>
                  <span>{secondsLeft}s</span>
                </p>
                <p className="reed-maze__control-line" role="listitem">
                  <span className="reed-maze__keycap">Arrow Keys</span>
                  <span>Retrace your steps</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChapterTwoAltState;
