import type {
  ExamDraft,
  Question,
  QuestionFilters,
  QualityInfo,
  SortOption,
  StudentAnswers,
  QuestionResult,
} from "./types";

export const questionTypeLabel = {
  multiple_choice: "Сонголттой",
  short_answer: "Богино хариулт",
  essay: "Эсээ",
} as const;

export const defaultFilters: QuestionFilters = {
  subject: "Бүгд",
  type: "Бүгд",
  difficulty: "Бүгд",
  status: "Бүгд",
  skillTag: "Бүгд",
};

export function qualityOf(question: Question): QualityInfo {
  if (question.usageCount > 20 && question.correctRate < 50) {
    return {
      tone: "danger",
      label: "Сул + Олон ашигласан",
      details: "Энэ асуултыг шинэчлэх шаардлагатай",
    };
  }
  if (question.correctRate < 40) {
    return {
      tone: "danger",
      label: "Needs Review",
      details: "Зөв хариултын хувь маш бага",
    };
  }
  if (question.correctRate > 90) {
    return {
      tone: "warning",
      label: "Too Easy",
      details: "Асуулт хэт амархан байж магадгүй",
    };
  }
  if (question.usageCount > 20) {
    return {
      tone: "warning",
      label: "Overused",
      details: "Олон дахин ашиглагдсан",
    };
  }

  return {
    tone: "good",
    label: "Good Question",
    details: "Тэнцвэртэй гүйцэтгэлтэй",
  };
}

export function hasDuplicatePattern(question: Question, all: Question[]) {
  const words = question.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  return all.some((q) => {
    if (q.id === question.id) return false;
    const title = q.title.toLowerCase();
    return words.some((word) => title.includes(word));
  });
}

export function filterQuestions(
  questions: Question[],
  keyword: string,
  filters: QuestionFilters,
) {
  const key = keyword.trim().toLowerCase();
  return questions.filter((q) => {
    const keywordMatch =
      key.length === 0 ||
      q.title.toLowerCase().includes(key) ||
      q.content.toLowerCase().includes(key) ||
      q.topic.toLowerCase().includes(key);

    return (
      keywordMatch &&
      (filters.subject === "Бүгд" || q.subject === filters.subject) &&
      (filters.type === "Бүгд" || q.type === filters.type) &&
      (filters.difficulty === "Бүгд" || q.difficulty === filters.difficulty) &&
      (filters.status === "Бүгд" || q.status === filters.status) &&
      (filters.skillTag === "Бүгд" || q.skillTag === filters.skillTag)
    );
  });
}

export function sortQuestions(questions: Question[], sortBy: SortOption) {
  const items = [...questions];
  items.sort((a, b) => {
    if (sortBy === "most_used") return b.usageCount - a.usageCount;
    if (sortBy === "least_used") return a.usageCount - b.usageCount;
    if (sortBy === "highest_correct") return b.correctRate - a.correctRate;
    if (sortBy === "lowest_correct") return a.correctRate - b.correctRate;
    if (sortBy === "newest") {
      return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime();
    }
    return new Date(a.lastUsedAt).getTime() - new Date(b.lastUsedAt).getTime();
  });
  return items;
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateVariants(ids: string[]): ExamDraft["variants"] {
  return {
    A: ids,
    B: shuffle(ids),
    C: shuffle(ids),
  };
}

export function examWarnings(questions: Question[]) {
  const overused = questions.filter((q) => q.usageCount > 20).length;
  const weak = questions.filter((q) => q.correctRate < 40).length;
  const easy = questions.filter((q) => q.correctRate > 90).length;
  const duplicateLike = questions.filter((q) => hasDuplicatePattern(q, questions)).length;
  return { overused, weak, easy, duplicateLike };
}

export function gradeAnswers(
  questions: Question[],
  answers: StudentAnswers,
): QuestionResult[] {
  return questions.map((question) => {
    const answer = (answers[question.id] ?? "").trim().toLowerCase();
    if (question.type === "essay") {
      return {
        questionId: question.id,
        score: 0,
        maxScore: 2,
        state: "Pending Review",
      };
    }

    if (question.type === "multiple_choice") {
      const isCorrect = answer === (question.answerKey ?? "").trim().toLowerCase();
      return {
        questionId: question.id,
        score: isCorrect ? 1 : 0,
        maxScore: 1,
        state: "Auto-Graded",
      };
    }

    const expected = (question.answerKey ?? "").trim().toLowerCase();
    const isSimilar = expected.length > 0 && answer.includes(expected.slice(0, 3));
    return {
      questionId: question.id,
      score: isSimilar ? 1 : 0,
      maxScore: 1,
      state: isSimilar ? "Auto-Graded" : "Reviewed",
    };
  });
}
