export type QuestionType = "multiple_choice" | "short_answer" | "essay";
export type Subject = "Math" | "Physics" | "Chemistry" | "English";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type SkillTag = "Logic" | "Memory" | "Analysis" | "Problem Solving";
export type QuestionStatus = "Active" | "Draft" | "Archived";

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
  createdBy: string;
  lastUsedAt: string;
  status: QuestionStatus;
};

export type NewQuestionInput = {
  title: string;
  content: string;
  type: QuestionType;
  subject: Subject;
  topic: string;
  gradeLevel: string;
  difficulty: Difficulty;
  skillTag: SkillTag;
  status: QuestionStatus;
};

export type QuestionFilters = {
  subject: Subject | "all";
  type: QuestionType | "all";
  difficulty: Difficulty | "all";
  gradeLevel: string | "all";
  status: QuestionStatus | "all";
  skillTag: SkillTag | "all";
};

export type SortOption =
  | "most_used"
  | "least_used"
  | "highest_correct_rate"
  | "lowest_correct_rate"
  | "newest"
  | "oldest";

export type QuestionQuality = {
  label: "Сайн тэнцвэр" | "Хэт амархан эсвэл олон давтагдсан" | "Сайжруулах шаардлагатай";
  tone: "good" | "warning" | "danger";
  recommendation: string;
};

export type DashboardStats = {
  totalQuestions: number;
  activeQuestions: number;
  averageCorrectRate: number;
  questionsNeedingReview: number;
};

export type ToastState = {
  message: string;
  tone: "success" | "info";
};

export const SUBJECTS: Subject[] = ["Math", "Physics", "Chemistry", "English"];
export const QUESTION_TYPES: QuestionType[] = [
  "multiple_choice",
  "short_answer",
  "essay",
];
export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
export const QUESTION_STATUSES: QuestionStatus[] = ["Active", "Draft", "Archived"];
export const SKILL_TAGS: SkillTag[] = [
  "Logic",
  "Memory",
  "Analysis",
  "Problem Solving",
];
