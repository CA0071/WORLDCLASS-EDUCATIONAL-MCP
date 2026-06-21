import test from "node:test";
import assert from "node:assert/strict";
import { generateExamPaper } from "../domain/assessment.js";
import { lessonPlanGenerator } from "../domain/teacher.js";
import { handleMcpRequest } from "../server/mcpServer.js";
import { verifyToken } from "../security/auth.js";
import { getToolByName, TOOL_CATALOG } from "../tools/catalog.js";

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

test("handleMcpRequest initialize returns MCP-compliant handshake shape", async () => {
  const response = await handleMcpRequest(
    new Request("https://example.com/mcp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: "init-1", method: "initialize" }),
    }),
    { ENVIRONMENT: "development" },
  );

  assert.equal(response.status, 200);
  const body = (await response.json()) as {
    result: {
      protocolVersion: string;
      serverInfo: { name: string; version: string };
      capabilities: { tools: Record<string, never> };
    };
  };
  assert.equal(body.result.protocolVersion, "2024-11-05");
  assert.equal(body.result.serverInfo.name, "schoolme101-mcp");
  assert.deepEqual(body.result.capabilities.tools, {});
});

test("record_student_progress requires teacher role without approval gate", () => {
  const tool = getToolByName("record_student_progress");
  assert.ok(tool);
  assert.equal(tool.destructive, undefined);
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
  const saved = (result as { saved: { studentId: string; subject: string; score: number; persisted: boolean } }).saved;
  assert.equal(saved.studentId, "learner1");
  assert.equal(saved.score, 75);
  assert.equal(saved.persisted, false);
});

test("verifyToken preserves user id for development stub tokens", async () => {
  const auth = await verifyToken("teacher-7:teacher", { ENVIRONMENT: "development" });
  assert.equal(auth.userId, "teacher-7");
  assert.equal(auth.role, "teacher");
});

test("verifyToken rejects development stub tokens outside explicit development environments", async () => {
  await assert.rejects(() => verifyToken("attacker:admin", {}), /JWT_SECRET is required unless ENVIRONMENT is development/i);
});

test("verifyToken ignores auth bypass token in production", async () => {
  await assert.rejects(
    () => verifyToken("dev-admin-token", { ENVIRONMENT: "production", AUTH_BYPASS_TOKEN: "dev-admin-token" }),
    /JWT_SECRET is required unless ENVIRONMENT is development/i,
  );
});

test("handleMcpRequest allows teacher progress recording without approval code", async () => {
  const authorization = ["Bearer", "teacher-1:teacher"].join(" ");
  const response = await handleMcpRequest(
    new Request("https://example.com/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "progress-1",
        method: "tools/call",
        params: {
          name: "record_student_progress",
          arguments: {
            studentId: "learner1",
            subject: "Mathematics",
            score: 75,
            locale: "en-ZA",
            country: "ZA",
            language: "English",
          },
        },
      }),
    }),
    { ENVIRONMENT: "development" },
  );

  assert.equal(response.status, 200);
  const body = (await response.json()) as { result: { content: Array<{ json: { saved: { studentId: string; score: number } } }> } };
  assert.equal(body.result.content[0]?.json.saved.studentId, "learner1");
  assert.equal(body.result.content[0]?.json.saved.score, 75);
});

test("handleMcpRequest returns 403 when role is insufficient", async () => {
  const authorization = ["Bearer", "student-1:student"].join(" ");
  const response = await handleMcpRequest(
    new Request("https://example.com/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "dashboard-1",
        method: "tools/call",
        params: {
          name: "teacher_dashboard",
          arguments: {
            locale: "en-ZA",
            country: "ZA",
            language: "English",
          },
        },
      }),
    }),
    { ENVIRONMENT: "development" },
  );

  assert.equal(response.status, 403);
});

test("list_curriculum_frameworks returns all frameworks when country is omitted", async () => {
  const tool = getToolByName("list_curriculum_frameworks");
  assert.ok(tool);
  const result = await tool.execute({ locale: "en-ZA", language: "English" }, { role: "student" });
  assert.ok((result as { frameworks: unknown[] }).frameworks.length > 1);
});

test("generate_exam_paper section marks sum to requested total", () => {
  const paper = generateExamPaper("Math", 25);
  const total = paper.sections.reduce((sum, section) => sum + section.marks, 0);
  assert.equal(total, 25);
});

test("lesson_plan_generator keeps short lessons within requested duration", () => {
  const plan = lessonPlanGenerator("Fractions", 20);
  const total = plan.flow.reduce((sum, step) => {
    const match = step.match(/\((\d+) min\)/);
    return sum + Number(match?.[1] ?? 0);
  }, 0);
  assert.equal(total, 20);
});
