export function languageReadingPassage(topic: string, language: string): string {
  return `${language} reading passage about ${topic} with localised African context references.`;
}

export function languageComprehensionQuestions(topic: string): string[] {
  return [
    `What is the main idea of the ${topic} passage?`,
    `Which detail best supports the central message about ${topic}?`,
    `How can the lesson from ${topic} be applied in your community?`,
  ];
}

export function grammarPracticeGenerator(focus: string): string[] {
  return [
    `Rewrite the sentence using correct ${focus}.`,
    `Identify and correct the ${focus} error.`,
    `Create a short paragraph demonstrating ${focus}.`,
  ];
}
