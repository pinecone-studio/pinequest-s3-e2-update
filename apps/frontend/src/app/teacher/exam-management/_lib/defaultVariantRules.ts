import type { VariantRules } from "./types";

/**
 * Багшид тохируулга харуулахгүй — системийн урьдчилсан тохиргоо.
 * Олон сонголтын дараалал, асуултын дараалал зэргийг автоматаар хийх.
 */
export function getDefaultTeacherVariantRules(): VariantRules {
  return {
    shuffleQuestionOrder: true,
    shuffleAnswerChoices: true,
    preserveGroupedQuestions: true,
    preserveSectionOrder: true,
    strategy: "dynamic_per_student",
    variantCount: 3,
  };
}
