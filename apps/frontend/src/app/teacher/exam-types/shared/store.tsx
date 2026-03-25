"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type {
  ExamDraft,
  Question,
  StudentAnswers,
  QuestionResult,
  Subject,
} from "./types";
import { mockQuestions } from "./mock-data";
import { generateVariants, gradeAnswers } from "./utils";

type ExamFlowContextValue = {
  questions: Question[];
  examDraft: ExamDraft;
  selectedQuestions: Question[];
  studentAnswers: StudentAnswers;
  lastQuestionResults: QuestionResult[];
  toggleQuestion: (questionId: string) => void;
  removeQuestion: (questionId: string) => void;
  reorderQuestion: (questionId: string, direction: "up" | "down") => void;
  setExamMeta: (payload: Partial<Pick<ExamDraft, "title" | "subject" | "durationMinutes">>) => void;
  generateExamVariants: () => void;
  markSent: () => void;
  updateStudentAnswer: (questionId: string, value: string) => void;
  submitStudentExam: () => void;
};

const ExamFlowContext = createContext<ExamFlowContextValue | null>(null);

export function ExamFlowProvider({ children }: { children: React.ReactNode }) {
  const [questions] = useState<Question[]>(mockQuestions);
  const [examDraft, setExamDraft] = useState<ExamDraft>({
    title: "10-р ангийн Нэгдсэн шалгалт",
    subject: "Математик",
    durationMinutes: 40,
    selectedQuestionIds: [],
    variants: { A: [], B: [], C: [] },
    isSent: false,
  });
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswers>({});
  const [lastQuestionResults, setLastQuestionResults] = useState<QuestionResult[]>([]);

  const selectedQuestions = useMemo(
    () =>
      examDraft.selectedQuestionIds
        .map((id) => questions.find((q) => q.id === id))
        .filter((q): q is Question => Boolean(q)),
    [examDraft.selectedQuestionIds, questions],
  );

  const toggleQuestion = (questionId: string) => {
    setExamDraft((prev) => {
      const exists = prev.selectedQuestionIds.includes(questionId);
      const selectedQuestionIds = exists
        ? prev.selectedQuestionIds.filter((id) => id !== questionId)
        : [...prev.selectedQuestionIds, questionId];
      return { ...prev, selectedQuestionIds };
    });
  };

  const removeQuestion = (questionId: string) => {
    setExamDraft((prev) => ({
      ...prev,
      selectedQuestionIds: prev.selectedQuestionIds.filter((id) => id !== questionId),
    }));
  };

  const reorderQuestion = (questionId: string, direction: "up" | "down") => {
    setExamDraft((prev) => {
      const idx = prev.selectedQuestionIds.indexOf(questionId);
      if (idx === -1) return prev;
      const nextIdx = direction === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= prev.selectedQuestionIds.length) return prev;
      const ids = [...prev.selectedQuestionIds];
      [ids[idx], ids[nextIdx]] = [ids[nextIdx], ids[idx]];
      return { ...prev, selectedQuestionIds: ids };
    });
  };

  const setExamMeta = (
    payload: Partial<Pick<ExamDraft, "title" | "subject" | "durationMinutes">>,
  ) => {
    setExamDraft((prev) => ({ ...prev, ...payload }));
  };

  const generateExamVariants = () => {
    setExamDraft((prev) => ({
      ...prev,
      variants: generateVariants(prev.selectedQuestionIds),
    }));
  };

  const markSent = () => setExamDraft((prev) => ({ ...prev, isSent: true }));

  const updateStudentAnswer = (questionId: string, value: string) => {
    setStudentAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submitStudentExam = () => {
    const variantIds =
      examDraft.variants.A.length > 0 ? examDraft.variants.A : examDraft.selectedQuestionIds;
    const variantQuestions = variantIds
      .map((id) => questions.find((q) => q.id === id))
      .filter((q): q is Question => Boolean(q));
    const result = gradeAnswers(variantQuestions, studentAnswers);
    setLastQuestionResults(result);
  };

  const value: ExamFlowContextValue = {
    questions,
    examDraft,
    selectedQuestions,
    studentAnswers,
    lastQuestionResults,
    toggleQuestion,
    removeQuestion,
    reorderQuestion,
    setExamMeta,
    generateExamVariants,
    markSent,
    updateStudentAnswer,
    submitStudentExam,
  };

  return <ExamFlowContext.Provider value={value}>{children}</ExamFlowContext.Provider>;
}

export function useExamFlow() {
  const context = useContext(ExamFlowContext);
  if (!context) throw new Error("useExamFlow must be used inside ExamFlowProvider");
  return context;
}

export function parseSubject(input: string): Subject {
  return input as Subject;
}
