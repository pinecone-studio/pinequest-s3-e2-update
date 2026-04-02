import type {
  PastExamQuestionAttempt,
  PastExamRow,
  PastExamStudentScore,
} from "@/app/lib/class-past-exams-types";
import type { Student } from "@/app/lib/types";

const EXAM_MANAGEMENT_STORAGE_KEY = "exam-management.local.v1";

type ExamTemplateQuestion = {
  id: string;
  text: string;
  type: "multiple_choice" | "short_answer" | "essay" | "true_false";
  score: number;
  choices: Array<{ id: string; text: string }>;
  correctChoiceId?: string;
};

type ExamTemplateRecord = {
  id: string;
  title: string;
  subject: string;
  totalMarks?: number;
  questions: ExamTemplateQuestion[];
};

type DeliveryRecord = {
  id: string;
  templateId: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "sent";
  sentAt?: string;
};

type SubmissionAnswer =
  | { type: "multiple_choice" | "true_false"; selectedChoiceId: string }
  | { type: "short_answer" | "essay"; text: string };

type SubmissionRecord = {
  studentId: string;
  status: "not_started" | "in_progress" | "submitted";
  submittedAt?: string;
  answersByQuestionId: Record<string, SubmissionAnswer>;
  autoScore: number;
  manualByQuestionId: Record<
    string,
    { score: number | null; feedback: string; status: "pending" | "scored" }
  >;
  finalScore?: number | null;
};

type PersistedExamManagementState = {
  templatesById: Record<string, ExamTemplateRecord>;
  deliveriesById: Record<string, DeliveryRecord>;
  submissionsByDeliveryId: Record<string, SubmissionRecord[]>;
};

function safeParseState(
  raw: string | null,
): PersistedExamManagementState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PersistedExamManagementState;
    if (!parsed || typeof parsed !== "object") return null;
    if (
      !parsed.templatesById ||
      !parsed.deliveriesById ||
      !parsed.submissionsByDeliveryId
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function toDateKey(value?: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return trimmed.slice(0, 10);
  return parsed.toISOString().slice(0, 10);
}

function getTemplateMaxScore(template: ExamTemplateRecord): number {
  if (typeof template.totalMarks === "number" && template.totalMarks > 0) {
    return template.totalMarks;
  }
  return template.questions.reduce((sum, question) => sum + question.score, 0);
}

function getCorrectAnswerLabel(question: ExamTemplateQuestion): string {
  if (
    (question.type === "multiple_choice" || question.type === "true_false") &&
    question.correctChoiceId
  ) {
    return (
      question.choices.find((choice) => choice.id === question.correctChoiceId)
        ?.text ?? "-"
    );
  }
  return "-";
}

function buildAttempts(
  template: ExamTemplateRecord,
  submission?: SubmissionRecord,
): PastExamQuestionAttempt[] {
  return template.questions.map((question, index) => {
    const answer = submission?.answersByQuestionId?.[question.id];
    let studentAnswer = "-";
    let pointsEarned = 0;

    if (
      answer &&
      (answer.type === "multiple_choice" || answer.type === "true_false")
    ) {
      studentAnswer =
        question.choices.find((choice) => choice.id === answer.selectedChoiceId)
          ?.text ?? "-";
      pointsEarned =
        answer.selectedChoiceId === question.correctChoiceId
          ? question.score
          : 0;
    } else if (
      answer &&
      (answer.type === "short_answer" || answer.type === "essay")
    ) {
      studentAnswer = answer.text || "-";
      const manualScore = submission?.manualByQuestionId?.[question.id]?.score;
      pointsEarned =
        typeof manualScore === "number"
          ? Math.max(0, Math.min(question.score, manualScore))
          : 0;
    }

    return {
      order: index + 1,
      question: question.text,
      studentAnswer,
      pointsEarned,
      pointsMax: question.score,
    };
  });
}

function resolveStudentScore(
  template: ExamTemplateRecord,
  attempts: PastExamQuestionAttempt[],
  submission?: SubmissionRecord,
): number {
  if (typeof submission?.finalScore === "number") {
    return submission.finalScore;
  }
  return attempts.reduce((sum, attempt) => sum + attempt.pointsEarned, 0);
}

function computeMostFailedQuestion(
  template: ExamTemplateRecord,
  studentScores: PastExamStudentScore[],
) {
  if (!studentScores.length || !template.questions.length) return null;

  let best:
    | {
        order: number;
        question: string;
        correctAnswer: string;
        failCount: number;
      }
    | null = null;

  for (let i = 0; i < template.questions.length; i++) {
    const order = i + 1;
    let failCount = 0;
    for (const studentScore of studentScores) {
      const attempt = studentScore.attempts.find((item) => item.order === order);
      if (!attempt) continue;
      if (attempt.pointsEarned < attempt.pointsMax) failCount += 1;
    }
    const question = template.questions[i];
    const candidate = {
      order,
      question: question.text,
      correctAnswer: getCorrectAnswerLabel(question),
      failCount,
    };
    if (!best || candidate.failCount > best.failCount) best = candidate;
  }

  if (!best || best.failCount === 0) return null;
  return {
    ...best,
    totalStudents: studentScores.length,
  };
}

export function getLivePastExamsForClassFromState(
  state: PersistedExamManagementState,
  classId: string,
  roster: Student[],
): PastExamRow[] {
  const deliveries = Object.values(state.deliveriesById)
    .filter((delivery) => delivery.classId === classId)
    .filter((delivery) => delivery.status === "sent");

  const rows: PastExamRow[] = [];

  for (const delivery of deliveries) {
    const template = state.templatesById[delivery.templateId];
    if (!template) continue;

    const submittedByStudentId = new Map(
      (state.submissionsByDeliveryId[delivery.id] ?? [])
        .filter(
          (submission) =>
            submission.status === "submitted" || Boolean(submission.submittedAt),
        )
        .map((submission) => [submission.studentId, submission] as const),
    );

    const maxScore = getTemplateMaxScore(template);
    const passLine = Math.max(1, Math.ceil(maxScore * 0.5));

    const studentScores: PastExamStudentScore[] = roster.map((student) => {
      const submission = submittedByStudentId.get(student.id);
      const attempts = buildAttempts(template, submission);
      const score = resolveStudentScore(template, attempts, submission);

      return {
        studentId: student.id,
        studentNumber: student.studentNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        score,
        passed: score >= passLine,
        attempts,
      };
    });

    const passed = studentScores.filter((student) => student.passed).length;
    const date = toDateKey(delivery.sentAt || delivery.updatedAt || delivery.createdAt);
    const mostFailedQuestion = computeMostFailedQuestion(template, studentScores);

    rows.push({
      id: `live-${delivery.id}`,
      blueprintId: `live-${template.id}`,
      subject: template.subject || "Тодорхойгүй хичээл",
      examTitle: template.title || "Тодорхойгүй шалгалт",
      date: date || "-",
      maxScore,
      passed,
      total: studentScores.length,
      studentScores,
      mostFailedQuestion,
    });
  }

  return rows.sort((a, b) => b.date.localeCompare(a.date));
}

export function getLivePastExamsForClassClient(
  classId: string,
  roster: Student[],
): PastExamRow[] {
  if (typeof window === "undefined") return [];
  const state = safeParseState(
    window.localStorage.getItem(EXAM_MANAGEMENT_STORAGE_KEY),
  );
  if (!state) return [];
  return getLivePastExamsForClassFromState(state, classId, roster);
}

