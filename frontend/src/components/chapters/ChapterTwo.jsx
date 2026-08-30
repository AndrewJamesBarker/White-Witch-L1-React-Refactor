import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";
import "./chapterTwoMaze.css";
import MultipleChoiceButtons from "../ui/MultipleChoiceButtons";
import useKeyboardStepNavigation, {
  getStepNavigationPrompt,
} from "../hooks/useKeyboardStepNavigation";
import {
  chapterTwoSteps,
  isStepComplete,
} from "./chapterTwoConfig";
import { useGameState } from "../../context/GameStateContext";
import {
  E_CRYSTAL,
  LEATHER_INSECT_POUCH,
  LEGACY_LEATHER_DRAWSTRING_POUCH,
} from "../utilities/itemKeys";
import Marsh from "../../assets/images/environment/Marsh1.webp";
import ArkraDistance2 from "../../assets/images/environment/Arkra-distance2.webp";
import Grinn from "../../assets/images/portraits/Grinn.webp";
import Caballero from "../../assets/images/ui-elements/Caballero.webp";
import ECrystal from "../../assets/images/inventory-items/Elitrye-Crystals/E-Crystal.png";
import {
  REED_MAZE_GRID,
  REED_ROUTE_POSITIONS,
  POSITION_BY_ARROW,
  positionsMatch,
  getPositionKey,
  getRouteIndexForPosition,
  REED_ROUTE_KEY_SET,
} from "./chapterTwoMazeData";

// Single-tile-wide snake path verified by backtracking search.
// 26 positions = 25 moves. 20 bugs → Grinn guides positions 0–20.
// Player solos positions 21–25 (5 moves alone).
//
// Grid visualisation (row 0 = top, row 7 = bottom):
//   col: 0  1  2  3  4  5  6  7
//   r0:  .  .  o  o  o  .  .  .
//   r1:  .  o  o  .  o  .  .  .
//   r2:  .  o  .  .  o  .  E  .
//   r3:  .  o  .  .  o  o  o  o
//   r4:  .  o  o  .  .  o  .  o
//   r5:  .  .  o  .  .  o  .  o
//   r6:  .  .  o  .  .  o  o  o
//   r7:  .  .  S  .  .  .  .  .
//
// Section A – Teaching  (0–9):  path climbs col 2, turns left to col 1, rises to row 1
// Section B – Learning  (10–19): crosses top, descends col 4, sweeps right to col 6–7 edge
// Section C – Solo      (20–25): right-edge climb from [6,7] up to goal [2,6]
const STARTING_BUG_COUNT = 10;
const MAZE_TIME_LIMIT_MS = 60000;
// Developer test flag: set true to reveal the full correct maze route.
const SHOW_FULL_ROUTE_DEBUG = false;
const POST_MAZE_STEP_IDS = new Set(["handoff", "find-e-crystal"]);

