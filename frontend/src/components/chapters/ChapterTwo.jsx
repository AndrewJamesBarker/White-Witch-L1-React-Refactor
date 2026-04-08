import React, { useEffect, useMemo, useState } from "react";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";
import MultipleChoiceButtons from "../ui/MultipleChoiceButtons";
import useKeyboardStepNavigation, {
  getStepNavigationPrompt,
} from "../hooks/useKeyboardStepNavigation";
import {
  chapterTwoSteps,
  isStepComplete,
} from "./chapterTwoConfig";
import Marsh from "../../assets/images/environment/Marsh1.webp";
import Grinn from "../../assets/images/portraits/Grinn.webp";

function ChapterTwo({
  currentStep,
  setCurrentStep,
  loseLife,
  setShowLifeLost,
  showHelp,
  showInventory,
  showLifeLost,
  resetSignal,
}) {
  const [grinnParallaxY, setGrinnParallaxY] = useState(0);
  const [grinnHoverY, setGrinnHoverY] = useState(0);
  const [isGrinnVisible, setIsGrinnVisible] = useState(false);
  const [choiceResults, setChoiceResults] = useState({});
  const [sequenceProgress, setSequenceProgress] = useState({});

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
    }
  }, [resetSignal, setCurrentStep]);

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
  };

  const handleStepKeyDown = (event, step) => {
    if (!step || step.type !== "sequence") {
      return false;
    }

    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      return false;
    }

    const currentProgress = sequenceProgress[step.id] || 0;
    const expectedKey = step.requiredKeys[currentProgress];

    if (event.key === expectedKey) {
      const updatedProgress = currentProgress + 1;
      setSequenceProgress((prev) => ({ ...prev, [step.id]: updatedProgress }));
      return true;
    }

    setSequenceProgress((prev) => ({ ...prev, [step.id]: 0 }));
    setShowLifeLost(true);
    loseLife(step.penaltyCause || "wrongSequence");
    return true;
  };

  useKeyboardStepNavigation({
    currentStep,
    steps: chapterTwoSteps,
    setCurrentStep,
    onStepKeyDown: handleStepKeyDown,
    blockNavigation: () => showHelp || showInventory || showLifeLost,
    canContinue: (step) => isStepComplete(step, progressionState),
  });

  const renderScene = (scene) => {
    if (scene !== "marsh" && scene !== "grinn") {
      return null;
    }

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
          src={Marsh}
          alt="A labyrinthine marshland vista."
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

      return (
        <p className="standard-text blue-text">
          Path progress: {progress}/{total}
        </p>
      );
    }

    return null;
  };

  return (
    <div id="ChapterTwoPage" className="width-control">
      <h2 id="headLine">{activeStep?.title || "Chapter Two"}</h2>
      <div className="cursorBox">
        {renderScene(activeStep?.scene)}

        <p id="bodyText" className="standard-text">
          {activeStep?.body}
        </p>

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

        <p className="bold-text blue-text">{getStepNavigationPrompt(currentStep)}</p>
      </div>
    </div>
  );
}

export default ChapterTwo;
