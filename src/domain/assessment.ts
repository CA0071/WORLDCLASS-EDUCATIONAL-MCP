export function generateExamPaper(subject: string, marks: number): { sections: { name: string; marks: number }[] } {
  return {
    sections: [
      { name: `${subject} Section A (Short questions)`, marks: Math.round(marks * 0.3) },
      { name: `${subject} Section B (Structured questions)`, marks: Math.round(marks * 0.4) },
      { name: `${subject} Section C (Extended response)`, marks: Math.round(marks * 0.3) },
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
