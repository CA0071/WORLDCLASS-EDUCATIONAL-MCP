import test from "node:test";
import assert from "node:assert/strict";
import { getToolByName, TOOL_CATALOG } from "../tools/catalog";

test("tool catalog has required baseline tools", () => {
  assert.ok(TOOL_CATALOG.length >= 26);
  const required = [
    "list_curriculum_frameworks",
    "create_study_plan",
    "solve_math_stepwise",
    "record_student_progress",
    "dyslexia_friendly_format",
    "get_student_progress_history",
    "teacher_dashboard",
  ];
  required.forEach((name) => assert.ok(getToolByName(name), `${name} should exist`));
});

test("create_study_plan validation rejects invalid week count", () => {
  const tool = getToolByName("create_study_plan");
  assert.ok(tool);
  const invalid = tool.inputSchema.safeParse({ topic: "Math", weeks: 0, country: "ZA", locale: "en-ZA" });
  assert.equal(invalid.success, false);
});

test("record_student_progress is flagged destructive", () => {
  const tool = getToolByName("record_student_progress");
  assert.ok(tool);
  assert.equal(tool.destructive, true);
  assert.equal(tool.requiredRole, "teacher");
});

test("get_student_progress_history requires teacher role", () => {
  const tool = getToolByName("get_student_progress_history");
  assert.ok(tool);
  assert.equal(tool.requiredRole, "teacher");
});

test("get_student_progress_history returns stub result when db is absent", async () => {
  const tool = getToolByName("get_student_progress_history");
  assert.ok(tool);
  const result = await tool.execute({ studentId: "s1", locale: "en-ZA", country: "ZA", language: "English" }, { role: "teacher" });
  assert.deepEqual((result as { history: unknown[] }).history, []);
});

test("teacher_dashboard requires teacher role", () => {
  const tool = getToolByName("teacher_dashboard");
  assert.ok(tool);
  assert.equal(tool.requiredRole, "teacher");
});

test("teacher_dashboard returns stub result when db is absent", async () => {
  const tool = getToolByName("teacher_dashboard");
  assert.ok(tool);
  const result = await tool.execute({ locale: "en-ZA", country: "ZA", language: "English" }, { role: "teacher" });
  assert.equal((result as { dashboard: null }).dashboard, null);
});

test("record_student_progress persists and returns record without db", async () => {
  const tool = getToolByName("record_student_progress");
  assert.ok(tool);
  const result = await tool.execute(
    { studentId: "learner1", subject: "Mathematics", score: 75, locale: "en-ZA", country: "ZA", language: "English" },
    { role: "teacher" },
  );
  const saved = (result as { saved: { studentId: string; subject: string; score: number } }).saved;
  assert.equal(saved.studentId, "learner1");
  assert.equal(saved.score, 75);
});
