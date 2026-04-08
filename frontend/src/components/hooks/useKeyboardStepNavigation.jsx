import { useEffect } from "react";

export const getStepNavigationPrompt = (currentStep) => {
  return currentStep > 0
    ? "Press C to continue and B to go back."
    : "Press C to continue.";
};

const useKeyboardStepNavigation = ({
  currentStep,
  steps,
  setCurrentStep,
  canContinue,
  canGoBack,
  onComplete,
  onStepKeyDown,
  blockNavigation,
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.tagName === "SELECT"
      ) {
        return;
      }

      if (blockNavigation?.()) {
        return;
      }

      const activeStep = steps[currentStep];
      const handledByStep = onStepKeyDown?.(event, activeStep, currentStep);
      if (handledByStep) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "c") {
        if (!canContinue(activeStep, currentStep)) {
          return;
        }

        if (currentStep >= steps.length - 1) {
          onComplete?.();
          return;
        }

        setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
      }

      if (key === "b" && currentStep > 0) {
        const canMoveBack = canGoBack ? canGoBack(activeStep, currentStep) : true;
        if (canMoveBack) {
          setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    blockNavigation,
    canContinue,
    canGoBack,
    currentStep,
    onComplete,
    onStepKeyDown,
    setCurrentStep,
    steps,
  ]);
};

export default useKeyboardStepNavigation;