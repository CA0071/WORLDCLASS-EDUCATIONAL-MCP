export function lessonPlanGenerator(topic: string, durationMinutes: number): { objectives: string[]; flow: string[] } {
  return {
    objectives: [
      `Introduce ${topic} concepts`,
      `Guide active practice in ${topic}`,
      `Assess understanding of ${topic}`,
    ],
    flow: [
      `Starter (10 min)`,
      `Instruction (${Math.max(durationMinutes - 25, 10)} min)`,
      "Guided practice (10 min)",
      "Exit ticket (5 min)",
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
