function allocateIntegerTotals(total: number, weights: [number, number, number]): [number, number, number] {
  const rawAllocations = weights.map((weight) => total * weight);
  const floorAllocations = rawAllocations.map((value) => Math.floor(value));
  const remainder = total - floorAllocations.reduce((sum, value) => sum + value, 0);

  const rankedRemainders = rawAllocations
    .map((value, index) => ({ index, remainder: value - floorAllocations[index]! }))
    .sort((first, second) => second.remainder - first.remainder);

  for (const allocation of rankedRemainders.slice(0, remainder)) {
    floorAllocations[allocation.index] = floorAllocations[allocation.index]! + 1;
  }

  return [floorAllocations[0]!, floorAllocations[1]!, floorAllocations[2]!];
}

export function generateExamPaper(subject: string, marks: number): { sections: { name: string; marks: number }[] } {
  const [sectionAMarks, sectionBMarks, sectionCMarks] = allocateIntegerTotals(marks, [0.3, 0.4, 0.3]);
  return {
    sections: [
      { name: `${subject} Section A (Short questions)`, marks: sectionAMarks },
      { name: `${subject} Section B (Structured questions)`, marks: sectionBMarks },
      { name: `${subject} Section C (Extended response)`, marks: sectionCMarks },
    ],
  };
}

export function generateAssignment(topic: string): { title: string; tasks: string[] } {
  return {
    title: `${topic} assignment brief`,
    tasks: ["Research task", "Applied activity", "Reflection question"],
  };
}

export function rubricGenerator(criteria: string[]): Array<{ criterion: string; levels: string[] }> {
  return criteria.map((criterion) => ({
    criterion,
    levels: ["Emerging", "Developing", "Proficient", "Advanced"],
  }));
}

export function markSchemeGenerator(questionCount: number): Array<{ question: number; guidance: string }> {
  return Array.from({ length: questionCount }, (_, i) => ({
    question: i + 1,
    guidance: `Marking guidance for question ${i + 1}`,
  }));
}
