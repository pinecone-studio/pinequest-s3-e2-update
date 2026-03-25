export type TabKey = "saved" | "create";
export type ExamVariant = "A" | "B" | "C" | "D";

export type QuestionType = "multiple_choice" | "short_answer" | "essay";
export type ExamStatus = "draft" | "saved" | "sent";

export type Question = {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  score: number;
};

export type Exam = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: number;
  questions: Question[];
  createdAt: string;
  status: ExamStatus;
};

export type TeacherClass = {
  id: string;
  name: string;
  grade: string;
  studentCount: number;
};

export type SentExam = {
  id: string;
  examId: string;
  classId: string;
  variant: ExamVariant;
  link: string;
  sentAt: string;
};

export type StudentAnswer = {
  questionId: string;
  value: string;
};
