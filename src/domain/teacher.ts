function allocateSegmentMinutes(
  totalMinutes: number,
  baseSegments: [number, number, number, number],
): [number, number, number, number] {
  const totalBaseMinutes = baseSegments.reduce((sum, minutes) => sum + minutes, 0);
  const rawAllocations = baseSegments.map((minutes) => (minutes / totalBaseMinutes) * totalMinutes);
  const floorAllocations = rawAllocations.map((minutes) => Math.floor(minutes));
  const remainder = totalMinutes - floorAllocations.reduce((sum, minutes) => sum + minutes, 0);

  const rankedRemainders = rawAllocations
    .map((minutes, index) => ({ index, remainder: minutes - floorAllocations[index]! }))
    .sort((first, second) => second.remainder - first.remainder);

  for (const allocation of rankedRemainders.slice(0, remainder)) {
    floorAllocations[allocation.index] = floorAllocations[allocation.index]! + 1;
  }

  return [floorAllocations[0]!, floorAllocations[1]!, floorAllocations[2]!, floorAllocations[3]!];
}

export function lessonPlanGenerator(topic: string, durationMinutes: number): { objectives: string[]; flow: string[] } {
  const [starterMinutes, instructionMinutes, guidedPracticeMinutes, exitTicketMinutes]: [
    number,
    number,
    number,
    number,
  ] =
    durationMinutes >= 35
      ? [10, durationMinutes - 25, 10, 5]
      : allocateSegmentMinutes(durationMinutes, [10, 10, 10, 5]);

  return {
    objectives: [
      `Introduce ${topic} concepts`,
      `Guide active practice in ${topic}`,
      `Assess understanding of ${topic}`,
    ],
    flow: [
      `Starter (${starterMinutes} min)`,
      `Instruction (${instructionMinutes} min)`,
      `Guided practice (${guidedPracticeMinutes} min)`,
      `Exit ticket (${exitTicketMinutes} min)`,
    ],
  };
}

export function classroomActivityGenerator(topic: string): string[] {
  return [
    `${topic} think-pair-share`,
    `${topic} station rotation`,
    `${topic} peer feedback challenge`,
  ];
}
