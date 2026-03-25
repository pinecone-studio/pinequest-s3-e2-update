import type { Difficulty, QuestionStatus, QuestionType, SkillTag, Subject } from "../types";

export const subjectLabel: Record<Subject, string> = {
  Math: "Математик",
  Physics: "Физик",
  Chemistry: "Хими",
  English: "Англи хэл",
};

export const questionTypeLabel: Record<QuestionType, string> = {
  multiple_choice: "Сонголттой",
  short_answer: "Богино хариулт",
  essay: "Эсээ",
};

export const difficultyLabel: Record<Difficulty, string> = {
  Easy: "Хялбар",
  Medium: "Дунд",
  Hard: "Хэцүү",
};

export const skillLabel: Record<SkillTag, string> = {
  Logic: "Логик",
  Memory: "Цээжлэх",
  Analysis: "Шинжилгээ",
  "Problem Solving": "Бодлого бодолт",
};

export const statusLabel: Record<QuestionStatus, string> = {
  Active: "Идэвхтэй",
  Draft: "Ноорог",
  Archived: "Архивласан",
};
