import type {
  Question,
  QuestionBuilderValues,
  QuestionFileUploadConfig,
  QuestionFilters,
  QuestionGradingType,
  QuestionOption,
  QuestionStatus,
  QuestionType,
  QuestionValidationErrors,
} from "./types";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Сонгох асуулт",
  short_answer: "Богино хариулт",
  long_answer: "Дэлгэрэнгүй хариулт",
  formula_input: "Томьёоны оролт",
  image_based: "Зурагт суурилсан",
  file_upload: "Файл хавсаргах",
};

export const DIFFICULTY_LABELS = {
  easy: "Хялбар",
  medium: "Дунд",
  hard: "Хүнд",
} as const;

export const STATUS_LABELS: Record<QuestionStatus, string> = {
  draft: "Ноорог",
  published: "Нийтэлсэн",
};

export const GRADING_TYPE_LABELS: Record<QuestionGradingType, string> = {
  auto: "Автомат үнэлгээ",
  manual: "Гараар үнэлэх",
  hybrid: "Хосолмол үнэлгээ",
};

export const DEFAULT_FILE_UPLOAD_CONFIG: QuestionFileUploadConfig = {
  acceptedFileTypes: [".pdf", ".docx", ".png"],
  instructions: "Бодолтоо PDF эсвэл зураг хэлбэрээр хавсаргана уу.",
  maxFiles: 1,
};

export const PROMPT_IMAGE_PLACEHOLDER = "[ЗУРАГ]";

export function hasTraditionalMongolianText(value: string) {
  return /[\u1800-\u18AF]/.test(value);
}

export function stripPromptImagePlaceholder(prompt: string) {
  return prompt.split(PROMPT_IMAGE_PLACEHOLDER).join(" ");
}

export function normalizePromptText(prompt: string) {
  return stripPromptImagePlaceholder(prompt).replace(/\s+/g, " ").trim();
}

export function resolveQuestionTitle(title: string, prompt: string) {
  const normalizedTitle = title.trim();
  if (normalizedTitle) return normalizedTitle;

  const normalizedPrompt = normalizePromptText(prompt);
  if (!normalizedPrompt) return "";

  return normalizedPrompt.split(/\r?\n/)[0]?.trim() ?? "";
}

export function createEmptyOption(index: number): QuestionOption {
  return {
    id: `option-${index + 1}`,
    text: "",
    isCorrect: index === 0,
  };
}

export function createQuestionBuilderValues(
  type: QuestionType = "multiple_choice",
  overrides?: Partial<Pick<QuestionBuilderValues, "grade" | "subject">>,
): QuestionBuilderValues {
  return {
    title: "",
    questionType: type,
    prompt: "",
    guidance: "",
    explanation: "",
    options: [
      createEmptyOption(0),
      createEmptyOption(1),
      createEmptyOption(2),
      createEmptyOption(3),
    ],
    correctAnswer: "",
    rubric: "",
    formulaRaw: "",
    imageUrl: "",
    fileUploadConfig: DEFAULT_FILE_UPLOAD_CONFIG,
    grade: overrides?.grade ?? "6-р анги",
    subject: overrides?.subject ?? "Математик",
    subtopic: "",
    topic: "",
    difficulty: "medium",
    points: 5,
    status: "draft",
  };
}

export function inferGradingType(
  values: Pick<QuestionBuilderValues, "questionType">,
): QuestionGradingType {
  switch (values.questionType) {
    case "multiple_choice":
      return "auto";
    case "short_answer":
      return "hybrid";
    case "formula_input":
      return "hybrid";
    case "long_answer":
    case "image_based":
    case "file_upload":
      return "manual";
  }
}

export function renderFormulaPreview(input: string) {
  if (!input.trim()) return "Томьёоны урьдчилсан харагдац энд гарна.";

  return input
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)")
    .replace(/\\sqrt\{([^}]*)\}/g, "sqrt($1)")
    .replace(/\\times/g, "x")
    .replace(/\\pi/g, "pi")
    .replace(/\^\{([^}]*)\}/g, "^($1)")
    .replace(/_\{([^}]*)\}/g, "_($1)");
}

