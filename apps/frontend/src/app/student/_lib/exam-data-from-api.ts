import type { ExamData, ExamQuestion, OptionId } from "../types";

const OPTION_IDS: readonly OptionId[] = ["A", "B", "C", "D"];

export type ApiExamRow = {
  title: string | null;
  topic: string | null;
  duration: string | null;
  testIds: string[] | null;
};

export type ApiTestRow = {
  id: string;
  title?: string | null;
  question: string | null;
  answers: string[] | null;
  rightAnswer: string | null;
};

export function parseDurationMinutesFromApi(
  duration: string | null | undefined,
): number {
  const n = Number.parseInt(String(duration ?? "").trim(), 10);
  return Number.isFinite(n) && n > 0 ? n : 40;
}

function mapRightAnswerToOptionId(
  rightAnswer: string | null | undefined,
  choices: string[],
): OptionId {
  const raw = (rightAnswer ?? "").trim();
  const upper = raw.toUpperCase();
  if (upper === "A" || upper === "B" || upper === "C" || upper === "D") {
    return upper as OptionId;
  }
  const idx = choices.findIndex((c) => c.trim() === raw);
  if (idx >= 0 && idx < OPTION_IDS.length) return OPTION_IDS[idx]!;
  const n = Number.parseInt(raw, 10);
  if (n >= 1 && n <= choices.length && n <= 4) {
    return OPTION_IDS[n - 1]!;
  }
  return "A";
}

/** `testIds` дарааллыг хадгална; зөвхөн 2–4 сонголттой MCQ. Нээлттэй даалгавар `ExamScreen`-д орохгүй. */
export function buildExamDataFromApi(
  exam: ApiExamRow,
  testsById: Map<string, ApiTestRow>,
): ExamData {
  const testIds = exam.testIds ?? [];
  const questions: ExamQuestion[] = [];
  let qNum = 0;
  for (const tid of testIds) {
    const t = testsById.get(tid);
    if (!t) continue;
    const choices = (Array.isArray(t.answers) ? t.answers : [])
      .filter((a) => typeof a === "string" && a.trim().length > 0)
      .slice(0, 4);
    if (choices.length < 2) continue;
    const options = choices.map((text, i) => ({
      id: OPTION_IDS[i]!,
      text: text.trim(),
    }));
    const correctAnswer = mapRightAnswerToOptionId(t.rightAnswer, choices);
    qNum += 1;
    questions.push({
      id: qNum,
      questionNumber: qNum,
      title: (t.title ?? "").trim() || `Асуулт ${qNum}`,
      text: (t.question ?? "").trim() || `Асуулт ${qNum}`,
      type: "multiple_choice",
      options,
      sourceTestId: tid,
      correctAnswer,
    });
  }
  const title =
    (exam.title && exam.title.trim()) ||
    (exam.topic && exam.topic.trim()) ||
    "Шалгалт";
  return {
    title,
    schoolYear: "2025-2026",
    term: "Хичээлийн жил",
    durationMinutes: parseDurationMinutesFromApi(exam.duration),
    questions,
  };
}
