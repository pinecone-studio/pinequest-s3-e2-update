export type OptionId = "A" | "B" | "C" | "D";

export type ExamQuestion = {
  id: number;
  questionNumber: number;
  title: string;
  text: string;
  type: "multiple_choice";
  options: Array<{ id: OptionId; text: string }>;
  /** Сервер руу илгээхэд test мөрийн id (MCQ). */
  sourceTestId?: string;
  correctAnswer: OptionId;
};

export type ExamData = {
  title: string;
  schoolYear: string;
  term: string;
  durationMinutes: number;
  questions: ExamQuestion[];
};

export type ExamPhase = "entry" | "precheck" | "exam";
