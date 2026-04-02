"use client";

import type {
  PastExamQuestionAttempt,
  PastExamRow,
  PastExamStudentScore,
} from "@/app/lib/class-past-exams-types";

export type ManualGradingBootstrap = {
  classLabel: string;
  exam: PastExamRow;
  student: PastExamStudentScore;
};

export type ManualGradingQuestion = {
  id: string;
  order: number;
  prompt: string;
  studentAnswer: string;
  maxScore: number;
  awardedScore: number;
  teacherFeedback: string;
  savedAt?: string;
};

export type ManualGradingFallbackQuestionSeed = {
  id: string;
  order: number;
  prompt: string;
  maxScore: number;
  studentAnswer?: string;
};

export type ManualGradingRecord = {
  examId: string;
  studentId: string;
  questions: ManualGradingQuestion[];
  updatedAt: string;
};

function clampScore(value: number, maxScore: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(maxScore, value));
}

function computeMostFailedQuestion(studentScores: PastExamStudentScore[]) {
  const firstStudentWithAttempts = studentScores.find(
    (student) => student.attempts.length > 0,
  );
  if (!firstStudentWithAttempts) return null;

  let best:
    | {
        order: number;
        question: string;
        correctAnswer: string;
        failCount: number;
      }
    | null = null;

  for (const seedAttempt of firstStudentWithAttempts.attempts) {
    let failCount = 0;
    for (const student of studentScores) {
      const attempt = student.attempts.find(
        (item) => item.order === seedAttempt.order,
      );
      if (attempt && attempt.pointsEarned < attempt.pointsMax) failCount += 1;
    }

    const candidate = {
      order: seedAttempt.order,
      question: seedAttempt.question,
      correctAnswer: seedAttempt.correctAnswer ?? "-",
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

export function buildBootstrapStorageKey(examId: string, studentId: string) {
  return `manual-grading-bootstrap:${examId}:${studentId}`;
}

export function buildManualGradingStorageKey(examId: string, studentId: string) {
  return `manual-grading-record:${examId}:${studentId}`;
}

export function readManualGradingBootstrap(
  examId: string,
  studentId: string,
): ManualGradingBootstrap | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(buildBootstrapStorageKey(examId, studentId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ManualGradingBootstrap;
  } catch {
    return null;
  }
}

export function readManualGradingRecord(
  examId: string,
  studentId: string,
): ManualGradingRecord | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(buildManualGradingStorageKey(examId, studentId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ManualGradingRecord;
  } catch {
    return null;
  }
}

export function writeManualGradingRecord(record: ManualGradingRecord) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    buildManualGradingStorageKey(record.examId, record.studentId),
    JSON.stringify(record),
  );
  window.dispatchEvent(new Event("exam-management.local.updated"));
}

export function isManualGradableAttempt(attempt: PastExamQuestionAttempt) {
  if (!attempt.questionType) return true;
  return (
    attempt.questionType === "essay" || attempt.questionType === "short_answer"
  );
}

function mapAttemptToQuestion(
  examId: string,
  attempt: PastExamQuestionAttempt,
): ManualGradingQuestion {
  return {
    id: `${examId}-manual-${attempt.order}`,
    order: attempt.order,
    prompt: attempt.question,
    studentAnswer: attempt.studentAnswer,
    maxScore: attempt.pointsMax,
    awardedScore: attempt.pointsEarned,
    teacherFeedback: "",
  };
}

function buildFallbackQuestions(
  examId: string,
  examTitle: string,
  subject: string,
  fallbackQuestions?: ManualGradingFallbackQuestionSeed[],
): ManualGradingQuestion[] {
  if (fallbackQuestions?.length) {
    return fallbackQuestions.map((question) => ({
      id: question.id,
      order: question.order,
      prompt: question.prompt,
      studentAnswer:
        question.studentAnswer ??
        `${subject} хичээлийн энэ задгай асуултын сурагчийн хариулт backend-ээс хараахан ирээгүй байна.`,
      maxScore: question.maxScore,
      awardedScore: 0,
      teacherFeedback: "",
    }));
  }

  return [
    {
      id: `${examId}-manual-1`,
      order: 1,
      prompt: `${examTitle} шалгалтын задгай асуулт 1`,
      studentAnswer: `${subject} хичээлийн энэ задгай асуултын сурагчийн хариулт backend-ээс хараахан ирээгүй тул UI mock байдлаар харуулж байна.`,
      maxScore: 5,
      awardedScore: 0,
      teacherFeedback: "",
    },
    {
      id: `${examId}-manual-2`,
      order: 2,
      prompt: `${examTitle} шалгалтын задгай асуулт 2`,
      studentAnswer: `Энэ хэсэгт сурагчийн дэлгэрэнгүй хариулт, эсээ, тайлбар эсвэл томьёоны задгай ажил ирнэ.`,
      maxScore: 5,
      awardedScore: 0,
      teacherFeedback: "",
    },
  ];
}

export function buildInitialManualQuestions(input: {
  bootstrap: ManualGradingBootstrap | null;
  examId: string;
  examTitle: string;
  fallbackQuestions?: ManualGradingFallbackQuestionSeed[];
  subject: string;
  savedRecord: ManualGradingRecord | null;
}) {
  const {
    bootstrap,
    examId,
    examTitle,
    fallbackQuestions,
    savedRecord,
    subject,
  } = input;

  if (savedRecord?.questions?.length) {
    return savedRecord.questions;
  }

  const attempts = (bootstrap?.student.attempts ?? []).filter(
    isManualGradableAttempt,
  );
  if (attempts.length > 0) {
    return attempts.map((attempt) => mapAttemptToQuestion(examId, attempt));
  }

  return buildFallbackQuestions(examId, examTitle, subject, fallbackQuestions);
}

export function sumManualScore(questions: ManualGradingQuestion[]) {
  return questions.reduce((sum, question) => sum + question.awardedScore, 0);
}

export function sumManualMaxScore(questions: ManualGradingQuestion[]) {
  return questions.reduce((sum, question) => sum + question.maxScore, 0);
}

export function applySavedManualGradingToRows(rows: PastExamRow[]) {
  return rows.map((row) => {
    const studentScores = row.studentScores.map((student) => {
      const savedRecord = readManualGradingRecord(row.blueprintId, student.studentId);
      if (!savedRecord?.questions?.length || !student.attempts.length) {
        return student;
      }

      const savedByOrder = new Map(
        savedRecord.questions.map((question) => [question.order, question] as const),
      );
      let changed = false;

      const attempts = student.attempts.map((attempt) => {
        const savedQuestion = savedByOrder.get(attempt.order);
        if (!savedQuestion) return attempt;
        changed = true;
        return {
          ...attempt,
          pointsEarned: clampScore(savedQuestion.awardedScore, attempt.pointsMax),
          teacherFeedback: savedQuestion.teacherFeedback,
        };
      });

      if (!changed) return student;

      const score = attempts.reduce((sum, attempt) => sum + attempt.pointsEarned, 0);
      return {
        ...student,
        score,
        passed: score >= row.maxScore * 0.5,
        attempts,
      };
    });

    return {
      ...row,
      mostFailedQuestion: computeMostFailedQuestion(studentScores),
      passed: studentScores.filter((student) => student.passed).length,
      studentScores,
    };
  });
}
