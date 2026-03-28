export type ExamScheduleStatus = "scheduled" | "completed" | "cancelled";

export type TeacherExamSchedule = {
  id: string;
  teacherId: string;
  subject: string;
  className: string;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: ExamScheduleStatus;
  notes?: string;
};

export type TeacherExamScheduleInput = {
  teacherId: string;
  subject: string;
  className: string;
  examDate: string;
  startTime: string;
  endTime: string;
  status: ExamScheduleStatus;
  notes?: string;
};

export type TeacherExamScheduleFormValues = TeacherExamScheduleInput & {
  id?: string;
};

export type ScheduleActionResult = {
  ok: boolean;
  error?: string;
};
