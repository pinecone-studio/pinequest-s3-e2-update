export type TeacherClass = {
  id: string;
  name: string;
  /** Matches `EXAM_GRADE_OPTIONS` / saved exam grade labels */
  grade: string;
  studentCount: number;
};
