import { allocateByWeights } from "./allocation.js";

export function lessonPlanGenerator(topic: string, durationMinutes: number): { objectives: string[]; flow: string[] } {
  const [starterMinutes, instructionMinutes, guidedPracticeMinutes, exitTicketMinutes]: [
    number,
    number,
    number,
    number,
  ] =
    durationMinutes >= 35
      ? [10, durationMinutes - 25, 10, 5]
      : (allocateByWeights(durationMinutes, [10 / 35, 10 / 35, 10 / 35, 5 / 35]) as [number, number, number, number]);

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
