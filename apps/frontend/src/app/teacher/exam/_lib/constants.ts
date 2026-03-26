import type { ExamComposerState } from "./types";

export const SAVED_EXAMS_STORAGE_KEY = "teacher-exam-saved-exams";

export const EXAM_GRADE_OPTIONS = [
  "6-р анги",
  "7-р анги",
  "8-р анги",
  "9-р анги",
  "10-р анги",
  "11-р анги",
  "12-р анги",
] as const;

export const INITIAL_FORM: ExamComposerState = {
  title: "",
  grade: "6-р анги",
  subject: "Математик",
  topic: "Бутархай",
  durationInMinutes: 40,
};
