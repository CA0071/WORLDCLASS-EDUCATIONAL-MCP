export function simplifyTextForLevel(text: string, level: string): string {
  return `[${level}] ${text}`;
}

export function dyslexiaFriendlyFormat(text: string): { text: string; recommendations: string[] } {
  return {
    text,
    recommendations: [
      "Use sans-serif font (e.g., OpenDyslexic or Arial).",
      "Increase line spacing to 1.5.",
      "Avoid long justified paragraphs.",
    ],
  };
}
