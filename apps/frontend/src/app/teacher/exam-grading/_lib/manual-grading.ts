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

export type ManualGradingRecord = {
  examId: string;
  studentId: string;
  questions: ManualGradingQuestion[];
  updatedAt: string;
};

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
): ManualGradingQuestion[] {
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
  subject: string;
  savedRecord: ManualGradingRecord | null;
}) {
  const { bootstrap, examId, examTitle, savedRecord, subject } = input;

  if (savedRecord?.questions?.length) {
    return savedRecord.questions;
  }

  const attempts = bootstrap?.student.attempts ?? [];
  if (attempts.length > 0) {
    return attempts.map((attempt) => mapAttemptToQuestion(examId, attempt));
  }

  return buildFallbackQuestions(examId, examTitle, subject);
}

export function sumManualScore(questions: ManualGradingQuestion[]) {
  return questions.reduce((sum, question) => sum + question.awardedScore, 0);
}

export function sumManualMaxScore(questions: ManualGradingQuestion[]) {
  return questions.reduce((sum, question) => sum + question.maxScore, 0);
}

