import type { Question } from "../../question-bank/_lib/types";

export type ExamComposerState = {
  title: string;
  grade: string;
  subject: string;
  topic: string;
  durationInMinutes: number;
};

export type ExamQuestionItem = {
  examQuestionId: string;
  questionId: string;
  assignedPoints: number;
  order: number;
};

export type ExamStatus = "draft" | "published";

export type SavedExamRecord = {
  id: string;
  title: string;
  grade: string;
  subject: string;
  topic: string;
  durationInMinutes: number;
  status: ExamStatus;
  totalPoints: number;
  questionCount: number;
  savedAt: string;
  questions: ExamQuestionItem[];
  sentClassIds?: string[];
};

export type ExamQuestionDetail = ExamQuestionItem & { question: Question };

export type PendingExamTransfer = {
  questionIds: string[];
  exam?: Partial<Pick<ExamComposerState, "grade" | "subject" | "topic">>;
};
