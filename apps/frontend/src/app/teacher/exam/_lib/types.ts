import type { Question } from "../../question-bank/_lib/types";

export type ExamComposerState = {
  title: string;
  grade: string;
  classGroup: string;
  subject: string;
  topic: string;
  durationInMinutes: number;
  requiresSchoolApproval: boolean;
  approvalExamDate: string;
  approvalStartTime: string;
  approvalEndTime: string;
  approvalLocation: string;
};

export type ExamQuestionItem = {
  examQuestionId: string;
  questionId: string;
  assignedPoints: number;
  order: number;
};

export type ExamStatus = "draft" | "published";
export type ExamApprovalStatus =
  | "not_required"
  | "pending"
  | "approved"
  | "needs_fix";

export type SavedExamRecord = {
  id: string;
  title: string;
  grade: string;
  classGroup: string;
  subject: string;
  topic: string;
  durationInMinutes: number;
  status: ExamStatus;
  totalPoints: number;
  questionCount: number;
  savedAt: string;
  questions: ExamQuestionItem[];
  requiresSchoolApproval?: boolean;
  approvalStatus?: ExamApprovalStatus;
  sentClassIds?: string[];
  /** classId -> овог нэвтрэхүйн нэр (сурагчийн хуудасны код тааруулахад). */
  sentClassLabels?: Record<string, string>;
  approvalExamDate: string;
  approvalStartTime: string;
  approvalEndTime: string;
  approvalLocation: string;
};

export type ExamQuestionDetail = ExamQuestionItem & { question: Question };

export type PendingExamTransfer = {
  questionIds: string[];
  questions?: Question[];
  exam?: Partial<Pick<ExamComposerState, "grade" | "subject" | "topic">>;
};
