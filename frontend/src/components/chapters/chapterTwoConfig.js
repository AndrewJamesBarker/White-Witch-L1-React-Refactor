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
    requiredKeys: Array.from({ length: 27 }, (_, index) => `safe-square-${index + 1}`),
    penaltyCause: "wrongMarshPath",
  },
  {
    id: "handoff",
    type: "narrative",
    title: "You survived!",
    body:
      "You're elated, but your new friend Grinn can only shake his head, casting a disparaging look upon the small village up ahead.",
    scene: "arkra-distance2",
  },
  {
    id: "find-e-crystal",
    type: "narrative",
    title: "You Found A Strange Crystal",
    body:
      "Half-buried in the mud, you notice a pale shard not much bigger than a little pebble or tiny gem. Its etched face resembles the letter E. You tuck it away with care into your satchel.",
    scene: "arkra-distance2",
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