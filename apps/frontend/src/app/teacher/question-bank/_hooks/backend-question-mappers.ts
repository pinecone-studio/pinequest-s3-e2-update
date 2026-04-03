import type {
  Question,
  QuestionDifficulty,
  QuestionOption,
  QuestionType,
} from "../_lib/types";
import { normalizePromptText } from "../_lib/utils";
import type { BackendTest } from "./get-tests";

type SubjectNameById = Map<string, string>;

function subjectNameFromId(
  subjectId: string,
  subjectNameById?: SubjectNameById,
): string {
  const fromApi = subjectNameById?.get(subjectId);
  return fromApi ?? subjectId;
}

function gradeLabel(grade: number): string {
  if (grade >= 1 && grade <= 12) return `${grade}-р анги`;
  return "9-р анги";
}

function mapDifficulty(raw: string | null | undefined): QuestionDifficulty {
  const x = (raw ?? "").toLowerCase();
  if (x === "easy" || x.includes("хялбар")) return "easy";
  if (x === "hard" || x.includes("хүнд")) return "hard";
  return "medium";
}

function toStringAnswers(raw: unknown[]): string[] {
  return raw.filter((item): item is string => typeof item === "string");
}

function inferQuestionType(
  test: BackendTest,
  answerTexts: string[],
): QuestionType {
  if (test.imageUrl?.trim()) return "image_based";
  if (answerTexts.length >= 2) return "multiple_choice";
  return "short_answer";
}

function buildOptions(
  answerTexts: string[],
  rightAnswer: string | null,
): QuestionOption[] {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return answerTexts.map((text, index) => ({
    id: letters[index] ?? `opt-${index}`,
    text,
    isCorrect: Boolean(rightAnswer && text.trim() === rightAnswer.trim()),
  }));
}

export function mapBackendTestsToQuestions(
  tests: BackendTest[],
  subjectNameById?: SubjectNameById,
): Question[] {
  return tests.map((test) => {
    const answerTexts = toStringAnswers(test.answers ?? []);
    const questionType = inferQuestionType(test, answerTexts);
    const options =
      questionType === "multiple_choice"
        ? buildOptions(answerTexts, test.rightAnswer)
        : [];
    const subject = subjectNameFromId(test.subjectId, subjectNameById);
    const prompt = test.question?.trim() || "(Агуулга байхгүй)";
    const promptText = normalizePromptText(prompt);
    const title =
      test.title?.trim()?.slice(0, 120) || promptText.slice(0, 80) || "Асуулт";
    const topic = promptText.slice(0, 120) || subject;

    return {
      id: test.id,
      title,
      questionType,
      isFavourite: test.favourite ?? false,
      source: "global",
      teacherId: test.teacherId ?? null,
      content: {
        prompt,
        guidance: "",
        explanation: test.notes ?? "",
      },
      options,
      correctAnswer:
        questionType === "multiple_choice"
          ? (options.find((o) => o.isCorrect)?.text ?? test.rightAnswer ?? "")
          : (test.rightAnswer ?? ""),
      rubric: "",
      formulaRaw: "",
      formulaPreview: "",
      imageUrl: test.imageUrl ?? "",
      fileUploadConfig: {
        acceptedFileTypes: [],
        instructions: "",
        maxFiles: 0,
      },
      grade: gradeLabel(test.grade),
      subject,
      topic,
      difficulty: mapDifficulty(test.difficulty),
      points: test.score > 0 ? test.score : 1,
      status: "published",
      gradingType: questionType === "multiple_choice" ? "auto" : "hybrid",
      usageCount: test.usageCount ?? 0,
      createdAt: test.createdAt,
      updatedAt: test.updatedAt,
    } satisfies Question;
  });
}

export type BackendOpenExercies = {
  id: string;
  subjectId: string;
  grade: number;
  topic: string | null;
  title: string | null;
  question: string | null;
  answer: string | null;
  imageUrl: string | null;
  difficulty: string | null;
  score: number;
  favourite?: boolean | null;
  notes: string | null;
  teacherId: string | null;
  createdAt: string;
  updatedAt: string;
};

export function mapBackendOpenExerciesToQuestions(
  rows: BackendOpenExercies[],
  subjectNameById?: SubjectNameById,
): Question[] {
  return rows.map((row) => {
    const subject = subjectNameFromId(row.subjectId, subjectNameById);
    const prompt = row.question?.trim() || "(Агуулга байхгүй)";
    const promptText = normalizePromptText(prompt);
    const title =
      row.title?.trim()?.slice(0, 120) ||
      promptText.slice(0, 80) ||
      "Асуулт";
    const topic = row.topic?.trim() || promptText.slice(0, 120) || title;

    return {
      id: row.id,
      title,
      questionType: "long_answer",
      isFavourite: row.favourite ?? false,
      source: "school",
      teacherId: row.teacherId ?? null,
      content: {
        prompt,
        guidance: "",
        explanation: row.notes ?? "",
      },
      options: [],
      correctAnswer: row.answer ?? "",
      rubric: "",
      formulaRaw: "",
      formulaPreview: "",
      imageUrl: row.imageUrl ?? "",
      fileUploadConfig: {
        acceptedFileTypes: [],
        instructions: "",
        maxFiles: 0,
      },
      grade: gradeLabel(row.grade),
      subject,
      topic,
      difficulty: mapDifficulty(row.difficulty),
      points: row.score > 0 ? row.score : 1,
      status: "published",
      gradingType: "hybrid",
      usageCount: 0,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    } satisfies Question;
  });
}
