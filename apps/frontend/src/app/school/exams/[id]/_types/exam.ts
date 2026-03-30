import type { AlertType, ExamStatus } from "../../_types/exam";

export type ExamDetailAlert = {
  id: string;
  type: AlertType;
  text: string;
};

export type ExamDetail = {
  id: string;
  title: string;
  subject: string;
  status: ExamStatus;
  className: string;
  teacherName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  room: string;
  examType: string;
  totalScore: number;
  studentCount: number;
  submittedCount: number;
  notStartedCount: number;
  questionCount: number;
  multipleChoiceCount: number;
  essayCount: number;
  autoGradedCount: number;
  manualReviewCount: number;
  autoGradingStatus: string;
  manualGradingStatus: string;
  finalResultStatus: string;
  notes: ExamDetailAlert[];
};
