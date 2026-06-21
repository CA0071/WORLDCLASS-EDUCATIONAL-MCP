import { z } from "zod";
import { getLearningObjectives, getSubjectsByGrade, listCurriculumFrameworks, SUPPORTED_LANGUAGES, type SupportedLanguage } from "../domain/curriculum";
import { createStudyPlan, generateRevisionPack, spacedRepetitionSchedule } from "../domain/study";
import { explainScienceConcept, generateMathPractice, generateScienceQuiz, solveMathStepwise } from "../domain/stem";
import { grammarPracticeGenerator, languageComprehensionQuestions, languageReadingPassage } from "../domain/language";
import { generateAssignment, generateExamPaper, markSchemeGenerator, rubricGenerator } from "../domain/assessment";
import { classProgressSummary, identifyLearningGaps, recordStudentProgress, recommendInterventions } from "../domain/progress";
import { classroomActivityGenerator, lessonPlanGenerator } from "../domain/teacher";
import { dyslexiaFriendlyFormat, simplifyTextForLevel } from "../domain/accessibility";
import type { UserRole } from "../security/auth";

const phaseSchema = z.enum(["foundation", "intermediate", "senior", "fet", "tertiary"]);
const languageSchema = z.enum(SUPPORTED_LANGUAGES);

const learningContextSchema = z.object({
  locale: z.string().default("en-ZA"),
  country: z.string().default("ZA"),
  grade: z.string().optional(),
  phase: phaseSchema.optional(),
  language: languageSchema.default("English"),
});

export type ToolExecutionContext = {
  role: UserRole;
};

export interface ToolDefinition<TInput extends z.ZodTypeAny> {
  name: string;
  description: string;
  inputSchema: TInput;
  requiredRole?: UserRole;
  destructive?: boolean;
  execute: (input: z.infer<TInput>, context: ToolExecutionContext) => Promise<unknown>;
}

const subjectSchema = z.string().min(2);

function withContext<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape).merge(learningContextSchema);
}

