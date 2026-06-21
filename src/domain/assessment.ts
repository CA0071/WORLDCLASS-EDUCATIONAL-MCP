import { allocateByWeights } from "./allocation.js";

export function generateExamPaper(subject: string, marks: number): { sections: { name: string; marks: number }[] } {
  const [sectionAMarks, sectionBMarks, sectionCMarks] = allocateByWeights(marks, [0.3, 0.4, 0.3] as const);
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
