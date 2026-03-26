export type ExamTemplateStatus =
  | "draft"
  | "parsed"
  | "variants_ready"
  | "assigned"
  | "sent"
  | "archived";

export type QuestionType = "multiple_choice" | "short_answer" | "essay" | "true_false";

export type Choice = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  /** Teacher-facing text (source of truth for grading mapping). */
  text: string;
  type: QuestionType;
  /** For MC / true_false */
  choices: Choice[];
  /** For MC / true_false, stored as choice.id (never "A/B/C"). */
  correctChoiceId?: string;
  score: number;
  /**
   * Teacher-controlled flag: questions are not moved during question order shuffle.
   * (Also applies to non-MC types via engine rules.)
   */
  preserveOrder?: boolean;

  /** Grouping model for shuffle behavior. */
  section?: { id: string; title: string; preserveSectionOrder?: boolean };
  group?: { id: string; title: string; preserveGroupTogether?: boolean };
};

export type ExamTemplate = {
  id: string;
  title: string;
  subject: string;
  instructions: string;
  durationMinutes: number;
  totalMarks: number;
  gradeLevel: string;
  note?: string;

  /** Source PDF only (not delivered). */
  sourcePdf?: { fileName: string; sizeBytes: number };

  questions: Question[];
  status: ExamTemplateStatus;
  templateLocked?: boolean;
  /** Stored after Variant Settings step. */
  variantRules?: VariantRules;

  createdAt: string; // YYYY-MM-DD
  updatedAt: string; // ISO
  parseIssues?: { id: string; label: string; severity: "warning" | "error"; questionId?: string }[];
};

export type VariantStrategy = "dynamic_per_student" | "limited_shared_variants";

export type VariantRules = {
  shuffleQuestionOrder: boolean;
  shuffleAnswerChoices: boolean;
  preserveGroupedQuestions: boolean;
  preserveSectionOrder: boolean;

  strategy: VariantStrategy;
  /** Only used for limited_shared_variants. */
  variantCount: 2 | 3 | 4 | 5;
};

export type VariantLabel = "A" | "B" | "C" | "D" | "E";

export type DisplayChoice = {
  /** Display choice text */
  text: string;
  /** Original choice id (grading uses this) */
  originalChoiceId: string;
};

export type DisplayQuestion = {
  originalQuestionId: string;
  text: string;
  type: QuestionType;
  score: number;

  sectionTitle?: string;
  groupTitle?: string;

  /** For MC / true_false */
  displayChoices?: DisplayChoice[];
};

export type StudentVersion = {
  studentId: string;
  /** For limited variants, indicates which variant label this student received. */
  variantLabel?: VariantLabel;
  /** Ordered list of questions for this student. */
  displayQuestionIds: string[];
  /** Per-question display ordering of choices (MC / true_false). */
  displayChoiceOrderByQuestionId: Record<string, string[]>; // questionId -> choiceId[]
  createdAt: string;
};

export type Delivery = {
  id: string;
  templateId: string;
  classId: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO

  rules: VariantRules;
  /** Shared link token/delivery id. */
  sharedDeliveryLink: string;

  status: "draft" | "sent";
  sentAt?: string;

  /** When sent: persisted versions for each student. */
  studentVersionsByStudentId: Record<string, StudentVersion>;
};

export type StudentAnswer =
  | { type: "multiple_choice" | "true_false"; selectedChoiceId: string }
  | { type: "short_answer" | "essay"; text: string };

export type StudentSubmission = {
  id: string;
  deliveryId: string;
  templateId: string;
  studentId: string;

  startedAt?: string;
  submittedAt?: string;
  status: "not_started" | "in_progress" | "submitted";

  /** Keyed by original question id. */
  answersByQuestionId: Record<string, StudentAnswer>;

  /** Auto-graded score for auto-gradable types. */
  autoScore: number;
  autoCorrectCount: number;
  autoTotalCount: number;

  /** Teacher grading for manual types. */
  manualByQuestionId: Record<
    string,
    { score: number | null; feedback: string; status: "pending" | "scored" }
  >;

  finalScore?: number | null;
  teacherStatus: "pending" | "graded" | "published";
  teacherNote?: string;
};

