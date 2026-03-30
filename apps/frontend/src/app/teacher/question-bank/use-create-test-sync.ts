"use client";

import type { Question, QuestionBuilderValues } from "./types";

/**
 * Question-bank mock: backend mutation-уудгүй, зөвхөн локал төлөвтэй ажиллана.
 */
export function useCreateTestSync() {
  const createQuestionInBackend = async (_values: QuestionBuilderValues) =>
    crypto.randomUUID();

  const updateQuestionInBackend = async (
    _questionId: string,
    _values: QuestionBuilderValues,
    _usageCount: number,
  ) => Promise.resolve();

  const incrementUsageInBackend = async (_questions: Question[]) =>
    Promise.resolve();

  return { createQuestionInBackend, incrementUsageInBackend, updateQuestionInBackend };
}
