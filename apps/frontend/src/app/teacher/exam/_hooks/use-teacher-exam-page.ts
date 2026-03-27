"use client";

import { useQuery } from "@apollo/client/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { teacherClasses } from "../_lib/class-data";
import { mapBackendTestsToQuestions } from "../../question-bank/_lib/backend-question-mappers";
import { GET_ALL_TESTS_QUERY, type GetAllTestsResponse } from "../../question-bank/_lib/get-tests";
import { MOCK_QUESTIONS } from "../../question-bank/_lib/mock-data";
import type { Question } from "../../question-bank/_lib/types";
import { QUESTION_TYPE_LABELS } from "../../question-bank/_lib/utils";
import { EXAM_GRADE_OPTIONS, INITIAL_FORM, PENDING_EXAM_TRANSFER_STORAGE_KEY, SAVED_EXAMS_STORAGE_KEY } from "../_lib/constants";
import { normalizeSavedExamRecord } from "../_lib/utils";
import type { ExamComposerState, ExamQuestionDetail, ExamQuestionItem, ExamStatus, PendingExamTransfer, SavedExamRecord } from "../_lib/types";

export function useTeacherExamPage() {
  const { data: testsData } = useQuery<GetAllTestsResponse>(GET_ALL_TESTS_QUERY);
  const [exam, setExam] = useState<ExamComposerState>(INITIAL_FORM);
  const [selectedBankIds, setSelectedBankIds] = useState<string[]>([]);
  const [examQuestions, setExamQuestions] = useState<ExamQuestionItem[]>([]);
  const [savedExams, setSavedExams] = useState<SavedExamRecord[]>([]);
  const [hasLoadedSavedExams, setHasLoadedSavedExams] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [search, setSearch] = useState("");
  const [activeSavedExamId, setActiveSavedExamId] = useState<string | null>(null);
  const [selectedClassByExamId, setSelectedClassByExamId] = useState<Record<string, string>>({});

  const questionBank = useMemo(() => {
    const backendQuestions = mapBackendTestsToQuestions(testsData?.getAllTests ?? []);
    return backendQuestions.length > 0 ? backendQuestions : MOCK_QUESTIONS;
  }, [testsData?.getAllTests]);
  const subjectOptions = useMemo(() => Array.from(new Set(questionBank.map((question) => question.subject))).sort(), [questionBank]);
  const topicSuggestions = useMemo(() => Array.from(new Set(questionBank.filter((question) => (exam.subject ? question.subject.toLowerCase() === exam.subject.toLowerCase() : true)).map((question) => question.topic))).sort(), [exam.subject, questionBank]);
  const filteredQuestions = useMemo(() => [...questionBank].filter((question) => matchesSearch(question, search)).sort((left, right) => scoreQuestion(right, exam) - scoreQuestion(left, exam) || right.usageCount - left.usageCount), [exam, questionBank, search]);
  const examQuestionDetails = useMemo(() => examQuestions.slice().sort((left, right) => left.order - right.order).map((item) => ({ ...item, question: questionBank.find((question) => question.id === item.questionId) })).filter((item): item is ExamQuestionDetail => Boolean(item.question)), [examQuestions, questionBank]);
  const totalPoints = examQuestionDetails.reduce((sum, item) => sum + item.assignedPoints, 0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SAVED_EXAMS_STORAGE_KEY);
      setSavedExams(raw ? (JSON.parse(raw) as SavedExamRecord[]).map(normalizeSavedExamRecord) : []);
    } catch {
      window.localStorage.removeItem(SAVED_EXAMS_STORAGE_KEY);
      setSavedExams([]);
    } finally {
      setHasLoadedSavedExams(true);
    }
  }, []);

  useEffect(() => {
    if (hasLoadedSavedExams) window.localStorage.setItem(SAVED_EXAMS_STORAGE_KEY, JSON.stringify(savedExams));
  }, [hasLoadedSavedExams, savedExams]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    window.clearTimeout((showToast as unknown as { timeout?: number }).timeout);
    (showToast as unknown as { timeout?: number }).timeout = window.setTimeout(() => setToastMessage(""), 2600);
  }, []);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(PENDING_EXAM_TRANSFER_STORAGE_KEY);
    if (!raw) return;

    try {
      const pending = JSON.parse(raw) as PendingExamTransfer;
      const pendingIds = Array.isArray(pending.questionIds) ? pending.questionIds : [];
      const pendingQuestions = questionBank.filter((question) => pendingIds.includes(question.id));
      if (pendingQuestions.length === 0) return;

      const firstQuestion = pendingQuestions[0];
      setExam((current) => ({
        ...current,
        grade: pending.exam?.grade || firstQuestion.grade || current.grade,
        subject: pending.exam?.subject || firstQuestion.subject || current.subject,
        topic: pending.exam?.topic || firstQuestion.topic || current.topic,
      }));
      setExamQuestions((current) => {
        const existingIds = new Set(current.map((item) => item.questionId));
        const appended = pendingQuestions
          .filter((question) => !existingIds.has(question.id))
          .map((question, index) => ({
            examQuestionId: `exam-question-${question.id}`,
            questionId: question.id,
            assignedPoints: question.points,
            order: current.length + index,
          }));

        return appended.length > 0 ? [...current, ...appended] : current;
      });
      setActiveSavedExamId(null);
      showToast(`${pendingQuestions.length} асуултыг шалгалт руу орууллаа.`);
    } catch {
      window.sessionStorage.removeItem(PENDING_EXAM_TRANSFER_STORAGE_KEY);
      return;
    }

    window.sessionStorage.removeItem(PENDING_EXAM_TRANSFER_STORAGE_KEY);
  }, [questionBank, showToast]);

  const updateExam = <Key extends keyof ExamComposerState>(key: Key, value: ExamComposerState[Key]) => setExam((current) => ({ ...current, [key]: value }));
  const toggleSelectQuestion = (questionId: string) => setSelectedBankIds((current) => current.includes(questionId) ? current.filter((id) => id !== questionId) : [...current, questionId]);

  const addQuestionsToExam = (questionIds: string[]) => {
    if (questionIds.length === 0) return showToast("Нэмэхийн тулд дор хаяж нэг асуулт сонгоно уу.");
    const newQuestionCount = questionIds.filter((questionId) => !examQuestions.some((item) => item.questionId === questionId)).length;
    setExamQuestions((current) => {
      const existingIds = new Set(current.map((item) => item.questionId));
      return [...current, ...questionIds.filter((questionId) => !existingIds.has(questionId)).map((questionId, index) => ({ examQuestionId: `exam-question-${questionId}`, questionId, assignedPoints: questionBank.find((item) => item.id === questionId)?.points ?? 1, order: current.length + index }))];
    });
    setSelectedBankIds((current) => current.filter((id) => !questionIds.includes(id)));
    showToast(newQuestionCount > 0 ? `${newQuestionCount} асуултыг шалгалтад нэмлээ.` : "Эдгээр асуултууд шалгалтад аль хэдийн орсон байна.");
  };

  const moveQuestion = (examQuestionId: string, direction: "up" | "down") => setExamQuestions((current) => reorderQuestions(current, examQuestionId, direction));
  const removeExamQuestion = (examQuestionId: string) => setExamQuestions((current) => current.filter((item) => item.examQuestionId !== examQuestionId).map((item, order) => ({ ...item, order })));
  const updateAssignedPoints = (examQuestionId: string, assignedPoints: number) => setExamQuestions((current) => current.map((item) => item.examQuestionId === examQuestionId ? { ...item, assignedPoints: Number.isFinite(assignedPoints) && assignedPoints > 0 ? assignedPoints : 1 } : item));

  const persistExam = (status: ExamStatus) => {
    if (!exam.title.trim()) return showToast("Эхлээд шалгалтын гарчиг оруулна уу.");
    if (examQuestionDetails.length === 0) return showToast("Хадгалахаас өмнө дор хаяж нэг асуулт нэмнэ үү.");
    const now = new Date().toISOString();
    const nextId = activeSavedExamId ?? `saved-exam-${now}`;
    const previous = savedExams.find((item) => item.id === nextId);
    const nextRecord: SavedExamRecord = { id: nextId, title: exam.title.trim(), grade: exam.grade.trim(), subject: exam.subject.trim(), topic: exam.topic.trim(), durationInMinutes: exam.durationInMinutes, status, totalPoints, questionCount: examQuestionDetails.length, savedAt: now, questions: examQuestions.map((item) => ({ ...item })), sentClassIds: previous?.sentClassIds ?? [] };
    setSavedExams((current) => [nextRecord, ...current.filter((item) => item.id !== nextId)].sort((left, right) => new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime()));
    setActiveSavedExamId(nextId);
    showToast(status === "draft" ? "Шалгалтыг ноорог төлөвөөр хадгаллаа." : "Шалгалтыг нийтэллээ.");
  };

  const openSavedExam = (savedExam: SavedExamRecord) => {
    const next = normalizeSavedExamRecord(savedExam);
    setExam({ title: next.title, grade: next.grade, subject: next.subject, topic: next.topic, durationInMinutes: next.durationInMinutes });
    setExamQuestions(next.questions.map((item, index) => ({ ...item, order: index })));
    setSelectedBankIds([]);
    setActiveSavedExamId(next.id);
    showToast(`"${next.title}" шалгалтыг нээлээ.`);
  };

  const deleteSavedExam = (savedExamId: string) => {
    setSavedExams((current) => current.filter((item) => item.id !== savedExamId));
    setSelectedClassByExamId((current) => { const next = { ...current }; delete next[savedExamId]; return next; });
    if (activeSavedExamId === savedExamId) setActiveSavedExamId(null);
    showToast("Хадгалсан шалгалтыг жагсаалтаас устгалаа.");
  };

  const selectClassForSavedExam = (savedExamId: string, classId: string) => setSelectedClassByExamId((current) => ({ ...current, [savedExamId]: classId }));
  const sendSavedExamToClass = (savedExam: SavedExamRecord) => {
    const classId = selectedClassByExamId[savedExam.id];
    const selectedClass = teacherClasses.find((item) => item.id === classId);
    if (!classId) return showToast("Илгээхийн өмнө ангиа сонгоно уу.");
    if (!selectedClass) return showToast("Сонгосон анги олдсонгүй.");
    setSavedExams((current) => current.map((item) => item.id === savedExam.id ? { ...item, sentClassIds: Array.from(new Set([...(item.sentClassIds ?? []), classId])) } : item));
    showToast(`"${savedExam.title}" шалгалтыг ${selectedClass.name} ангид илгээлээ.`);
  };

  return { activeSavedExamId, addQuestionsToExam, deleteSavedExam, exam, examQuestionDetails, examQuestions, filteredQuestions, gradeOptions: EXAM_GRADE_OPTIONS, hasLoadedSavedExams, moveQuestion, openSavedExam, persistExam, removeExamQuestion, savedExams, search, selectedBankIds, selectedClassByExamId, selectClassForSavedExam, sendSavedExamToClass, setSearch, subjectOptions, toastMessage, toggleSelectQuestion, topicSuggestions, totalPoints, updateAssignedPoints, updateExam };
}

function matchesSearch(question: Question, search: string) {
  const normalizedSearch = search.trim().toLowerCase();
  return !normalizedSearch || [question.title, question.content.prompt, question.grade, question.subject, question.topic, QUESTION_TYPE_LABELS[question.questionType]].join(" ").toLowerCase().includes(normalizedSearch);
}

function scoreQuestion(question: Question, exam: ExamComposerState) {
  return (exam.grade && question.grade.toLowerCase() === exam.grade.toLowerCase() ? 4 : 0)
    + (exam.subject && question.subject.toLowerCase() === exam.subject.toLowerCase() ? 4 : 0)
    + (exam.topic && question.topic.toLowerCase() === exam.topic.toLowerCase() ? 5 : 0)
    + (question.status === "published" ? 1 : 0);
}

function reorderQuestions(current: ExamQuestionItem[], examQuestionId: string, direction: "up" | "down") {
  const ordered = [...current].sort((left, right) => left.order - right.order);
  const index = ordered.findIndex((item) => item.examQuestionId === examQuestionId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= ordered.length) return current;
  const next = [...ordered];
  [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  return next.map((item, order) => ({ ...item, order }));
}
