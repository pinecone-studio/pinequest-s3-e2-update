"use client";

import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { useTeacher } from "../../teacher-shell";
import { PENDING_EXAM_TRANSFER_STORAGE_KEY } from "../../exam/_lib/constants";
import type { PendingExamTransfer } from "../../exam/_lib/types";
import {
  GRADE_OPTIONS,
  QUESTION_BANK_FILTER_DEFAULTS,
  SUBJECT_OPTIONS,
} from "../_lib/constants";
import { mapBackendTestsToQuestions } from "../_lib/backend-question-mappers";
import { GET_ALL_SUBJECTS_QUERY, type GetAllSubjectsResponse } from "../_lib/get-subjects";
import { GET_ALL_TESTS_QUERY, type GetAllTestsResponse } from "../_lib/get-tests";
import { MOCK_QUESTIONS } from "../_lib/mock-data";
import type {
  Question,
  QuestionBuilderValues,
  QuestionFilters,
  QuestionValidationErrors,
} from "../_lib/types";
import {
  buildQuestionPayload,
  createQuestionBuilderValues,
  filterAndSortQuestions,
  mapQuestionToBuilderValues,
  validateQuestion,
} from "../_lib/utils";
import { useCreateTestSync } from "./use-create-test-sync";

const SEEDED_TEACHERS = ["Оюунбилэг", "Номин-Эрдэнэ", "Батчимэг"] as const;

function createSeededQuestions() {
  const sharedCutoff = Math.max(4, Math.ceil(MOCK_QUESTIONS.length * 0.55));

  return MOCK_QUESTIONS.map((question, index) => ({
    ...question,
    source: index < sharedCutoff ? "global" : "school",
    teacherName:
      index < sharedCutoff
        ? SEEDED_TEACHERS[index % SEEDED_TEACHERS.length]
        : SEEDED_TEACHERS[index % SEEDED_TEACHERS.length],
  })) satisfies Question[];
}

