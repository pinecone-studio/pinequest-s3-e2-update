/** @format */

/** Нэг асуулт дээрх сурагчийн хариулт, оноо */
export type PastExamQuestionAttempt = {
  order: number;
  question: string;
  studentAnswer: string;
  pointsEarned: number;
  pointsMax: number;
};

/** Нэг сурагчийн нэг шалгалтын оноо болон асуулт бүрийн дэлгэрэнгүй */
export type PastExamStudentScore = {
  studentId: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  score: number;
  passed: boolean;
  attempts: PastExamQuestionAttempt[];
};

/** Ангийн түвшинд: хамгийн олон сурагч алдсан асуулт + загварын зөв хариулт */
export type PastExamMostFailedQuestion = {
  order: number;
  question: string;
  correctAnswer: string;
  failCount: number;
  totalStudents: number;
};

/** Асуулт бүрийн ангийн нэгтгэл (тайлангийн хувьд) */
export type PastExamQuestionAggregate = {
  order: number;
  question: string;
  correctAnswer: string;
  pointsMax: number;
  fullCreditCount: number;
  partialCreditCount: number;
  zeroCount: number;
  failedCount: number;
  totalStudents: number;
};

/** Өмнөх шалгалтын мөр — анги бүрийн сурагчдаар тооцоолсон дүн */
export type PastExamRow = {
  id: string;
  blueprintId: string;
  subject: string;
  examTitle: string;
  date: string;
  maxScore: number;
  passed: number;
  total: number;
  studentScores: PastExamStudentScore[];
  mostFailedQuestion: PastExamMostFailedQuestion | null;
};
