import type { QuestionFilters } from "./types";

export const QUESTION_BANK_FILTER_DEFAULTS: QuestionFilters = {
  search: "",
  questionType: "all",
  difficulty: "all",
  subject: "all",
  grade: "all",
  subtopic: "all",
  status: "all",
  sortBy: "newest",
};

export const GRADE_OPTIONS = [
  "4-р анги",
  "5-р анги",
  "6-р анги",
  "7-р анги",
  "8-р анги",
  "9-р анги",
  "10-р анги",
  "11-р анги",
  "12-р анги",
] as const;

export const SUBJECT_OPTIONS = [
  "Математик",
  "Хими",
  "Физик",
  "Биологи",
  "Англи хэл",
  "Бусад хичээл",
] as const;

export const SUBTOPIC_OPTIONS = {
  "Математик": ["Алгебр", "Геометр", "Тригонометр", "Магадлал", "Статистик"],
  "Хими": ["Ерөнхий хими", "Органик хими", "Аналитик хими", "Физик хими"],
  "Физик": ["Кинематик", "Динамик", "Дулаан", "Цахилгаан", "Оптик"],
  "Биологи": ["Эс судлал", "Генетик", "Экологи", "Хүний биологи"],
  "Англи хэл": ["Грамматик", "Уншлага", "Сонсгол", "Бичгийн чадвар"],
  "Бусад хичээл": ["Ерөнхий"],
} as const;

export const EXAM_DESTINATIONS = [
  "Явцын шалгалт",
  "STEM долоо хоногийн сорил",
  "Эцсийн шалгалтын бүтээгч",
  "Дадлагын тестийн багц",
] as const;