export function useQuestionBank() {
  const router = useRouter();
  const teacher = useTeacher();
  const { createQuestionInBackend, incrementUsageInBackend, updateQuestionInBackend } = useCreateTestSync();
  const { data: subjectsData } = useQuery<GetAllSubjectsResponse>(GET_ALL_SUBJECTS_QUERY);
  const { data: testsData } = useQuery<GetAllTestsResponse>(GET_ALL_TESTS_QUERY);
  const toastTimeoutRef = useRef<number | null>(null);

  const [filters, setFilters] = useState<QuestionFilters>(QUESTION_BANK_FILTER_DEFAULTS);
  const [entrySelection, setEntrySelection] = useState({
    subject: "",
    grade: "",
  });
  const [hasEnteredBank, setHasEnteredBank] = useState(false);
  const [likedQuestionIds, setLikedQuestionIds] = useState<string[]>([]);
  const [localQuestions, setLocalQuestions] = useState<Question[]>([]);
  const [questionOverrides, setQuestionOverrides] = useState<Record<string, Question>>({});
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [publishSuccessDialogOpen, setPublishSuccessDialogOpen] = useState(false);
  const [lastValidationErrors, setLastValidationErrors] = useState<QuestionValidationErrors>({});

  const seededQuestions = useMemo(() => createSeededQuestions(), []);
  const sharedSeedQuestions = useMemo(
    () => seededQuestions.filter((question) => question.source === "global"),
    [seededQuestions],
  );
  const fallbackEditableQuestions = useMemo(
    () => seededQuestions.filter((question) => question.source === "school"),
    [seededQuestions],
  );
  const backendEditableQuestions = useMemo(
    () =>
      mapBackendTestsToQuestions(testsData?.getAllTests ?? []).map((question) => ({
        ...question,
        source: "school" as const,
        teacherName: question.teacherName ?? teacher.name,
      })),
    [teacher.name, testsData?.getAllTests],
  );
  const persistedEditableQuestions =
    backendEditableQuestions.length > 0 ? backendEditableQuestions : fallbackEditableQuestions;

  const editableQuestions = useMemo(() => {
    const hiddenIds = new Set(deletedQuestionIds);
    const merged = new Map<string, Question>();

    for (const question of persistedEditableQuestions) {
      if (hiddenIds.has(question.id)) continue;
      merged.set(question.id, {
        ...question,
        source: "school",
        teacherName: question.teacherName ?? teacher.name,
      });
    }

    for (const question of Object.values(questionOverrides)) {
      if (hiddenIds.has(question.id)) continue;
      merged.set(question.id, question);
    }

    for (const question of localQuestions) {
      if (hiddenIds.has(question.id)) continue;
      merged.set(question.id, question);
    }

    return Array.from(merged.values());
  }, [deletedQuestionIds, localQuestions, persistedEditableQuestions, questionOverrides, teacher.name]);

  const questions = useMemo(
    () => [...sharedSeedQuestions, ...editableQuestions],
    [editableQuestions, sharedSeedQuestions],
  );
  const filteredQuestions = useMemo(
    () => filterAndSortQuestions(questions, filters),
    [filters, questions],
  );
  const activeQuestion = useMemo(
    () =>
      filteredQuestions.find((question) => question.id === activeQuestionId)
      ?? filteredQuestions[0]
      ?? null,
    [activeQuestionId, filteredQuestions],
  );
  const myQuestions = useMemo(
    () =>
      questions.filter(
        (question) =>
          question.source === "school"
          && question.teacherName === teacher.name
          && (!entrySelection.subject || question.subject === entrySelection.subject)
          && (!entrySelection.grade || question.grade === entrySelection.grade),
      ),
    [entrySelection.grade, entrySelection.subject, questions, teacher.name],
  );
  const editingQuestion = useMemo(
    () => editableQuestions.find((question) => question.id === editingQuestionId) ?? null,
    [editableQuestions, editingQuestionId],
  );
  const createDefaults = useMemo(() => {
    const values = createQuestionBuilderValues();

    return {
      ...values,
      grade: entrySelection.grade || values.grade,
      subject: entrySelection.subject || values.subject,
      status: "published" as const,
    };
  }, [entrySelection.grade, entrySelection.subject]);

  const subjectOptions = useMemo(
    () =>
      Array.from(new Set([
        ...questions.map((question) => question.subject),
        ...SUBJECT_OPTIONS,
        ...(subjectsData?.getAllSubjects ?? []).map((subject) => subject.name.trim()).filter(Boolean),
      ])).sort(),
    [questions, subjectsData?.getAllSubjects],
  );
  const gradeOptions = useMemo(
    () => Array.from(new Set([...GRADE_OPTIONS, ...questions.map((question) => question.grade)])).sort(),
    [questions],
  );
  const topicOptions = useMemo(
    () =>
      Array.from(
        new Set(
          questions
            .map((question) => question.subtopic?.trim() || question.topic.trim())
            .filter(Boolean),
        ),
      ).sort(),
    [questions],
  );

  const summary = useMemo(
    () => ({
      myQuestionCount: myQuestions.length,
      systemCount: questions.length,
      selectedScopeCount:
        entrySelection.subject && entrySelection.grade
          ? questions.filter(
              (question) =>
                question.subject === entrySelection.subject
                && question.grade === entrySelection.grade,
            ).length
          : null,
    }),
    [entrySelection.grade, entrySelection.subject, myQuestions.length, questions],
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => setToastMessage(""), 2400);
  };

  const updateFilters = (partial: Partial<QuestionFilters>) =>
    setFilters((current) => ({
      ...current,
      ...partial,
    }));

  const clearFilters = () => {
    setFilters({
      ...QUESTION_BANK_FILTER_DEFAULTS,
      subject: hasEnteredBank ? entrySelection.subject : QUESTION_BANK_FILTER_DEFAULTS.subject,
      grade: hasEnteredBank ? entrySelection.grade : QUESTION_BANK_FILTER_DEFAULTS.grade,
    });
  };

  const updateEntrySelection = (partial: Partial<typeof entrySelection>) =>
    setEntrySelection((current) => ({
      ...current,
      ...partial,
    }));

  const enterBank = () => {
    if (!entrySelection.subject || !entrySelection.grade) {
      showToast("Системийн санд нэвтрэхийн тулд хичээл, ангиа сонгоно уу.");
      return;
    }

    setFilters({
      ...QUESTION_BANK_FILTER_DEFAULTS,
      subject: entrySelection.subject,
      grade: entrySelection.grade,
    });
    setHasEnteredBank(true);
  };

  const resetEntrySelection = () => {
    setHasEnteredBank(false);
    setEntrySelection({
      subject: "",
      grade: "",
    });
    setFilters(QUESTION_BANK_FILTER_DEFAULTS);
  };

  const openCreateBuilder = () => {
    setEditingQuestionId(null);
    setLastValidationErrors({});
    setIsBuilderOpen(true);
  };

  const openEditBuilder = (questionId: string) => {
    setActiveQuestionId(questionId);
    setEditingQuestionId(questionId);
    setLastValidationErrors({});
    setIsBuilderOpen(true);
  };

  const closeBuilder = () => {
    setIsBuilderOpen(false);
    setEditingQuestionId(null);
    setLastValidationErrors({});
  };

  const openBulkImport = () => {
    showToast("Bulk import-ыг системийн сантай холбох дараагийн алхам бэлэн.");
  };

  const toggleQuestionLike = (questionId: string) => {
    setLikedQuestionIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  };

  const getQuestionHeartCount = (question: Question) => {
    const baseCount = Math.max(0, Math.round(question.usageCount / 3));
    return baseCount + (likedQuestionIds.includes(question.id) ? 1 : 0);
  };

  const deleteQuestion = (questionId: string) => {
    const question = editableQuestions.find((item) => item.id === questionId);
    if (!question) return;
    if (!window.confirm(`"${question.title}" асуултыг системийн сангаас нуух уу?`)) return;

    setLocalQuestions((current) => current.filter((item) => item.id !== questionId));
    setQuestionOverrides((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
    setDeletedQuestionIds((current) =>
      current.includes(questionId) ? current : [...current, questionId],
    );

    if (editingQuestionId === questionId) {
      closeBuilder();
    }

    showToast("Асуултыг системийн сангаас нууллаа.");
  };

  const submitQuestion = async (values: QuestionBuilderValues) => {
    const errors = validateQuestion(values);
    setLastValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      showToast("Хадгалахаас өмнө шаардлагатай талбаруудыг бүрэн бөглөнө үү.");
      return false;
    }

    const baseQuestion = buildQuestionPayload(values, editingQuestion ?? undefined);
    const nextQuestion: Question = {
      ...baseQuestion,
      source: "school",
      teacherName: editingQuestion?.teacherName ?? teacher.name,
      isLocalOnly: editingQuestion?.isLocalOnly ?? false,
    };

    try {
      if (editingQuestion) {
        if (editingQuestion.isLocalOnly) {
          setLocalQuestions((current) =>
            current.map((question) => (question.id === editingQuestion.id ? nextQuestion : question)),
          );
        } else {
          await updateQuestionInBackend(editingQuestion.id, values, editingQuestion.usageCount);
          setQuestionOverrides((current) => ({
            ...current,
            [editingQuestion.id]: nextQuestion,
          }));
        }

        if (values.status === "published") {
          setPublishSuccessDialogOpen(true);
        } else {
          showToast("Асуултын мэдээлэл шинэчлэгдлээ.");
        }
      } else {
        const createdId = await createQuestionInBackend(values);
        const createdQuestion: Question = {
          ...nextQuestion,
          id: createdId ?? nextQuestion.id,
          isLocalOnly: !createdId,
        };

        setLocalQuestions((current) => [createdQuestion, ...current]);

        if (values.status === "published") {
          setPublishSuccessDialogOpen(true);
        } else {
          showToast("Асуулт системийн санд амжилттай үүслээ.");
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
    if (ids.length === 0) {
      showToast("Шалгалтад нэмэх асуултаа сонгоно уу.");
      return;
    }

    const nextQuestions = questions.filter((question) => ids.includes(question.id));
    const firstQuestion = nextQuestions[0];

    try {
      await incrementUsageInBackend(nextQuestions);
    } catch {
      // Shared seed rows may not exist in the backend yet.
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
    router.push("/teacher/exam");
  };

  return {
    clearFilters,
    closeBuilder,
    currentFilters: filters,
    deleteQuestion,
    enterBank,
    entrySelection,
    editingValues: editingQuestion ? mapQuestionToBuilderValues(editingQuestion) : createDefaults,
    activeQuestion,
    filteredQuestions,
    gradeOptions,
    hasEnteredBank,
    isBuilderOpen,
    lastValidationErrors,
    myQuestions,
    openBulkImport,
    openCreateBuilder,
    openEditBuilder,
    publishSuccessDialogOpen,
    resetEntrySelection,
    sendQuestionsToExam,
    setPublishSuccessDialogOpen,
    subjectOptions,
    submitQuestion,
    summary,
    setActiveQuestionId,
    toastMessage,
    toggleQuestionLike,
    topicOptions,
    updateEntrySelection,
    updateFilters,
    likedQuestionIds,
    getQuestionHeartCount,
  };
}
