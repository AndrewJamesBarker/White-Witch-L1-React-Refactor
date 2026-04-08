export const chapterTwoSteps = [
  {
    id: "intro",
    type: "narrative",
    title: "Chapter Two: The Fields",
    body:
      "The marsh breathes in quiet pulses around you.",
    scene: "marsh",
  },
  {
    id: "grinn-appears",
    type: "narrative",
    title: "A Watcher In The Reeds",
    body: "Grinn materializes into view and studies you in silence.",
    scene: "grinn",
  },
  {
    id: "approach-choice",
    type: "choice",
    title: "Choose Your Approach",
    body: "How do you respond to Grinn?",
    choices: [
      {
        id: "listen",
        label: "Lower your weapon and listen.",
        outcome: "complete-step",
      },
      {
        id: "charge",
        label: "Charge through the reeds.",
        outcome: "lose-life",
        cause: "marshCharge",
      },
      {
        id: "wait",
        label: "Stay still and observe.",
        outcome: "no-progress",
      },
    ],
  },
  {
    id: "reed-path",
    type: "sequence",
    title: "Trace The Safe Path",
    body:
      "Use arrow keys to follow Grinn's route through the reed maze in order: Up, Right, Down.",
    requiredKeys: ["ArrowUp", "ArrowRight", "ArrowDown"],
    penaltyCause: "wrongMarshPath",
  },
  {
    id: "handoff",
    type: "narrative",
    title: "Path Secured",
    body:
      "You prove your discipline, and Grinn nods toward the deeper marsh. Press C to finish this scaffolded sequence.",
    scene: "marsh",
  },
];

export const isStepComplete = (step, state) => {
  if (!step) {
    return false;
  }

  if (step.type === "narrative") {
    return true;
  }

  if (step.type === "choice") {
    return Boolean(state.choiceResults[step.id]?.isSuccess);
  }

  if (step.type === "sequence") {
    return (
      (state.sequenceProgress[step.id] || 0) >= (step.requiredKeys?.length || 0)
    );
  }

  return false;
};