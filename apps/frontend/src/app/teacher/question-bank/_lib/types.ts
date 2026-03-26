export const QUESTION_TYPES = [
  "multiple_choice",
  "short_answer",
  "long_answer",
  "formula_input",
  "image_based",
  "file_upload",
] as const;

export const QUESTION_DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const QUESTION_STATUSES = ["draft", "published"] as const;
export const QUESTION_GRADING_TYPES = ["auto", "manual", "hybrid"] as const;
export const QUESTION_SORT_OPTIONS = ["newest", "oldest", "most_used"] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];
export type QuestionDifficulty = (typeof QUESTION_DIFFICULTIES)[number];
export type QuestionStatus = (typeof QUESTION_STATUSES)[number];
export type QuestionGradingType = (typeof QUESTION_GRADING_TYPES)[number];
export type QuestionSortOption = (typeof QUESTION_SORT_OPTIONS)[number];

export type QuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuestionFileUploadConfig = {
  acceptedFileTypes: string[];
  instructions: string;
  maxFiles: number;
};

export type QuestionContent = {
  prompt: string;
  guidance?: string;
  explanation?: string;
};

export type Question = {
  id: string;
  title: string;
  questionType: QuestionType;
  content: QuestionContent;
  options: QuestionOption[];
  correctAnswer: string;
  rubric: string;
  formulaRaw: string;
  formulaPreview: string;
  imageUrl: string;
  fileUploadConfig: QuestionFileUploadConfig;
  grade: string;
  subject: string;
  topic: string;
  difficulty: QuestionDifficulty;
  points: number;
  status: QuestionStatus;
  gradingType: QuestionGradingType;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type QuestionFilters = {
  search: string;
  questionType: "all" | QuestionType;
  difficulty: "all" | QuestionDifficulty;
  subject: "all" | string;
  grade: "all" | string;
  subtopic: "all" | string;
  status: "all" | QuestionStatus;
  sortBy: QuestionSortOption;
};

export type QuestionBuilderValues = {
  id?: string;
  title: string;
  questionType: QuestionType;
  prompt: string;
  guidance: string;
  explanation: string;
  options: QuestionOption[];
  correctAnswer: string;
  rubric: string;
  formulaRaw: string;
  imageUrl: string;
  fileUploadConfig: QuestionFileUploadConfig;
  grade: string;
  subject: string;
  topic: string;
  difficulty: QuestionDifficulty;
  points: number;
  status: QuestionStatus;
};

export type QuestionValidationErrors = Partial<
  Record<
    | "title"
    | "prompt"
    | "grade"
    | "subject"
    | "topic"
    | "grade"
    | "points"
    | "options"
    | "correctAnswer"
    | "rubric"
    | "formulaRaw"
    | "imageUrl"
    | "fileUploadConfig",
    string
  >
>;
