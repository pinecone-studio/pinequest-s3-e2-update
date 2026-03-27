"use client";

import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PENDING_EXAM_TRANSFER_STORAGE_KEY } from "../../exam/_lib/constants";
import type { PendingExamTransfer } from "../../exam/_lib/types";
import { GRADE_OPTIONS, QUESTION_BANK_FILTER_DEFAULTS, SUBJECT_OPTIONS, SUBTOPIC_OPTIONS } from "../_lib/constants";
import { mapBackendTestsToQuestions } from "../_lib/backend-question-mappers";
import { GET_ALL_SUBJECTS_QUERY, type GetAllSubjectsResponse } from "../_lib/get-subjects";
import { GET_ALL_TESTS_QUERY, type GetAllTestsResponse } from "../_lib/get-tests";
import { MOCK_QUESTIONS } from "../_lib/mock-data";
import type { QuestionBuilderValues, QuestionFilters, QuestionValidationErrors } from "../_lib/types";
import { filterAndSortQuestions, mapQuestionToBuilderValues, validateQuestion } from "../_lib/utils";
import { useCreateTestSync } from "./use-create-test-sync";

export function useQuestionBank() {
  const router = useRouter();
  const { createQuestionInBackend, incrementUsageInBackend, updateQuestionInBackend } = useCreateTestSync();
  const { data: subjectsData } = useQuery<GetAllSubjectsResponse>(GET_ALL_SUBJECTS_QUERY);
  const { data: testsData } = useQuery<GetAllTestsResponse>(GET_ALL_TESTS_QUERY);
  const [filters, setFilters] = useState<QuestionFilters>(QUESTION_BANK_FILTER_DEFAULTS);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [publishSuccessDialogOpen, setPublishSuccessDialogOpen] = useState(false);
  const [lastValidationErrors, setLastValidationErrors] = useState<QuestionValidationErrors>({});

  const questions = useMemo(() => {
    const backendQuestions = mapBackendTestsToQuestions(testsData?.getAllTests ?? []);

    return backendQuestions.length > 0 ? backendQuestions : MOCK_QUESTIONS;
  }, [testsData?.getAllTests]);
  const filteredQuestions = useMemo(() => filterAndSortQuestions(questions, filters), [filters, questions]);
  const selectedQuestions = useMemo(() => questions.filter((question) => selectedQuestionIds.includes(question.id)), [questions, selectedQuestionIds]);
  const activeQuestion = useMemo(() => questions.find((question) => question.id === activeQuestionId) ?? filteredQuestions[0] ?? null, [activeQuestionId, filteredQuestions, questions]);
  const editingQuestion = useMemo(() => questions.find((question) => question.id === editingQuestionId) ?? null, [editingQuestionId, questions]);
  const subjectOptions = useMemo(
    () => Array.from(new Set([
      ...questions.map((question) => question.subject),
      ...SUBJECT_OPTIONS,
      ...(subjectsData?.getAllSubjects ?? []).map((subject) => subject.name.trim()).filter(Boolean),
    ])).sort(),
    [questions, subjectsData?.getAllSubjects],
  );
  const gradeOptions = useMemo(() => Array.from(new Set([...GRADE_OPTIONS, ...questions.map((question) => question.grade)])).sort(), [questions]);
  const subtopicOptions = useMemo(
    () =>
      filters.subject !== "all"
        ? Array.from(SUBTOPIC_OPTIONS[filters.subject as keyof typeof SUBTOPIC_OPTIONS] ?? [])
        : [],
    [filters.subject],
  );
  const summary = useMemo(() => ({
    total: questions.length,
    published: questions.filter((question) => question.status === "published").length,
    draft: questions.filter((question) => question.status === "draft").length,
    manual: questions.filter((question) => question.gradingType === "manual").length,
  }), [questions]);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.clearTimeout((showToast as unknown as { timeout?: number }).timeout);
    (showToast as unknown as { timeout?: number }).timeout = window.setTimeout(() => setToastMessage(""), 2400);
  };

  const updateFilters = (partial: Partial<QuestionFilters>) => setFilters((current) => ({ ...current, ...partial }));
  const clearFilters = () => setFilters(QUESTION_BANK_FILTER_DEFAULTS);
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
  const toggleQuestionSelection = (questionId: string) => setSelectedQuestionIds((current) => current.includes(questionId) ? current.filter((id) => id !== questionId) : [...current, questionId]);

  const toggleVisibleSelection = () => {
    const visibleIds = filteredQuestions.map((question) => question.id);
    const allSelected = visibleIds.every((id) => selectedQuestionIds.includes(id));
    setSelectedQuestionIds((current) => allSelected ? current.filter((id) => !visibleIds.includes(id)) : Array.from(new Set([...current, ...visibleIds])));
  };

  const submitQuestion = async (values: QuestionBuilderValues) => {
    const errors = validateQuestion(values);
    setLastValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      showToast("Хадгалахаас өмнө шаардлагатай талбаруудыг бүрэн бөглөнө үү.");
      return false;
    }

    try {
      if (editingQuestion) {
        await updateQuestionInBackend(editingQuestion.id, values, editingQuestion.usageCount);
        setActiveQuestionId(editingQuestion.id);
        if (values.status === "published") {
          setPublishSuccessDialogOpen(true);
        } else {
          showToast("Асуултын мэдээлэл шинэчлэгдлээ.");
        }
      } else {
        const createdId = await createQuestionInBackend(values);
        if (createdId) {
          setActiveQuestionId(createdId);
        }
        if (values.status === "published") {
          setPublishSuccessDialogOpen(true);
        } else {
          showToast("Асуулт санд амжилттай үүслээ.");
        }
      }

      setIsBuilderOpen(false);
      setEditingQuestionId(null);
      return true;
    } catch {
      showToast("Backend рүү хадгалах үед алдаа гарлаа.");
      return false;
    }
  };

  const sendQuestionsToExam = async (ids: string[]) => {
    if (ids.length === 0) return showToast("Дахин ашиглахын тулд дор хаяж нэг асуулт сонгоно уу.");

    const nextQuestions = questions.filter((question) => ids.includes(question.id));
    const firstQuestion = nextQuestions[0];

    try {
      await incrementUsageInBackend(nextQuestions);
    } catch {
      // Usage update should not block moving the selected questions into the exam flow.
    }

    const payload: PendingExamTransfer = {
      questionIds: ids,
      exam: firstQuestion
        ? {
            grade: firstQuestion.grade,
            subject: firstQuestion.subject,
            topic: firstQuestion.topic,
          }
        : undefined,
    };

    window.sessionStorage.setItem(PENDING_EXAM_TRANSFER_STORAGE_KEY, JSON.stringify(payload));
    setSelectedQuestionIds((current) => current.filter((id) => !ids.includes(id)));
    router.push("/teacher/exam");
  };

  return {
    activeQuestion,
    clearFilters,
    closeBuilder,
    editingQuestion,
    editingValues: editingQuestion ? mapQuestionToBuilderValues(editingQuestion) : null,
    filters,
    filteredQuestions,
    gradeOptions,
    isBuilderOpen,
    lastValidationErrors,
    publishSuccessDialogOpen,
    openCreateBuilder,
    openEditBuilder,
    questions,
    sendQuestionsToExam,
    selectedQuestionIds,
    selectedQuestions,
    setActiveQuestionId,
    setPublishSuccessDialogOpen,
    subtopicOptions,
    subjectOptions,
    submitQuestion,
    summary,
    toastMessage,
    toggleQuestionSelection,
    toggleVisibleSelection,
    updateFilters,
  };
}
