import type { Exam, ExamStatus, ExamVariant, Question, QuestionType, SentExam } from "./types";

export function createEmptyQuestion(type: QuestionType = "multiple_choice"): Question {
  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text: "",
    type,
    options: type === "multiple_choice" ? ["", "", "", ""] : [],
    correctAnswer: "",
    score: 1,
  };
}

export function normalizeQuestionForType(question: Question): Question {
  if (question.type === "multiple_choice") {
    const options = question.options.length === 4 ? question.options : ["", "", "", ""];
    return { ...question, options };
  }
  return { ...question, options: [] };
}

export function createExamFromForm(params: {
  title: string;
  subject: string;
  grade: string;
  duration: number;
  questions: Question[];
}): Exam {
  return {
    id: `exam-${Date.now()}`,
    title: params.title,
    subject: params.subject,
    grade: params.grade,
    duration: params.duration,
    questions: params.questions,
    createdAt: new Date().toISOString().slice(0, 10),
    status: "saved",
  };
}

export function duplicateExam(exam: Exam): Exam {
  return {
    ...exam,
    id: `exam-${Date.now()}`,
    title: `${exam.title} (Хуулбар)`,
    createdAt: new Date().toISOString().slice(0, 10),
    status: "draft",
    questions: exam.questions.map((q) => ({
      ...q,
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    })),
  };
}

export function statusLabel(status: ExamStatus) {
  if (status === "draft") return "Ноорог";
  if (status === "saved") return "Хадгалсан";
  return "Илгээсэн";
}

export function statusTone(status: ExamStatus) {
  if (status === "sent") return "bg-[#34c759]/15 text-[#198a41]";
  if (status === "saved") return "bg-[#4f9dff]/15 text-[#275f9f]";
  return "bg-[#ffd65a]/30 text-[#8b6800]";
}

export function questionTypeLabel(type: QuestionType) {
  if (type === "multiple_choice") return "Сонголттой";
  if (type === "short_answer") return "Богино хариулт";
  return "Эсээ";
}

export function generateExamLink(examId: string, classId: string, variant: ExamVariant): string {
  return `/teacher/content-management?exam=${examId}&class=${classId}&variant=${variant}`;
}

export function createSentExam(
  examId: string,
  classId: string,
  variant: ExamVariant,
  link: string,
): SentExam {
  return {
    id: `sent-${Date.now()}`,
    examId,
    classId,
    variant,
    link,
    sentAt: new Date().toISOString().slice(0, 16).replace("T", " "),
  };
}

export function parseExamLink(
  input: string,
): { examId: string; classId: string; variant: ExamVariant } | null {
  try {
    const url = input.startsWith("http") ? new URL(input) : new URL(input, "https://demo.local");
    const examId = url.searchParams.get("exam") ?? "";
    const classId = url.searchParams.get("class") ?? "";
    const rawVariant = url.searchParams.get("variant") ?? "A";
    const variant: ExamVariant =
      rawVariant === "B" || rawVariant === "C" || rawVariant === "D" ? rawVariant : "A";
    if (!examId || !classId) return null;
    return { examId, classId, variant };
  } catch {
    return null;
  }
}

export function generateVariantQuestions(questions: Question[], variant: ExamVariant): Question[] {
  if (variant === "A") return questions;

  if (variant === "B") {
    const next = [...questions];
    for (let i = 0; i < next.length - 1; i += 2) {
      const temp = next[i];
      next[i] = next[i + 1];
      next[i + 1] = temp;
    }
    return next;
  }

  if (variant === "C") {
    return [...questions].reverse();
  }

  const source = [...questions];
  const even = source.filter((_, idx) => idx % 2 === 0);
  const odd = source.filter((_, idx) => idx % 2 !== 0);
  return [...odd, ...even];
}

export function mockParsedQuestions(params: {
  importType: "pdf" | "excel";
  subject: string;
  grade: string;
}): Question[] {
  const tag = params.importType === "pdf" ? "PDF" : "Excel";
  return [
    {
      id: `imp-${Date.now()}-1`,
      text: `${tag}: ${params.grade} ${params.subject} сэдвийн тодорхойлолтыг зөв сонго.`,
      type: "multiple_choice",
      options: ["Хувилбар A", "Хувилбар B", "Хувилбар C", "Хувилбар D"],
      correctAnswer: "Хувилбар A",
      score: 1,
    },
    {
      id: `imp-${Date.now()}-2`,
      text: `${tag}: Гол ойлголтын томьёог бич.`,
      type: "short_answer",
      options: [],
      correctAnswer: "",
      score: 1,
    },
    {
      id: `imp-${Date.now()}-3`,
      text: `${tag}: Дараах бодлогын зөв хариуг ол.`,
      type: "multiple_choice",
      options: ["8", "10", "12", "14"],
      correctAnswer: "12",
      score: 1,
    },
    {
      id: `imp-${Date.now()}-4`,
      text: `${tag}: Сэдвийн хэрэглээг жишээгээр тайлбарла.`,
      type: "essay",
      options: [],
      correctAnswer: "",
      score: 2,
    },
    {
      id: `imp-${Date.now()}-5`,
      text: `${tag}: Хос ойлголтыг зөв тааруул.`,
      type: "multiple_choice",
      options: ["I-1, II-2", "I-2, II-1", "I-1, II-3", "I-3, II-2"],
      correctAnswer: "I-1, II-2",
      score: 1,
    },
  ];
}
