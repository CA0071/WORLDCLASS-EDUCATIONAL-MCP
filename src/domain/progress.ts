import type { D1DatabaseInterface } from "../db/types";

export interface ProgressRecord {
  studentId: string;
  subject: string;
  score: number;
}

export interface ProgressHistoryEntry extends ProgressRecord {
  recordedAt: string;
}

export interface ClassDashboard {
  subject: string;
  totalRecords: number;
  average: number;
  riskDistribution: { onTrack: number; watch: number; highSupport: number };
}

export async function persistStudentProgress(record: ProgressRecord, db?: D1DatabaseInterface): Promise<ProgressRecord> {
  if (db) {
    await db
      .prepare("INSERT INTO student_progress (student_id, subject, score) VALUES (?, ?, ?)")
      .bind(record.studentId, record.subject, record.score)
      .run();
  }
  return record;
}

export function recordStudentProgress(record: ProgressRecord): ProgressRecord {
  return record;
}

export async function fetchStudentProgressHistory(
  studentId: string,
  db: D1DatabaseInterface,
  subject?: string,
): Promise<ProgressHistoryEntry[]> {
  type Row = { student_id: string; subject: string; score: number; recorded_at: string };
  const stmt =
    subject !== undefined
      ? db
          .prepare(
            "SELECT student_id, subject, score, recorded_at FROM student_progress WHERE student_id = ? AND subject = ? ORDER BY recorded_at DESC LIMIT 100",
          )
          .bind(studentId, subject)
      : db
          .prepare(
            "SELECT student_id, subject, score, recorded_at FROM student_progress WHERE student_id = ? ORDER BY recorded_at DESC LIMIT 100",
          )
          .bind(studentId);

  const result = await stmt.all<Row>();
  return result.results.map((row) => ({
    studentId: row.student_id,
    subject: row.subject,
    score: row.score,
    recordedAt: row.recorded_at,
  }));
}

export async function fetchClassDashboard(db: D1DatabaseInterface, subject?: string): Promise<ClassDashboard> {
  type Row = {
    subject: string;
    total: number;
    avg_score: number | null;
    on_track: number;
    watch: number;
    high_support: number;
  };
  const stmt =
    subject !== undefined
      ? db
          .prepare(
            "SELECT subject, COUNT(*) AS total, AVG(score) AS avg_score, SUM(CASE WHEN score >= 70 THEN 1 ELSE 0 END) AS on_track, SUM(CASE WHEN score >= 50 AND score < 70 THEN 1 ELSE 0 END) AS watch, SUM(CASE WHEN score < 50 THEN 1 ELSE 0 END) AS high_support FROM student_progress WHERE subject = ? GROUP BY subject",
          )
          .bind(subject)
      : db.prepare(
          "SELECT 'all' AS subject, COUNT(*) AS total, AVG(score) AS avg_score, SUM(CASE WHEN score >= 70 THEN 1 ELSE 0 END) AS on_track, SUM(CASE WHEN score >= 50 AND score < 70 THEN 1 ELSE 0 END) AS watch, SUM(CASE WHEN score < 50 THEN 1 ELSE 0 END) AS high_support FROM student_progress",
        );

  const row = await stmt.first<Row>();

  if (!row) {
    return {
      subject: subject ?? "all",
      totalRecords: 0,
      average: 0,
      riskDistribution: { onTrack: 0, watch: 0, highSupport: 0 },
    };
  }

  return {
    subject: row.subject,
    totalRecords: row.total,
    average: Number((row.avg_score ?? 0).toFixed(2)),
    riskDistribution: {
      onTrack: row.on_track,
      watch: row.watch,
      highSupport: row.high_support,
    },
  };
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