export type PromptDisplayPart =
  | { type: "text"; value: string }
  | { type: "image" };

export function promptHasImagePlaceholder(prompt: string) {
  return prompt.includes(PROMPT_IMAGE_PLACEHOLDER);
}

export function getPromptDisplayParts(prompt: string): PromptDisplayPart[] {
  const normalized = prompt.trim();
  if (!normalized) return [];

  return normalized
    .split(PROMPT_IMAGE_PLACEHOLDER)
    .flatMap((segment, index, array) => {
      const parts: PromptDisplayPart[] = [];
      const cleanedText = segment.trim();

      if (cleanedText) {
        parts.push({ type: "text", value: cleanedText });
      }

      if (index < array.length - 1) {
        parts.push({ type: "image" });
      }

      return parts;
    });
}

export function questionMatchesSearch(question: Question, search: string) {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    question.title,
    question.content.prompt,
    question.content.guidance,
    question.grade,
    question.subject,
    question.subtopic,
    question.topic,
    question.teacherName,
    QUESTION_TYPE_LABELS[question.questionType],
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

export function filterAndSortQuestions(
  questions: Question[],
  filters: QuestionFilters,
) {
  const filtered = questions.filter((question) => {
    if (!questionMatchesSearch(question, filters.search)) return false;
    if (
      filters.questionType === "multiple_choice" &&
      question.questionType !== "multiple_choice"
    ) {
      return false;
    }
    if (
      filters.questionType === "long_answer" &&
      question.questionType === "multiple_choice"
    ) {
      return false;
    }
    if (
      filters.difficulty !== "all" &&
      question.difficulty !== filters.difficulty
    )
      return false;
    if (filters.subject !== "all" && question.subject !== filters.subject)
      return false;
    if (filters.grade !== "all" && question.grade !== filters.grade)
      return false;
    if (
      filters.topic !== "all" &&
      question.topic !== filters.topic &&
      (question.subtopic ?? "") !== filters.topic
    ) {
      return false;
    }
    if (
      filters.subtopic !== "all" &&
      (question.subtopic ?? "") !== filters.subtopic
    )
      return false;
    if (filters.status !== "all" && question.status !== filters.status)
      return false;
    return true;
  });

  return filtered.sort((left, right) => {
    switch (filters.sortBy) {
      case "oldest":
        return (
          new Date(left.createdAt).getTime() -
          new Date(right.createdAt).getTime()
        );
      case "most_used":
        return right.usageCount - left.usageCount;
      case "newest":
      default:
        return (
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime()
        );
    }
  });
}

export function validateQuestion(
  values: QuestionBuilderValues,
): QuestionValidationErrors {
  const errors: QuestionValidationErrors = {};

  if (!values.prompt.trim())
    errors.prompt = "Сурагчид харагдах асуулгын текстийг оруулна уу.";
  if (!values.grade.trim()) errors.grade = "Анги сонгох эсвэл бичнэ үү.";
  if (!values.subject.trim())
    errors.subject = "Хичээлийн төрлийг сонгох эсвэл бичнэ үү.";
  if (!values.topic.trim()) errors.topic = "Сэдэв оруулна уу.";
  if (!Number.isFinite(values.points) || values.points <= 0)
    errors.points = "Оноо 0-ээс их байх ёстой.";

  if (values.questionType === "multiple_choice") {
    const filledOptions = values.options.filter((option) => option.text.trim());
    const hasCorrectOption = filledOptions.some((option) => option.isCorrect);
    if (filledOptions.length < 2)
      errors.options = "Дор хаяж хоёр сонголт оруулна уу.";
    if (!hasCorrectOption) errors.options = "Нэг зөв хариултыг тэмдэглэнэ үү.";
  }

  if (values.questionType === "short_answer" && !values.correctAnswer.trim()) {
    errors.correctAnswer = "Хүлээгдэж буй хариултыг оруулна уу.";
  }

  if (values.questionType === "formula_input" && !values.formulaRaw.trim()) {
    errors.formulaRaw = "Хүлээгдэж буй томьёог оруулна уу.";
  }

  if (values.questionType === "image_based" && !values.imageUrl.trim()) {
    errors.imageUrl = "Зураг оруулах эсвэл хавсаргана уу.";
  }

  if (values.questionType === "file_upload") {
    if (!values.fileUploadConfig.instructions.trim()) {
      errors.fileUploadConfig = "Файл хавсаргах заавар нэмнэ үү.";
    } else if (values.fileUploadConfig.acceptedFileTypes.length === 0) {
      errors.fileUploadConfig =
        "Дор хаяж нэг зөвшөөрөгдөх файлын төрлийг оруулна уу.";
    }
  }

  return errors;
}

export function buildQuestionPayload(
  values: QuestionBuilderValues,
  existingQuestion?: Question,
): Question {
  const now = new Date().toISOString();
  const normalizedOptions = values.options
    .filter((option) => option.text.trim())
    .map((option) => ({ ...option, text: option.text.trim() }));

  return {
    id:
      existingQuestion?.id ??
      `question-${Math.random().toString(36).slice(2, 10)}`,
    title: resolveQuestionTitle(values.title, values.prompt),
    questionType: values.questionType,
    source: existingQuestion?.source ?? "school",
    teacherName: existingQuestion?.teacherName,
    isLocalOnly: existingQuestion?.isLocalOnly ?? false,
    content: {
      prompt: values.prompt.trim(),
      guidance: values.guidance.trim(),
      explanation: values.explanation.trim(),
    },
    options: normalizedOptions,
    correctAnswer:
      values.questionType === "multiple_choice"
        ? (normalizedOptions.find((option) => option.isCorrect)?.text ?? "")
        : values.correctAnswer.trim(),
    rubric: values.rubric.trim(),
    formulaRaw: values.formulaRaw.trim(),
    formulaPreview: renderFormulaPreview(values.formulaRaw),
    imageUrl: values.imageUrl.trim(),
    fileUploadConfig: values.fileUploadConfig,
    grade: values.grade.trim(),
    subject: values.subject.trim(),
    subtopic: values.subtopic.trim() || undefined,
    topic: values.topic.trim(),
    difficulty: values.difficulty,
    points: values.points,
    status: values.status,
    gradingType: inferGradingType(values),
    usageCount: existingQuestion?.usageCount ?? 0,
    createdAt: existingQuestion?.createdAt ?? now,
    updatedAt: now,
  };
}

export function mapQuestionToBuilderValues(
  question: Question,
): QuestionBuilderValues {
  return {
    id: question.id,
    title: question.title,
    questionType: question.questionType,
    prompt: question.content.prompt,
    guidance: question.content.guidance ?? "",
    explanation: question.content.explanation ?? "",
    options:
      question.options.length > 0
        ? question.options
        : [
            createEmptyOption(0),
            createEmptyOption(1),
            createEmptyOption(2),
            createEmptyOption(3),
          ],
    correctAnswer: question.correctAnswer,
    rubric: question.rubric,
    formulaRaw: question.formulaRaw,
    imageUrl: question.imageUrl,
    fileUploadConfig: question.fileUploadConfig,
    grade: question.grade,
    subject: question.subject,
    subtopic: question.subtopic ?? "",
    topic: question.topic,
    difficulty: question.difficulty,
    points: question.points,
    status: question.status,
  };
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const months = [
    "1-р сар",
    "2-р сар",
    "3-р сар",
    "4-р сар",
    "5-р сар",
    "6-р сар",
    "7-р сар",
    "8-р сар",
    "9-р сар",
    "10-р сар",
    "11-р сар",
    "12-р сар",
  ];

  return `${date.getUTCFullYear()} оны ${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
}
