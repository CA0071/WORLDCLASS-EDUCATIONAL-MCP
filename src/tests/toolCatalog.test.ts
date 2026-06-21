import test from "node:test";
import assert from "node:assert/strict";
import { getToolByName, TOOL_CATALOG } from "../tools/catalog";

test("tool catalog has required baseline tools", () => {
  assert.ok(TOOL_CATALOG.length >= 24);
  const required = [
    "list_curriculum_frameworks",
    "create_study_plan",
    "solve_math_stepwise",
    "record_student_progress",
    "dyslexia_friendly_format",
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
