"use client";

import { useMemo, useState } from "react";
import { EXAM_DESTINATIONS, MOCK_QUESTIONS, QUESTION_BANK_FILTER_DEFAULTS } from "../_lib/mock-data";
import type { Question, QuestionBuilderValues, QuestionFilters, QuestionValidationErrors } from "../_lib/types";
import {
  buildQuestionPayload,
  filterAndSortQuestions,
  mapQuestionToBuilderValues,
  validateQuestion,
} from "../_lib/utils";

export function useQuestionBank() {
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [filters, setFilters] = useState<QuestionFilters>(QUESTION_BANK_FILTER_DEFAULTS);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(MOCK_QUESTIONS[0]?.id ?? null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [lastValidationErrors, setLastValidationErrors] = useState<QuestionValidationErrors>({});
  const [reuseTarget, setReuseTarget] = useState<(typeof EXAM_DESTINATIONS)[number]>(EXAM_DESTINATIONS[0]);

  const filteredQuestions = useMemo(
    () => filterAndSortQuestions(questions, filters),
    [filters, questions],
  );

  const selectedQuestions = useMemo(
    () => questions.filter((question) => selectedQuestionIds.includes(question.id)),
    [questions, selectedQuestionIds],
  );

  const activeQuestion = useMemo(
    () => questions.find((question) => question.id === activeQuestionId) ?? filteredQuestions[0] ?? null,
    [activeQuestionId, filteredQuestions, questions],
  );

  const editingQuestion = useMemo(
    () => questions.find((question) => question.id === editingQuestionId) ?? null,
    [editingQuestionId, questions],
  );

  const subjectOptions = useMemo(
    () => Array.from(new Set(questions.map((question) => question.subject))).sort(),
    [questions],
  );

  const summary = useMemo(() => {
    const publishedCount = questions.filter((question) => question.status === "published").length;
    const draftCount = questions.filter((question) => question.status === "draft").length;
    const manualCount = questions.filter((question) => question.gradingType === "manual").length;
    return {
      total: questions.length,
      published: publishedCount,
      draft: draftCount,
      manual: manualCount,
    };
  }, [questions]);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.clearTimeout((showToast as unknown as { timeout?: number }).timeout);
    (showToast as unknown as { timeout?: number }).timeout = window.setTimeout(() => {
      setToastMessage("");
    }, 2400);
  };

  const updateFilters = (partial: Partial<QuestionFilters>) => {
    setFilters((current) => ({ ...current, ...partial }));
  };

  const clearFilters = () => {
    setFilters(QUESTION_BANK_FILTER_DEFAULTS);
  };

  const openCreateBuilder = () => {
    setEditingQuestionId(null);
    setLastValidationErrors({});
    setIsBuilderOpen(true);
  };

  const openEditBuilder = (questionId: string) => {
    setEditingQuestionId(questionId);
    setActiveQuestionId(questionId);
    setLastValidationErrors({});
    setIsBuilderOpen(true);
  };

  const closeBuilder = () => {
    setIsBuilderOpen(false);
    setEditingQuestionId(null);
    setLastValidationErrors({});
  };

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestionIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  };

  const toggleVisibleSelection = () => {
    const visibleIds = filteredQuestions.map((question) => question.id);
    const allSelected = visibleIds.every((id) => selectedQuestionIds.includes(id));

    setSelectedQuestionIds((current) =>
      allSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...current, ...visibleIds])),
    );
  };

  const submitQuestion = (values: QuestionBuilderValues) => {
    const errors = validateQuestion(values);
    setLastValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast("Хадгалахаас өмнө шаардлагатай талбаруудыг бүрэн бөглөнө үү.");
      return false;
    }

    const existing = editingQuestion ?? undefined;
    const nextQuestion = buildQuestionPayload(values, existing);

    setQuestions((current) => {
      if (existing) {
        return current.map((question) => (question.id === existing.id ? nextQuestion : question));
      }
      return [nextQuestion, ...current];
    });

    setActiveQuestionId(nextQuestion.id);
    setIsBuilderOpen(false);
    setEditingQuestionId(null);
    showToast(existing ? "Асуултын мэдээлэл шинэчлэгдлээ." : "Асуулт санд амжилттай үүслээ.");
    return true;
  };

  const reuseQuestions = (ids: string[]) => {
    if (ids.length === 0) {
      showToast("Дахин ашиглахын тулд дор хаяж нэг асуулт сонгоно уу.");
      return;
    }

    setQuestions((current) =>
      current.map((question) =>
        ids.includes(question.id)
          ? { ...question, usageCount: question.usageCount + 1, updatedAt: new Date().toISOString() }
          : question,
      ),
    );
    setSelectedQuestionIds((current) => current.filter((id) => !ids.includes(id)));
    showToast(`${ids.length} асуултыг ${reuseTarget} руу нэмлээ.`);
  };

  return {
    activeQuestion,
    clearFilters,
    closeBuilder,
    editingQuestion,
    editingValues: editingQuestion ? mapQuestionToBuilderValues(editingQuestion) : null,
    filters,
    filteredQuestions,
    isBuilderOpen,
    lastValidationErrors,
    openCreateBuilder,
    openEditBuilder,
    questions,
    reuseQuestions,
    reuseTarget,
    selectedQuestionIds,
    selectedQuestions,
    setActiveQuestionId,
    setReuseTarget,
    subjectOptions,
    summary,
    toastMessage,
    toggleQuestionSelection,
    toggleVisibleSelection,
    updateFilters,
    submitQuestion,
  };
}
