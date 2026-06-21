export interface ProgressRecord {
  studentId: string;
  subject: string;
  score: number;
}

export function recordStudentProgress(record: ProgressRecord): ProgressRecord {
  return record;
}

export function identifyLearningGaps(scores: Array<{ topic: string; score: number }>): string[] {
  return scores.filter((entry) => entry.score < 50).map((entry) => entry.topic);
}

export function recommendInterventions(gaps: string[]): string[] {
  if (!gaps.length) {
    return ["Continue enrichment tasks and peer teaching opportunities."];
  }
  return gaps.map((gap) => `Intervention: targeted remediation for ${gap}`);
}

export function classProgressSummary(scores: number[]): { average: number; riskBand: string } {
  const average = scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  const riskBand = average >= 70 ? "on_track" : average >= 50 ? "watch" : "high_support";
  return { average: Number(average.toFixed(2)), riskBand };
}
