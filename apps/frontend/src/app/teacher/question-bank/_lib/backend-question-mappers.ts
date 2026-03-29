import type { BackendTest } from "./get-tests";
import type {
  Question,
  QuestionBuilderValues,
  QuestionDifficulty,
  QuestionFileUploadConfig,
  QuestionType,
} from "./types";
import { renderFormulaPreview } from "./utils";

const DEFAULT_FILE_UPLOAD_CONFIG: QuestionFileUploadConfig = {
  acceptedFileTypes: [],
  instructions: "",
  maxFiles: 0,
};

export function mapBackendTestsToQuestions(tests: BackendTest[]) {
  return tests.map(mapBackendTestToQuestion);
}

export function mapBackendTestToQuestion(test: BackendTest): Question {
  const questionType = normalizeQuestionType(test.questionType);
  const formulaRaw = test.formulaRaw?.trim() || "";

  return {
    id: test.id,
    title: test.title?.trim() || buildFallbackTitle(test.question),
    questionType,
    content: {
      prompt: test.question.trim(),
      guidance: test.guidance?.trim() || "",
      explanation: test.explanation?.trim() || "",
    },
    options: questionType === "multiple_choice" ? buildOptions(test) : [],
    correctAnswer: test.rightAnswer.trim(),
    rubric: test.rubric?.trim() || "",
    formulaRaw,
    formulaPreview: formulaRaw ? renderFormulaPreview(formulaRaw) : "",
    imageUrl: test.imageUrl?.trim() || "",
    fileUploadConfig: parseFileUploadConfig(test.fileUploadConfig),
    grade: test.gradeLabel || `${test.grade}-р анги`,
    subject: test.subjectName?.trim() || test.subjectId,
    subtopic: test.subtopic?.trim() || undefined,
    topic: test.topic.trim(),
    difficulty: normalizeDifficulty(test.difficulty),
    points: test.score,
    status: normalizeStatus(test.status),
    gradingType: normalizeGradingType(test.gradingType, questionType),
    usageCount: test.usageCount ?? 0,
    createdAt: test.createdAt,
    updatedAt: test.updatedAt,
  };
}

export function buildCreateTestInput(values: QuestionBuilderValues) {
  return buildTestInput(values, 0);
}

export function buildUpdateTestInput(
  values: QuestionBuilderValues,
  usageCount: number,
) {
  return buildTestInput(values, usageCount);
}

function buildTestInput(values: QuestionBuilderValues, usageCount: number) {
  const answers =
    values.questionType === "multiple_choice"
      ? values.options.map((option) => option.text.trim()).filter(Boolean)
      : values.questionType === "short_answer"
        ? [values.correctAnswer.trim()].filter(Boolean)
        : values.questionType === "formula_input"
          ? [values.formulaRaw.trim()].filter(Boolean)
          : [];

  return {
    grade: extractGradeNumber(values.grade),
    subjectId: values.subject.trim(),
    questionType: values.questionType,
    subtopic: values.subtopic.trim() || undefined,
    topic: values.topic.trim(),
    title: values.title.trim() || undefined,
    question: values.prompt.trim(),
    guidance: values.guidance.trim() || undefined,
    explanation: values.explanation.trim() || undefined,
    answers,
    rightAnswer: buildRightAnswer(values),
    rubric: values.rubric.trim() || undefined,
    formulaRaw: values.formulaRaw.trim() || undefined,
    imageUrl: values.imageUrl.trim() || undefined,
    fileUploadConfig: JSON.stringify(values.fileUploadConfig),
    difficulty: values.difficulty,
    score: values.points,
    isActive: values.status === "published" ? 1 : 0,
    usageCount,
  };
}

function normalizeQuestionType(value: string): QuestionType {
  return value === "multiple_choice" ||
    value === "short_answer" ||
    value === "long_answer" ||
    value === "formula_input" ||
    value === "image_based" ||
    value === "file_upload"
    ? value
    : "short_answer";
}

function normalizeDifficulty(value?: string | null): QuestionDifficulty {
  return value === "easy" || value === "medium" || value === "hard"
    ? value
    : "medium";
}

function normalizeStatus(value?: string | null): Question["status"] {
  return value === "published" || value === "draft" ? value : "draft";
}

function normalizeGradingType(
  value: string | null | undefined,
  questionType: QuestionType,
): Question["gradingType"] {
  return value === "auto" || value === "manual" || value === "hybrid"
    ? value
    : questionType === "multiple_choice"
      ? "auto"
      : questionType === "short_answer" || questionType === "formula_input"
        ? "hybrid"
        : "manual";
}

function parseFileUploadConfig(
  value?: string | null,
): QuestionFileUploadConfig {
  if (!value?.trim()) {
    return DEFAULT_FILE_UPLOAD_CONFIG;
  }

  try {
    const parsed = JSON.parse(value);
    return {
      acceptedFileTypes: Array.isArray(parsed.acceptedFileTypes)
        ? parsed.acceptedFileTypes.filter(
            (item: unknown): item is string => typeof item === "string",
          )
        : [],
      instructions:
        typeof parsed.instructions === "string" ? parsed.instructions : "",
      maxFiles: Number.isFinite(parsed.maxFiles) ? Number(parsed.maxFiles) : 0,
    };
  } catch {
    return DEFAULT_FILE_UPLOAD_CONFIG;
  }
}

function buildOptions(test: BackendTest) {
  return test.answers.map((answer, index) => ({
    id: `${test.id}-option-${index + 1}`,
    text: answer,
    isCorrect: answer.trim() === test.rightAnswer.trim(),
  }));
}

function extractGradeNumber(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildFallbackTitle(prompt: string) {
  return prompt.trim().slice(0, 48) || "Асуулт";
}

function buildRightAnswer(values: QuestionBuilderValues) {
  return values.questionType === "multiple_choice"
    ? (values.options.find((option) => option.isCorrect)?.text.trim() ?? "")
    : values.questionType === "formula_input"
      ? values.formulaRaw.trim()
      : values.correctAnswer.trim() || "Гараар үнэлнэ";
}
