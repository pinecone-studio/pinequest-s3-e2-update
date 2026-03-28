export type ExamStatus =
  | "draft"
  | "scheduled"
  | "ongoing"
  | "grading"
  | "completed";

export type AlertType = "warning" | "info";

export type SchoolExam = {
  id: string;
  title: string;
  subject: string;
  className: string;
  teacherName: string;
  startAt: string;
  endAt: string;
  status: ExamStatus;
  studentCount: number;
  submittedCount: number;
  risk: string;
};

export type ExamAlert = {
  id: string;
  type: AlertType;
  title: string;
  description: string;
};