function ChapterTwo({
  currentStep,
  setCurrentStep,
  onComplete,
  loseLife,
  obtainItem,
  setShowLifeLost,
  showHelp,
  showInventory,
  showLifeLost,
  resetSignal,
}) {
  const { items } = useGameState();
  const hasInsectPouch =
    items.includes(LEATHER_INSECT_POUCH) ||
    items.includes(LEGACY_LEATHER_DRAWSTRING_POUCH);

  const [grinnParallaxY, setGrinnParallaxY] = useState(0);
  const [grinnHoverY, setGrinnHoverY] = useState(0);
  const [isGrinnVisible, setIsGrinnVisible] = useState(false);
  const [choiceResults, setChoiceResults] = useState({});
  const [sequenceProgress, setSequenceProgress] = useState({});
  const [bugCount, setBugCount] = useState(
    hasInsectPouch ? STARTING_BUG_COUNT : 0
  );
  const [mazeDeadline, setMazeDeadline] = useState(null);
  const [mazeTimeLeftMs, setMazeTimeLeftMs] = useState(MAZE_TIME_LIMIT_MS);
  const [grinnFeedFailed, setGrinnFeedFailed] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(REED_ROUTE_POSITIONS[0]);
  const [grinnTargetIndex, setGrinnTargetIndex] = useState(0);
  const hasSubmittedCompletion = useRef(false);

  const activeStep = chapterTwoSteps[currentStep];

  const progressionState = useMemo(
    () => ({ choiceResults, sequenceProgress }),
    [choiceResults, sequenceProgress]
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollOffset = Math.min(window.scrollY * 0.5, 260);
      setGrinnParallaxY(scrollOffset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    let animationFrameId;

    const animateHover = () => {
      const timeSeconds = performance.now() / 1000;
      const hoverOffset = Math.sin(timeSeconds * 2.2) * 5;
      setGrinnHoverY(hoverOffset);
      animationFrameId = window.requestAnimationFrame(animateHover);
    };

    animationFrameId = window.requestAnimationFrame(animateHover);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (activeStep?.scene !== "grinn") {
      setIsGrinnVisible(false);
      return;
    }

    setIsGrinnVisible(false);
    const timer = window.setTimeout(() => {
      setIsGrinnVisible(true);
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeStep?.scene]);

  useEffect(() => {
    if (resetSignal) {
      setCurrentStep(0);
      setChoiceResults({});
      setSequenceProgress({});
      setBugCount(hasInsectPouch ? STARTING_BUG_COUNT : 0);
      setMazeDeadline(null);
      setMazeTimeLeftMs(MAZE_TIME_LIMIT_MS);
      setGrinnFeedFailed(false);
      setPlayerPosition(REED_ROUTE_POSITIONS[0]);
      setGrinnTargetIndex(0);
      hasSubmittedCompletion.current = false;
    }
  }, [hasInsectPouch, resetSignal, setCurrentStep]);

  useEffect(() => {
    const isReedPathSequence =
      activeStep?.type === "sequence" && activeStep?.id === "reed-path";
    const finalPosition = REED_ROUTE_POSITIONS[REED_ROUTE_POSITIONS.length - 1];

    if (isReedPathSequence && positionsMatch(playerPosition, finalPosition)) {
      setSequenceProgress((prev) => ({
        ...prev,
        [activeStep.id]: activeStep.requiredKeys?.length || 0,
      }));
      setCurrentStep((prevStep) =>
        Math.min(prevStep + 1, chapterTwoSteps.length - 1)
      );
    }
  }, [
    playerPosition,
    activeStep?.id,
    activeStep?.requiredKeys,
    activeStep?.type,
    setCurrentStep,
  ]);

  useEffect(() => {
    if (
      activeStep?.id === "find-e-crystal" &&
      typeof obtainItem === "function" &&
      !hasSubmittedCompletion.current
    ) {
      hasSubmittedCompletion.current = true;
      const collectCrystalAndCompleteChapter = async () => {
        await obtainItem(E_CRYSTAL);
        await onComplete?.();
      };

      collectCrystalAndCompleteChapter();
    }
  }, [activeStep?.id, obtainItem, onComplete]);

  useEffect(() => {
    const isReedPathSequence =
      activeStep?.type === "sequence" && activeStep?.id === "reed-path";

    if (!isReedPathSequence) {
      setMazeDeadline(null);
      setMazeTimeLeftMs(MAZE_TIME_LIMIT_MS);
      setGrinnFeedFailed(false);
      setPlayerPosition(REED_ROUTE_POSITIONS[0]);
      setGrinnTargetIndex(0);
      return;
    }

    setBugCount(hasInsectPouch ? STARTING_BUG_COUNT : 0);
    setMazeDeadline(Date.now() + MAZE_TIME_LIMIT_MS);
    setMazeTimeLeftMs(MAZE_TIME_LIMIT_MS);
    setGrinnFeedFailed(false);
    setPlayerPosition(REED_ROUTE_POSITIONS[0]);
    setGrinnTargetIndex(0);
    setSequenceProgress((prev) => ({ ...prev, [activeStep.id]: 0 }));
  }, [activeStep?.id, activeStep?.type, hasInsectPouch]);

  useEffect(() => {
    const isReedPathSequence =
      activeStep?.type === "sequence" && activeStep?.id === "reed-path";

    if (
      !isReedPathSequence ||
      !mazeDeadline ||
      showHelp ||
      showInventory ||
      showLifeLost ||
      grinnFeedFailed
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, mazeDeadline - Date.now());
      setMazeTimeLeftMs(remaining);

      if (remaining <= 0) {
        setGrinnFeedFailed(true);
        setShowLifeLost(true);
        loseLife("grinnUnfed");
      }
    }, 100);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    activeStep?.id,
    activeStep?.type,
    grinnFeedFailed,
    hasInsectPouch,
    loseLife,
    mazeDeadline,
    setShowLifeLost,
    showHelp,
    showInventory,
    showLifeLost,
  ]);

  const handleChoiceSelect = (choice) => {
    if (!activeStep || activeStep.type !== "choice") {
      return;
    }

    if (choice.outcome === "lose-life") {
      setShowLifeLost(true);
      loseLife(choice.cause || "badChoice");
      setChoiceResults((prev) => ({
        ...prev,
        [activeStep.id]: { choiceId: choice.id, isSuccess: false },
      }));
      return;
    }

    setChoiceResults((prev) => ({
      ...prev,
      [activeStep.id]: {
        choiceId: choice.id,
        isSuccess: choice.outcome === "complete-step",
      },
    }));

    if (choice.outcome === "complete-step") {
      setCurrentStep((prevStep) =>
        Math.min(prevStep + 1, chapterTwoSteps.length - 1)
      );
    }
  };

  const handleStepKeyDown = (event, step) => {
    if (!step || step.type !== "sequence") {
      return false;
    }

    const finalSafeIndex = REED_ROUTE_POSITIONS.length - 1;

    if (event.key.toLowerCase() === "f") {
      if (grinnFeedFailed) {
        return true;
      }

      if (grinnTargetIndex > finalSafeIndex) {
        return true;
      }

      const playerRouteIndex = getRouteIndexForPosition(playerPosition);

      if (playerRouteIndex < 0 || playerRouteIndex >= finalSafeIndex) {
        return true;
      }

      if (bugCount <= 0) {
        setGrinnFeedFailed(true);
        setShowLifeLost(true);
        loseLife(hasInsectPouch ? "grinnOutOfBugs" : "missingInsectPouch");
        return true;
      }

      const updatedBugCount = bugCount - 1;
      const nextGuidedIndex = Math.min(playerRouteIndex + 1, finalSafeIndex);

      setBugCount(updatedBugCount);
      setGrinnTargetIndex(nextGuidedIndex);

      if (updatedBugCount <= 0) {
        setGrinnFeedFailed(true);
        setShowLifeLost(true);
        loseLife(hasInsectPouch ? "grinnOutOfBugs" : "missingInsectPouch");
      }

      return true;
    }

    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      return false;
    }

    const [rowDelta, colDelta] = POSITION_BY_ARROW[event.key] || [0, 0];
    const nextPosition = [
      playerPosition[0] + rowDelta,
      playerPosition[1] + colDelta,
    ];
    const nextRow = nextPosition[0];
    const nextCol = nextPosition[1];
    const targetPosition = REED_ROUTE_POSITIONS[grinnTargetIndex];

    const isInsideMaze =
      nextRow >= 0 &&
      nextRow < REED_MAZE_GRID.length &&
      nextCol >= 0 &&
      nextCol < REED_MAZE_GRID[0].length;
    const isWalkable = isInsideMaze && REED_MAZE_GRID[nextRow][nextCol] === 0;
    const isRouteSquare = REED_ROUTE_KEY_SET.has(getPositionKey(nextPosition));

    if (!isWalkable || !isRouteSquare) {
      setSequenceProgress((prev) => ({ ...prev, [step.id]: 0 }));
      setShowLifeLost(true);
      loseLife(
        hasInsectPouch ? step.penaltyCause || "wrongSequence" : "missingInsectPouch"
      );
      return true;
    }

    setPlayerPosition(nextPosition);

    if (positionsMatch(nextPosition, targetPosition)) {
      setSequenceProgress((prev) => ({
        ...prev,
        [step.id]: Math.max(prev[step.id] || 0, grinnTargetIndex),
      }));
    }

    return true;
  };

  useKeyboardStepNavigation({
    currentStep,
    steps: chapterTwoSteps,
    setCurrentStep,
    onStepKeyDown: handleStepKeyDown,
    blockNavigation: () => showHelp || showInventory || showLifeLost,
    canContinue: (step) => isStepComplete(step, progressionState),
    canGoBack: (step) => !POST_MAZE_STEP_IDS.has(step?.id),
  });

  const renderScene = (scene) => {
    if (scene !== "marsh" && scene !== "grinn" && scene !== "arkra-distance2") {
      return null;
    }

    const backgroundImage = scene === "arkra-distance2" ? ArkraDistance2 : Marsh;
    const backgroundAlt =
      scene === "arkra-distance2"
        ? "A distant view of Arkra on the horizon."
        : "A labyrinthine marshland vista.";

    return (
      <div
        style={{
          position: "relative",
          width: "98%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <img
          className="environImage"
          src={backgroundImage}
          alt={backgroundAlt}
          width="500"
          height="500"
          loading="eager"
          decoding="async"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />

        {scene === "grinn" && (
          <img
            src={Grinn}
            alt="Grinn watching from the marsh foreground."
            width="168"
            height="168"
            loading="eager"
            decoding="async"
            style={{
              position: "absolute",
              left: "50%",
              top: "18%",
              width: "168px",
              height: "168px",
              zIndex: 30,
              filter: "drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35))",
              opacity: isGrinnVisible ? 1 : 0,
              transition: "opacity 2200ms ease-out",
              transform: `translate(-50%, ${-84 + grinnParallaxY + grinnHoverY}px)`,
            }}
          />
        )}
      </div>
    );
  };

  const renderStepStatus = () => {
    if (!activeStep || activeStep.type === "narrative") {
      return null;
    }

    if (activeStep.type === "choice") {
      const choiceState = choiceResults[activeStep.id];

      if (!choiceState) {
        return (
          <p className="standard-text">
            Choose an action to unlock continue.
          </p>
        );
      }

      if (!choiceState.isSuccess) {
        return (
          <p className="standard-text blue-text">
            That choice does not complete this step. Try another approach.
          </p>
        );
      }

      return (
        <p className="standard-text blue-text">
          Choice accepted. Press C to continue.
        </p>
      );
    }

    if (activeStep.type === "sequence") {
      const progress = sequenceProgress[activeStep.id] || 0;
      const total = activeStep.requiredKeys.length;
      const secondsLeft = Math.ceil(mazeTimeLeftMs / 1000);
      const grinnPosition =
        REED_ROUTE_POSITIONS[Math.min(grinnTargetIndex, REED_ROUTE_POSITIONS.length - 1)];
      const goalPosition = REED_ROUTE_POSITIONS[REED_ROUTE_POSITIONS.length - 1];
      const allRouteKeys = new Set(REED_ROUTE_POSITIONS.map(getPositionKey));
      const revealedSafeKeys = new Set(
        REED_ROUTE_POSITIONS.slice(0, grinnTargetIndex + 1).map(getPositionKey)
      );
      const visitedSafeKeys = new Set(
        REED_ROUTE_POSITIONS
          .slice(0, Math.min(progress, REED_ROUTE_POSITIONS.length - 1) + 1)
          .map(getPositionKey)
      );

      return (
        <div className="reed-maze__panel">
          <div className="reed-maze__frame">
            <div className="reed-maze" aria-label="Reed maze preview">
            {REED_MAZE_GRID.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isWall = cell === 1;
                const isPath = !isWall;
                const isGoal = rowIndex === goalPosition[0] && colIndex === goalPosition[1];
                const isPlayer = rowIndex === playerPosition[0] && colIndex === playerPosition[1];
                const isGrinnTarget = rowIndex === grinnPosition[0] && colIndex === grinnPosition[1];
                const tileKey = `${rowIndex}-${colIndex}`;
                const isRouteTile = allRouteKeys.has(tileKey);
                const isRevealedSafe = SHOW_FULL_ROUTE_DEBUG
                  ? isRouteTile
                  : revealedSafeKeys.has(tileKey);
                const isVisitedSafe = visitedSafeKeys.has(tileKey) && !isPlayer;
                const isHiddenTile = isPath && !isRevealedSafe && !isPlayer && !isGrinnTarget;
                const tileClasses = [
                  "reed-maze__cell",
                  isWall ? "reed-maze__cell--wall" : "reed-maze__cell--path",
                  isHiddenTile ? "reed-maze__cell--hidden" : "",
                  isRouteTile ? "reed-maze__cell--route" : "",
                  isRevealedSafe ? "reed-maze__cell--revealed" : "",
                  isVisitedSafe ? "reed-maze__cell--visited" : "",
                  isGoal ? "reed-maze__cell--goal" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={tileKey}
                    className={tileClasses}
                  >
                    {isPath && <span className="reed-maze__tile-sheen" aria-hidden="true" />}
                    {isHiddenTile && <span className="reed-maze__mist" aria-hidden="true" />}
                    {isRevealedSafe && <span className="reed-maze__rune" aria-hidden="true" />}
                    {isGoal && <span className="reed-maze__goal-glyph" aria-hidden="true" />}
                    {isGrinnTarget && isPath && (
                      <img
                        className="reed-maze__grinn"
                        src={Grinn}
                        alt="Grinn safe marker"
                        width="28"
                        height="28"
                        loading="eager"
                        decoding="async"
                      />
                    )}
                    {isPlayer && isPath && (
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

            <div className="reed-maze__hud standard-text blue-text" role="list" aria-label="Maze controls">
              <p className="reed-maze__control-line" role="listitem">
                <span className="reed-maze__keycap">Insects</span>
                <span key={bugCount} className="reed-maze__bug-count">{bugCount}</span>
              </p>
              <p className="reed-maze__control-line" role="listitem">
                <span className="reed-maze__keycap">Safe Moves</span>
                <span>{progress}/{total}</span>
              </p>
              <p className="reed-maze__control-line" role="listitem">
                <span className="reed-maze__keycap">Time Left</span>
                <span>{secondsLeft}s</span>
              </p>
              <p className="reed-maze__control-line" role="listitem">
                <span className="reed-maze__keycap">Arrow Keys</span>
                <span>Move</span>
              </p>
              <p className="reed-maze__control-line" role="listitem">
                <span className="reed-maze__keycap">F Key</span>
                <span>Feed Grinn</span>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div id="ChapterTwoPage" className="width-control">
      <h2 id="headLine" className="bold-text">{activeStep?.title || "Chapter Two"}</h2>
      <div className="cursorBox">
        {renderScene(activeStep?.scene)}

        <p id="bodyText" className="standard-text">
          {activeStep?.body}
        </p>

        {activeStep?.id === "find-e-crystal" && (
          <img
            src={ECrystal}
            alt="A tiny E crystal, no bigger than a small pebble"
            width="160"
            height="160"
            loading="eager"
            decoding="async"
            className="center imageMaterialize"
          />
        )}

        {activeStep?.type === "choice" && (
          <MultipleChoiceButtons
            choices={activeStep.choices.map((choice) => ({
              label: choice.label,
              value: choice.id,
              ...choice,
            }))}
            onChoiceSelect={handleChoiceSelect}
          />
        )}

        {renderStepStatus()}

        {activeStep?.id === "find-e-crystal" ? (
          <p className="bold-text white-text">
            Return to the <span className="blue-text">Dashboard</span> to begin Chapter Three.
          </p>
        ) : activeStep?.id !== "reed-path" && (
          <p className="bold-text white-text">
            Press <span className="blue-text">C</span> to continue
            {currentStep > 0 && !POST_MAZE_STEP_IDS.has(activeStep?.id) && (
              <>
                {" "}and <span className="blue-text">B</span> to go back
              </>
            )}
            .
          </p>
        )}
      </div>
    </div>
  );
}

export default ChapterTwo;
