export type QuestionType = "multiple_choice" | "short_answer" | "essay";
export type Subject =
  | "Математик"
  | "Физик"
  | "Хими"
  | "Англи хэл"
  | "Монгол хэл"
  | "Биологи";
export type Difficulty = "Хялбар" | "Дунд" | "Хэцүү";
export type SkillTag = "Логик" | "Цээжлэх" | "Шинжилгээ" | "Бодлого бодолт";
export type QuestionStatus = "Идэвхтэй" | "Ноорог" | "Архивласан";
export type QualityTone = "good" | "warning" | "danger";

export type Question = {
  id: string;
  title: string;
  content: string;
  type: QuestionType;
  subject: Subject;
  topic: string;
  gradeLevel: string;
  difficulty: Difficulty;
  skillTag: SkillTag;
  usageCount: number;
  correctRate: number;
  status: QuestionStatus;
  createdBy: string;
  lastUsedAt: string;
  choices?: string[];
  answerKey?: string;
};

export type QuestionFilters = {
  subject: Subject | "Бүгд";
  type: QuestionType | "Бүгд";
  difficulty: Difficulty | "Бүгд";
  status: QuestionStatus | "Бүгд";
  skillTag: SkillTag | "Бүгд";
};

export type SortOption =
  | "most_used"
  | "least_used"
  | "highest_correct"
  | "lowest_correct"
  | "newest"
  | "oldest";

export type QualityInfo = {
  tone: QualityTone;
  label: string;
  details: string;
};

export type ExamDraft = {
  title: string;
  subject: Subject;
  durationMinutes: number;
  selectedQuestionIds: string[];
  variants: Record<"A" | "B" | "C", string[]>;
  isSent: boolean;
};

export type StudentAnswerValue = string;
export type StudentAnswers = Record<string, StudentAnswerValue>;

export type QuestionReviewState = "Auto-Graded" | "Pending Review" | "Reviewed";

export type QuestionResult = {
  questionId: string;
  score: number;
  maxScore: number;
  state: QuestionReviewState;
};

export type StudentExamResult = {
  studentName: string;
  score: number;
  maxScore: number;
  status: "Илгээсэн" | "Хүлээгдэж буй";
  submittedAt: string;
};

export const SUBJECTS: Subject[] = [
  "Математик",
  "Физик",
  "Хими",
  "Англи хэл",
  "Монгол хэл",
  "Биологи",
];

export const QUESTION_TYPES: QuestionType[] = [
  "multiple_choice",
  "short_answer",
  "essay",
];

export const DIFFICULTIES: Difficulty[] = ["Хялбар", "Дунд", "Хэцүү"];
export const QUESTION_STATUSES: QuestionStatus[] = ["Идэвхтэй", "Ноорог", "Архивласан"];
export const SKILL_TAGS: SkillTag[] = ["Логик", "Цээжлэх", "Шинжилгээ", "Бодлого бодолт"];
