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
  QuestionBankTab,
  QuestionBuilderValues,
  QuestionFilters,
  QuestionValidationErrors,
} from "../_lib/types";
import {
  buildQuestionPayload,
  filterAndSortQuestions,
  mapQuestionToBuilderValues,
  validateQuestion,
} from "../_lib/utils";
import { useCreateTestSync } from "./use-create-test-sync";

const SEEDED_TEACHERS = [
  "Оюунбилэг",
  "Номин-Эрдэнэ",
  "Батчимэг",
] as const;

function createSeededQuestions() {
  const globalCutoff = Math.max(4, Math.ceil(MOCK_QUESTIONS.length * 0.55));

  return MOCK_QUESTIONS.map((question, index) => ({
    ...question,
    source: index < globalCutoff ? "global" : "school",
    teacherName:
      index < globalCutoff
        ? undefined
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

  const [activeTab, setActiveTab] = useState<QuestionBankTab>("global");
  const [filtersByTab, setFiltersByTab] = useState<Record<QuestionBankTab, QuestionFilters>>({
    global: QUESTION_BANK_FILTER_DEFAULTS,
    school: QUESTION_BANK_FILTER_DEFAULTS,
  });
  const [localSchoolQuestions, setLocalSchoolQuestions] = useState<Question[]>([]);
  const [schoolQuestionOverrides, setSchoolQuestionOverrides] = useState<Record<string, Question>>({});
  const [deletedSchoolQuestionIds, setDeletedSchoolQuestionIds] = useState<string[]>([]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [publishSuccessDialogOpen, setPublishSuccessDialogOpen] = useState(false);
  const [lastValidationErrors, setLastValidationErrors] = useState<QuestionValidationErrors>({});

  const seededQuestions = useMemo(() => createSeededQuestions(), []);
  const globalQuestions = useMemo(
    () => seededQuestions.filter((question) => question.source === "global"),
    [seededQuestions],
  );
  const fallbackSchoolQuestions = useMemo(
    () => seededQuestions.filter((question) => question.source === "school"),
    [seededQuestions],
  );
  const backendSchoolQuestions = useMemo(
    () =>
      mapBackendTestsToQuestions(testsData?.getAllTests ?? []).map((question) => ({
        ...question,
        source: "school" as const,
        teacherName: question.teacherName ?? teacher.name,
      })),
    [teacher.name, testsData?.getAllTests],
  );
  const persistedSchoolQuestions = backendSchoolQuestions.length > 0 ? backendSchoolQuestions : fallbackSchoolQuestions;
  const schoolQuestions = useMemo(() => {
    const hiddenIds = new Set(deletedSchoolQuestionIds);
    const merged = new Map<string, Question>();

    for (const question of persistedSchoolQuestions) {
      if (hiddenIds.has(question.id)) continue;

      merged.set(question.id, {
        ...question,
        source: "school",
        teacherName: question.teacherName ?? teacher.name,
      });
    }

    for (const question of Object.values(schoolQuestionOverrides)) {
      if (hiddenIds.has(question.id)) continue;
      merged.set(question.id, question);
    }

    for (const question of localSchoolQuestions) {
      if (hiddenIds.has(question.id)) continue;
      merged.set(question.id, question);
    }

    return Array.from(merged.values());
  }, [
    deletedSchoolQuestionIds,
    localSchoolQuestions,
    persistedSchoolQuestions,
    schoolQuestionOverrides,
    teacher.name,
  ]);

  const filteredGlobalQuestions = useMemo(
    () => filterAndSortQuestions(globalQuestions, filtersByTab.global),
    [filtersByTab.global, globalQuestions],
  );
  const filteredSchoolQuestions = useMemo(
    () => filterAndSortQuestions(schoolQuestions, filtersByTab.school),
    [filtersByTab.school, schoolQuestions],
  );
  const questions = activeTab === "global" ? globalQuestions : schoolQuestions;
  const filteredQuestions = activeTab === "global" ? filteredGlobalQuestions : filteredSchoolQuestions;
  const editingQuestion = useMemo(
    () => schoolQuestions.find((question) => question.id === editingQuestionId) ?? null,
    [editingQuestionId, schoolQuestions],
  );

  const currentFilters = filtersByTab[activeTab];
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
      globalCount: globalQuestions.length,
      schoolCount: schoolQuestions.length,
      editableCount: schoolQuestions.length,
    }),
    [globalQuestions, schoolQuestions],
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => setToastMessage(""), 2400);
  };

  const updateFilters = (partial: Partial<QuestionFilters>) =>
    setFiltersByTab((current) => ({
      ...current,
      [activeTab]: {
        ...current[activeTab],
        ...partial,
      },
    }));

  const clearFilters = () =>
    setFiltersByTab((current) => ({
      ...current,
      [activeTab]: QUESTION_BANK_FILTER_DEFAULTS,
    }));

  const switchTab = (nextTab: QuestionBankTab) => {
    setActiveTab(nextTab);
  };

  const openCreateBuilder = () => {
    setActiveTab("school");
    setEditingQuestionId(null);
    setLastValidationErrors({});
    setIsBuilderOpen(true);
  };

  const openEditBuilder = (questionId: string) => {
    setActiveTab("school");
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
    showToast("Bulk import хэсгийг дараагийн алхамаар холбоход бэлэн болголоо.");
  };

  const copyQuestionToSchool = (questionId: string) => {
    const question = globalQuestions.find((item) => item.id === questionId);
    if (!question) return;

    const timestamp = new Date().toISOString();
    const copiedQuestion: Question = {
      ...question,
      id: `school-copy-${Math.random().toString(36).slice(2, 10)}`,
      source: "school",
      teacherName: teacher.name,
      isLocalOnly: true,
      status: "draft",
      usageCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setLocalSchoolQuestions((current) => [copiedQuestion, ...current]);
    setActiveTab("school");
    showToast("Асуултыг сургуулийн санд хууллаа.");
  };

  const deleteSchoolQuestion = (questionId: string) => {
    const question = schoolQuestions.find((item) => item.id === questionId);
    if (!question) return;
    if (!window.confirm(`"${question.title}" асуултыг жагсаалтаас устгах уу?`)) return;

    setLocalSchoolQuestions((current) => current.filter((item) => item.id !== questionId));
    setSchoolQuestionOverrides((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
    setDeletedSchoolQuestionIds((current) =>
      current.includes(questionId) ? current : [...current, questionId],
    );

    if (editingQuestionId === questionId) {
      closeBuilder();
    }

    showToast("Асуултыг жагсаалтаас устгалаа.");
  };

  const submitQuestion = async (values: QuestionBuilderValues) => {
    const errors = validateQuestion(values);
    setLastValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      showToast("Хадгалахаас өмнө шаардлагатай талбаруудыг бүрэн бөглөнө үү.");
      return false;
    }

    const baseQuestion = buildQuestionPayload(values, editingQuestion ?? undefined);
    const schoolQuestion: Question = {
      ...baseQuestion,
      source: "school",
      teacherName: editingQuestion?.teacherName ?? teacher.name,
      isLocalOnly: editingQuestion?.isLocalOnly ?? false,
    };

    try {
      if (editingQuestion) {
        if (editingQuestion.isLocalOnly) {
          setLocalSchoolQuestions((current) =>
            current.map((question) => (question.id === editingQuestion.id ? schoolQuestion : question)),
          );
        } else {
          await updateQuestionInBackend(editingQuestion.id, values, editingQuestion.usageCount);
          setSchoolQuestionOverrides((current) => ({
            ...current,
            [editingQuestion.id]: schoolQuestion,
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
          ...schoolQuestion,
          id: createdId ?? schoolQuestion.id,
          isLocalOnly: !createdId,
        };

        setLocalSchoolQuestions((current) => [createdQuestion, ...current]);

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
    if (ids.length === 0) {
      showToast("Шалгалтад нэмэх асуултаа сонгоно уу.");
      return;
    }

    const sourceQuestions = activeTab === "global" ? globalQuestions : schoolQuestions;
    const nextQuestions = sourceQuestions.filter((question) => ids.includes(question.id));
    const firstQuestion = nextQuestions[0];

    try {
      await incrementUsageInBackend(nextQuestions);
    } catch {
      // Mock or copied questions may not exist in the backend yet.
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
    activeTab,
    clearFilters,
    closeBuilder,
    copyQuestionToSchool,
    currentFilters,
    deleteSchoolQuestion,
    editingValues: editingQuestion ? mapQuestionToBuilderValues(editingQuestion) : null,
    filteredQuestions,
    gradeOptions,
    isBuilderOpen,
    isSchoolTab: activeTab === "school",
    lastValidationErrors,
    openBulkImport,
    openCreateBuilder,
    openEditBuilder,
    publishSuccessDialogOpen,
    sendQuestionsToExam,
    setPublishSuccessDialogOpen,
    subjectOptions,
    submitQuestion,
    summary,
    switchTab,
    toastMessage,
    topicOptions,
    updateFilters,
  };
}
