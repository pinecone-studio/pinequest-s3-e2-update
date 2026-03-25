import type {
  DashboardStats,
  Question,
  QuestionFilters,
  QuestionQuality,
  SortOption,
} from "./types";

export const subjectLabel = {
  Math: "Математик",
  Physics: "Физик",
  Chemistry: "Хими",
  English: "Англи хэл",
} as const;

export const typeLabel = {
  multiple_choice: "Сонголттой",
  short_answer: "Богино хариулт",
  essay: "Эсээ",
} as const;

export const difficultyLabel = {
  Easy: "Хялбар",
  Medium: "Дунд",
  Hard: "Хэцүү",
} as const;

export const statusLabel = {
  Active: "Идэвхтэй",
  Draft: "Ноорог",
  Archived: "Архивласан",
} as const;

export function getInitialFilters(): QuestionFilters {
  return {
    subject: "all",
    type: "all",
    difficulty: "all",
    gradeLevel: "all",
    status: "all",
    skillTag: "all",
  };
}

export function needsReview(question: Question): boolean {
  return (
    question.correctRate < 40 ||
    (question.usageCount > 20 && question.correctRate < 50) ||
    (question.status === "Archived" && question.usageCount > 20)
  );
}

export function detectQuestionQuality(question: Question): QuestionQuality {
  if (question.usageCount > 20 && question.correctRate < 50) {
    return {
      tone: "danger",
      label: "Сайжруулах шаардлагатай",
      recommendation:
        "Олон давтагдсан боловч амжилтын хувь сул байна. Асуулгын бүтэц, хувилбараа шинэчлэх шаардлагатай.",
    };
  }

  if (question.correctRate < 40) {
    return {
      tone: "danger",
      label: "Сайжруулах шаардлагатай",
      recommendation:
        "Энэ асуулт сурагчдад хэт хүндрэлтэй байж магадгүй. Үг хэллэгээ энгийн болгож, чиглүүлэх өгүүлбэр нэмээрэй.",
    };
  }

  if (question.correctRate > 90 || question.usageCount > 20) {
    return {
      tone: "warning",
      label: "Хэт амархан эсвэл олон давтагдсан",
      recommendation:
        "Асуулт хэт амархан эсвэл давтамж өндөр байна. Шинэ хувилбар нэмж шалгалтын чанарыг тэнцвэржүүлээрэй.",
    };
  }

  return {
    tone: "good",
    label: "Сайн тэнцвэр",
    recommendation:
      "Үзүүлэлт тогтвортой байна. Одоогийн байдлаар дахин ашиглахад тохиромжтой асуулт.",
  };
}

export function calculateStats(questions: Question[]): DashboardStats {
  const totalQuestions = questions.length;
  const activeQuestions = questions.filter((item) => item.status === "Active").length;
  const averageCorrectRate =
    totalQuestions === 0
      ? 0
      : Math.round(
          questions.reduce((sum, item) => sum + item.correctRate, 0) / totalQuestions,
        );
  const questionsNeedingReview = questions.filter((item) => needsReview(item)).length;

  return {
    totalQuestions,
    activeQuestions,
    averageCorrectRate,
    questionsNeedingReview,
  };
}

export function filterQuestions(
  questions: Question[],
  keyword: string,
  filters: QuestionFilters,
): Question[] {
  const normalized = keyword.trim().toLowerCase();

  return questions.filter((item) => {
    const keywordMatch =
      normalized.length === 0 ||
      item.title.toLowerCase().includes(normalized) ||
      item.content.toLowerCase().includes(normalized) ||
      item.topic.toLowerCase().includes(normalized);

    return (
      keywordMatch &&
      (filters.subject === "all" || item.subject === filters.subject) &&
      (filters.type === "all" || item.type === filters.type) &&
      (filters.difficulty === "all" || item.difficulty === filters.difficulty) &&
      (filters.gradeLevel === "all" || item.gradeLevel === filters.gradeLevel) &&
      (filters.status === "all" || item.status === filters.status) &&
      (filters.skillTag === "all" || item.skillTag === filters.skillTag)
    );
  });
}

export function sortQuestions(questions: Question[], sortBy: SortOption): Question[] {
  const sorted = [...questions];

  sorted.sort((a, b) => {
    if (sortBy === "most_used") return b.usageCount - a.usageCount;
    if (sortBy === "least_used") return a.usageCount - b.usageCount;
    if (sortBy === "highest_correct_rate") return b.correctRate - a.correctRate;
    if (sortBy === "lowest_correct_rate") return a.correctRate - b.correctRate;
    if (sortBy === "newest") {
      return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime();
    }

    return new Date(a.lastUsedAt).getTime() - new Date(b.lastUsedAt).getTime();
  });

  return sorted;
}

export function findDuplicateCandidates(
  questions: Question[],
  input: string,
): Question[] {
  const cleaned = input.trim().toLowerCase();
  if (cleaned.length < 5) return [];

  const keywords = cleaned.split(/\s+/).filter((word) => word.length >= 3);
  if (keywords.length === 0) return [];

  return questions
    .filter((item) => {
      const target = `${item.title} ${item.content} ${item.topic}`.toLowerCase();
      const matchedCount = keywords.filter((word) => target.includes(word)).length;
      return matchedCount >= 2;
    })
    .slice(0, 3);
}