export const TOOL_CATALOG: ToolDefinition<z.ZodTypeAny>[] = [
  {
    name: "list_curriculum_frameworks",
    description: "List curriculum frameworks with South Africa CAPS baseline metadata.",
    inputSchema: withContext({ country: z.string().optional() }),
    execute: async (input: any) => ({ frameworks: listCurriculumFrameworks(input.country) }),
  },
  {
    name: "get_subjects_by_grade",
    description: "Return subjects for requested grade and phase.",
    inputSchema: withContext({ grade: z.string().min(1) }),
    execute: async (input: any) => ({ subjects: getSubjectsByGrade(input.grade) }),
  },
  {
    name: "get_learning_objectives",
    description: "Return practical learning objectives by subject and grade.",
    inputSchema: withContext({ subject: subjectSchema, grade: z.string().min(1) }),
    execute: async (input: any) => ({ objectives: getLearningObjectives(input.subject, input.grade) }),
  },
  {
    name: "create_study_plan",
    description: "Generate a structured study plan.",
    inputSchema: withContext({ topic: z.string().min(2), weeks: z.number().int().min(1).max(16) }),
    execute: async (input: any) => ({ plan: createStudyPlan(input.topic, input.weeks) }),
  },
  {
    name: "spaced_repetition_schedule",
    description: "Generate spaced repetition dates.",
    inputSchema: withContext({ startDate: z.string().date(), sessions: z.number().int().min(1).max(12) }),
    execute: async (input: any) => ({ schedule: spacedRepetitionSchedule(input.startDate, input.sessions) }),
  },
  {
    name: "generate_revision_pack",
    description: "Create quick revision resources.",
    inputSchema: withContext({ subject: subjectSchema, grade: z.string().min(1) }),
    execute: async (input: any) => generateRevisionPack(input.subject, input.grade),
  },
  {
    name: "solve_math_stepwise",
    description: "Solve a maths problem with steps.",
    inputSchema: withContext({ problem: z.string().min(3) }),
    execute: async (input: any) => solveMathStepwise(input.problem),
  },
  {
    name: "generate_math_practice",
    description: "Generate maths practice prompts.",
    inputSchema: withContext({ topic: z.string().min(2), count: z.number().int().min(1).max(20) }),
    execute: async (input: any) => ({ questions: generateMathPractice(input.topic, input.count) }),
  },
  {
    name: "explain_science_concept",
    description: "Explain science concept with local examples.",
    inputSchema: withContext({ concept: z.string().min(2) }),
    execute: async (input: any) => explainScienceConcept(input.concept),
  },
  {
    name: "generate_science_quiz",
    description: "Generate science quiz set.",
    inputSchema: withContext({ topic: z.string().min(2), count: z.number().int().min(1).max(15) }),
    execute: async (input: any) => ({ quiz: generateScienceQuiz(input.topic, input.count) }),
  },
  {
    name: "language_reading_passage",
    description: "Generate localised reading passage.",
    inputSchema: withContext({ topic: z.string().min(2), language: languageSchema }),
    execute: async (input: any) => ({ passage: languageReadingPassage(input.topic, input.language) }),
  },
  {
    name: "language_comprehension_questions",
    description: "Generate comprehension questions for a passage topic.",
    inputSchema: withContext({ topic: z.string().min(2) }),
    execute: async (input: any) => ({ questions: languageComprehensionQuestions(input.topic) }),
  },
  {
    name: "grammar_practice_generator",
    description: "Generate grammar practice prompts.",
    inputSchema: withContext({ focus: z.string().min(2) }),
    execute: async (input: any) => ({ exercises: grammarPracticeGenerator(input.focus) }),
  },
  {
    name: "generate_exam_paper",
    description: "Generate exam paper structure.",
    inputSchema: withContext({ subject: subjectSchema, marks: z.number().int().min(20).max(200) }),
    execute: async (input: any) => generateExamPaper(input.subject, input.marks),
  },
  {
    name: "generate_assignment",
    description: "Generate assignment brief.",
    inputSchema: withContext({ topic: z.string().min(2) }),
    execute: async (input: any) => generateAssignment(input.topic),
  },
  {
    name: "rubric_generator",
    description: "Generate rubric levels.",
    inputSchema: withContext({ criteria: z.array(z.string().min(2)).min(1).max(8) }),
    execute: async (input: any) => ({ rubric: rubricGenerator(input.criteria) }),
  },
  {
    name: "mark_scheme_generator",
    description: "Generate marking scheme guidance.",
    inputSchema: withContext({ questionCount: z.number().int().min(1).max(50) }),
    execute: async (input: any) => ({ markScheme: markSchemeGenerator(input.questionCount) }),
  },
  {
    name: "record_student_progress",
    description: "Record student progress (destructive/write operation).",
    inputSchema: withContext({ studentId: z.string().min(2), subject: subjectSchema, score: z.number().min(0).max(100), approvalCode: z.string().optional() }),
    requiredRole: "teacher",
    destructive: true,
    execute: async (input: any) => ({ saved: recordStudentProgress({ studentId: input.studentId, subject: input.subject, score: input.score }) }),
  },
  {
    name: "identify_learning_gaps",
    description: "Identify weak topics from score list.",
    inputSchema: withContext({ scores: z.array(z.object({ topic: z.string().min(2), score: z.number().min(0).max(100) })).min(1) }),
    execute: async (input: any) => ({ gaps: identifyLearningGaps(input.scores) }),
  },
  {
    name: "recommend_interventions",
    description: "Recommend interventions from gaps.",
    inputSchema: withContext({ gaps: z.array(z.string().min(2)) }),
    execute: async (input: any) => ({ interventions: recommendInterventions(input.gaps) }),
  },
  {
    name: "class_progress_summary",
    description: "Compute class summary metrics.",
    inputSchema: withContext({ scores: z.array(z.number().min(0).max(100)).min(1) }),
    requiredRole: "teacher",
    execute: async (input: any) => classProgressSummary(input.scores),
  },
  {
    name: "lesson_plan_generator",
    description: "Generate lesson plan skeleton.",
    inputSchema: withContext({ topic: z.string().min(2), durationMinutes: z.number().int().min(20).max(180) }),
    requiredRole: "teacher",
    execute: async (input: any) => lessonPlanGenerator(input.topic, input.durationMinutes),
  },
  {
    name: "classroom_activity_generator",
    description: "Generate classroom activities.",
    inputSchema: withContext({ topic: z.string().min(2) }),
    requiredRole: "teacher",
    execute: async (input: any) => ({ activities: classroomActivityGenerator(input.topic) }),
  },
  {
    name: "simplify_text_for_level",
    description: "Simplify text for reading level.",
    inputSchema: withContext({ text: z.string().min(10), level: z.string().min(2) }),
    execute: async (input: any) => ({ text: simplifyTextForLevel(input.text, input.level) }),
  },
  {
    name: "dyslexia_friendly_format",
    description: "Return dyslexia-friendly format guidance.",
    inputSchema: withContext({ text: z.string().min(10) }),
    execute: async (input: any) => dyslexiaFriendlyFormat(input.text),
  },
];

export function getToolByName(name: string): ToolDefinition<z.ZodTypeAny> | undefined {
  return TOOL_CATALOG.find((tool) => tool.name === name);
}

export function listToolsForMcp(): Array<{ name: string; description: string; inputSchema: unknown }> {
  return TOOL_CATALOG.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: z.toJSONSchema(tool.inputSchema),
  }));
}

export const DEFAULT_LANGUAGE_OPTIONS: SupportedLanguage[] = [...SUPPORTED_LANGUAGES];
