import type { Question, QuestionFilters, SortOption } from "../types";

export const initialFilters: QuestionFilters = {
  subject: "all",
  type: "all",
  difficulty: "all",
  gradeLevel: "all",
  status: "all",
  skillTag: "all",
};

export function isWeakQuestion(question: Question): boolean {
  return (
    question.correctRate < 40 ||
    (question.usageCount > 20 && question.correctRate < 50)
  );
}

export function needsReviewFromArchive(question: Question): boolean {
  return (
    question.status === "Archived" &&
    question.usageCount >= 20 &&
    question.correctRate < 60
  );
}

export function filterQuestions(
  questions: Question[],
  keyword: string,
  filters: QuestionFilters,
): Question[] {
  const key = keyword.trim().toLowerCase();

  return questions.filter((q) => {
    const matchKeyword =
      key.length === 0 ||
      q.title.toLowerCase().includes(key) ||
      q.content.toLowerCase().includes(key) ||
      q.topic.toLowerCase().includes(key);

    return (
      matchKeyword &&
      (filters.subject === "all" || q.subject === filters.subject) &&
      (filters.type === "all" || q.type === filters.type) &&
      (filters.difficulty === "all" || q.difficulty === filters.difficulty) &&
      (filters.gradeLevel === "all" || q.gradeLevel === filters.gradeLevel) &&
      (filters.status === "all" || q.status === filters.status) &&
      (filters.skillTag === "all" || q.skillTag === filters.skillTag)
    );
  });
}

export function sortQuestions(
  questions: Question[],
  sortBy: SortOption,
): Question[] {
  const cloned = [...questions];

  cloned.sort((a, b) => {
    if (sortBy === "most_used") return b.usageCount - a.usageCount;
    if (sortBy === "least_used") return a.usageCount - b.usageCount;
    if (sortBy === "highest_correct_rate") return b.correctRate - a.correctRate;
    if (sortBy === "lowest_correct_rate") return a.correctRate - b.correctRate;
    if (sortBy === "newest") {
      return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime();
    }
    return new Date(a.lastUsedAt).getTime() - new Date(b.lastUsedAt).getTime();
  });

  return cloned;
}

export function calculateInsights(questions: Question[]) {
  const totalQuestions = questions.length;
  const activeQuestions = questions.filter((q) => q.status === "Active").length;

  const avgCorrectRate =
    totalQuestions === 0
      ? 0
      : Math.round(
          questions.reduce((acc, q) => acc + q.correctRate, 0) / totalQuestions,
        );

  const questionsNeedingReview = questions.filter(
    (q) => isWeakQuestion(q) || needsReviewFromArchive(q),
  ).length;

  return {
    totalQuestions,
    activeQuestions,
    avgCorrectRate,
    questionsNeedingReview,
  };
}

export function recommendationFor(question: Question): string {
  if (question.correctRate < 40) {
    return "Энэ асуулт хэт хэцүү байж магадгүй. Нэмэлт чиглэл эсвэл өгүүлбэрийн ойлгомжийг сайжруулна уу.";
  }

  if (question.usageCount > 20 && question.correctRate < 50) {
    return "Энэ асуултыг олон ашигласан ч үр дүн сул байна. Сонголтын хувилбар болон асуултын тодорхой байдлыг сайжруулахыг зөвлөж байна.";
  }

  if (question.usageCount > 25 && question.correctRate > 75) {
    return "Тэнцвэр сайн: тогтвортой гүйцэтгэлтэй, дахин ашиглахад найдвартай асуулт байна.";
  }

  return "Энэ асуултын үзүүлэлт хэвийн түвшинд байна. Ашиглалтын давтамж өсөх үед дахин ажиглаарай.";
}
