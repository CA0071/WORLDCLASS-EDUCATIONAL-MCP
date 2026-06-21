export function createStudyPlan(topic: string, weeks: number): { week: number; focus: string }[] {
  return Array.from({ length: weeks }, (_, index) => ({
    week: index + 1,
    focus: `Week ${index + 1}: ${topic} mastery checkpoint`,
  }));
}

export function spacedRepetitionSchedule(startDate: string, sessions: number): string[] {
  const base = new Date(startDate);
  const intervals = [1, 3, 7, 14, 30, 45, 60, 90];
  const fallbackInterval = intervals.at(-1) ?? 90;
  return Array.from({ length: sessions }, (_, index) => {
    const clone = new Date(base);
    const dayOffset = intervals[index] ?? fallbackInterval + (index - intervals.length + 1) * 14;
    clone.setDate(clone.getDate() + dayOffset);
    return clone.toISOString().slice(0, 10);
  });
}

export function generateRevisionPack(subject: string, grade: string): { flashcards: string[]; examTips: string[] } {
  return {
    flashcards: [
      `${subject} key term 1 (Grade ${grade})`,
      `${subject} key term 2 (Grade ${grade})`,
      `${subject} key term 3 (Grade ${grade})`,
    ],
    examTips: [
      "Start with easier questions to build confidence.",
      "Use worked examples from past papers.",
      "Review errors and convert them into practice prompts.",
    ],
  };
}
