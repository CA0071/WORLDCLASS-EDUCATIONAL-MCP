function allocateSegmentMinutes(totalMinutes: number, baseSegments: number[]): number[] {
  const totalBaseMinutes = baseSegments.reduce((sum, minutes) => sum + minutes, 0);
  const rawAllocations = baseSegments.map((minutes) => (minutes / totalBaseMinutes) * totalMinutes);
  const floorAllocations = rawAllocations.map((minutes) => Math.floor(minutes));
  let remainder = totalMinutes - floorAllocations.reduce((sum, minutes) => sum + minutes, 0);

  const rankedRemainders = rawAllocations
    .map((minutes, index) => ({ index, remainder: minutes - floorAllocations[index]! }))
    .sort((left, right) => right.remainder - left.remainder);

  for (let i = 0; i < remainder; i++) {
    const allocation = rankedRemainders[i % rankedRemainders.length]!;
    floorAllocations[allocation.index] = floorAllocations[allocation.index]! + 1;
  }

  return floorAllocations;
}

export function lessonPlanGenerator(topic: string, durationMinutes: number): { objectives: string[]; flow: string[] } {
  const [starterMinutes, instructionMinutes, guidedPracticeMinutes, exitTicketMinutes] =
    durationMinutes >= 35 ? [10, durationMinutes - 25, 10, 5] : allocateSegmentMinutes(durationMinutes, [10, 10, 10, 5]);

  return {
    objectives: [
      `Introduce ${topic} concepts`,
      `Guide active practice in ${topic}`,
      `Assess understanding of ${topic}`,
    ],
    flow: [
      `Starter (${starterMinutes ?? 0} min)`,
      `Instruction (${instructionMinutes ?? 0} min)`,
      `Guided practice (${guidedPracticeMinutes ?? 0} min)`,
      `Exit ticket (${exitTicketMinutes ?? 0} min)`,
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
