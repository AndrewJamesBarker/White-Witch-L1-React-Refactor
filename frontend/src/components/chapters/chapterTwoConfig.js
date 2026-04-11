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
    body: "How do you interact with Grinn?",
    choices: [
      {
        id: "listen",
        label: "Lower your weapon and listen.",
        outcome: "complete-step",
      },
      {
        id: "charge",
        label: "Capture it!",
        outcome: "lose-life",
        cause: "marshCharge",
      },
    ],
  },
  {
    id: "grinn-guidance",
    type: "narrative",
    title: "Grinn Speaks",
    body: '"Grinn hungry. You feed Grinn. Grinn show you safe."',
    scene: "grinn",
  },
  {
    id: "reed-path",
    type: "sequence",
    title: "The Safe Path",
    body:
      "'The wind lifts, the reeds shift. Enantiodromia.'",
    requiredKeys: Array.from({ length: 25 }, (_, index) => `safe-square-${index + 1}`),
    penaltyCause: "wrongMarshPath",
  },
  {
    id: "handoff",
    type: "narrative",
    title: "You survived!",
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