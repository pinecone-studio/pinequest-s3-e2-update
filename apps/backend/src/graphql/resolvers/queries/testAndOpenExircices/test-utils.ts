import { eq } from "drizzle-orm";
import { subjectTable } from "../../../../db/schema/subjectTable";
import { testTable } from "../../../../db/schema/testTable";
import type { GraphQLUserContext } from "../../../context";

type TestRow = typeof testTable.$inferSelect;
type ResolvedTestRow = TestRow & {
  subjectName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type TestMutationInput = {
  grade: number;
  subjectId: string;
  topic: string;
  title?: string | null;
  questionType: string;
  question: string;
  guidance?: string | null;
  explanation?: string | null;
  answers: string[];
  rightAnswer: string;
  subtopic?: string | null;
  rubric?: string | null;
  formulaRaw?: string | null;
  imageUrl?: string | null;
  fileUploadConfig?: string | null;
  difficulty?: string | null;
  score?: number | null;
  isActive?: number | null;
  usageCount?: number | null;
};

const DEFAULT_FILE_UPLOAD_CONFIG = {
  acceptedFileTypes: [] as string[],
  instructions: "",
  maxFiles: 0,
};

export async function resolveSubject(ctx: GraphQLUserContext, rawValue: string) {
  const value = rawValue.trim();
  const byId = await ctx.db
    .select({ id: subjectTable.id, name: subjectTable.name })
    .from(subjectTable)
    .where(eq(subjectTable.id, value))
    .limit(1);

  if (byId[0]) {
    return byId[0].id;
  }

  const byName = await ctx.db
    .select({ id: subjectTable.id, name: subjectTable.name })
    .from(subjectTable)
    .where(eq(subjectTable.name, value))
    .limit(1);

  return byName[0] ?? null;
}

export function normalizeTestInput(input: TestMutationInput, subjectId: string) {
  const answers = input.answers.map((answer) => answer.trim()).filter(Boolean);

  return {
    grade: Number.isFinite(input.grade) ? Math.trunc(input.grade) : 0,
    subjectId,
    topic: input.topic.trim(),
    title: input.title?.trim() || null,
    questionType: input.questionType.trim() || "short_answer",
    question: input.question.trim(),
    subtopic: input.subtopic?.trim() || null,
    rubric: input.rubric?.trim() || null,
    formulaRaw: input.formulaRaw?.trim() || null,
    imageUrl: input.imageUrl?.trim() || null,
    fileUploadConfig: normalizeFileUploadConfig(input.fileUploadConfig),
    answers,
    rightAnswer: input.rightAnswer.trim(),
    notes: input.explanation?.trim() || null,
    questionNote: input.guidance?.trim() || null,
    difficulty: input.difficulty?.trim() || "medium",
    score: input.score ?? 5,
    usageCount: input.usageCount ?? 0,
    isActive: input.isActive ?? 1,
  };
}

export function mapTestRow(row: ResolvedTestRow) {
  const questionType = row.questionType ?? "short_answer";
  return {
    ...row,
    questionType,
    subtopic: row.subtopic ?? null,
    rubric: row.rubric ?? null,
    formulaRaw: row.formulaRaw ?? null,
    imageUrl: row.imageUrl ?? null,
    subjectName: row.subjectName ?? row.subjectId,
    gradeLabel: formatGradeLabel(row.grade),
    status: row.isActive === 1 ? "published" : "draft",
    gradingType: inferGradingType(questionType),
    guidance: row.questionNote ?? null,
    explanation: row.notes ?? null,
    answers: parseJsonStringArray(row.answers),
    fileUploadConfig: row.fileUploadConfig ?? JSON.stringify(DEFAULT_FILE_UPLOAD_CONFIG),
    usageCount: row.usageCount ?? 0,
  };
}

function formatGradeLabel(grade: number | null) {
  return Number.isFinite(grade) ? `${grade}-р анги` : "";
}

function inferGradingType(questionType: string) {
  return questionType === "multiple_choice"
    ? "auto"
    : questionType === "short_answer" || questionType === "formula_input"
      ? "hybrid"
      : "manual";
}

function normalizeFileUploadConfig(value?: string | null) {
  if (!value?.trim()) {
    return JSON.stringify(DEFAULT_FILE_UPLOAD_CONFIG);
  }

  try {
    const parsed = JSON.parse(value);
    return JSON.stringify({
      acceptedFileTypes: Array.isArray(parsed.acceptedFileTypes)
        ? parsed.acceptedFileTypes.filter((item: unknown): item is string => typeof item === "string")
        : [],
      instructions: typeof parsed.instructions === "string" ? parsed.instructions : "",
      maxFiles: Number.isFinite(parsed.maxFiles) ? Number(parsed.maxFiles) : 0,
    });
  } catch {
    return JSON.stringify(DEFAULT_FILE_UPLOAD_CONFIG);
  }
}

function parseJsonStringArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return value ? [value] : [];
  }
}
