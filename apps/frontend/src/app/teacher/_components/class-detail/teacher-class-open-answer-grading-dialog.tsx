"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { PastExamRow } from "@/app/lib/class-past-exams-types";
import { sortPastExamStudents } from "./teacher-class-detail-utils";
import {
  buildInitialManualQuestions,
  isManualGradableAttempt,
  readManualGradingRecord,
  sumManualMaxScore,
  sumManualScore,
  writeManualGradingRecord,
  type ManualGradingQuestion,
} from "@/app/teacher/exam-grading/_lib/manual-grading";

type TeacherClassOpenAnswerGradingDialogProps = {
  classLabel: string;
  exam: PastExamRow;
  onClose: () => void;
};

export function TeacherClassOpenAnswerGradingDialog({
  classLabel,
  exam,
  onClose,
}: TeacherClassOpenAnswerGradingDialogProps) {
  const students = useMemo(
    () =>
      sortPastExamStudents(exam.studentScores).filter(
        (student) => student.attempts.some(isManualGradableAttempt),
      ),
    [exam.studentScores],
  );
  const [activeStudentId, setActiveStudentId] = useState(
    () => students[0]?.studentId ?? "",
  );
  const [questionDraftsByStudentId, setQuestionDraftsByStudentId] = useState<
    Record<string, ManualGradingQuestion[]>
  >({});
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const resolvedActiveStudentId = students.some(
    (student) => student.studentId === activeStudentId,
  )
    ? activeStudentId
    : students[0]?.studentId ?? "";
  const activeStudent =
    students.find((student) => student.studentId === resolvedActiveStudentId) ??
    null;

  const savedRecord = useMemo(
    () =>
      activeStudent
        ? readManualGradingRecord(exam.blueprintId, activeStudent.studentId)
        : null,
    [activeStudent, exam.blueprintId],
  );

  const initialQuestions = useMemo(() => {
    if (!activeStudent) return [];
    return buildInitialManualQuestions({
      bootstrap: {
        classLabel,
        exam,
        student: activeStudent,
      },
      examId: exam.blueprintId,
      examTitle: exam.examTitle,
      savedRecord,
      subject: exam.subject,
    });
  }, [activeStudent, classLabel, exam, savedRecord]);
  const questions =
    (resolvedActiveStudentId &&
      questionDraftsByStudentId[resolvedActiveStudentId]) ||
    initialQuestions;

  const previousSavedManualScore = savedRecord
    ? sumManualScore(savedRecord.questions)
    : 0;
  const manualScore = sumManualScore(questions);
  const manualMaxScore = sumManualMaxScore(questions);
  const baselineAutoScore = activeStudent
    ? Math.max(0, activeStudent.score - previousSavedManualScore)
    : 0;
  const recomputedTotal = Math.min(
    exam.maxScore,
    baselineAutoScore + manualScore,
  );

  const updateQuestion = (
    questionId: string,
    partial: Partial<ManualGradingQuestion>,
  ) => {
    if (!resolvedActiveStudentId) return;
    setQuestionDraftsByStudentId((current) => ({
      ...current,
      [resolvedActiveStudentId]: questions.map((question) =>
        question.id === questionId ? { ...question, ...partial } : question,
      ),
    }));
    setSaveMessage("");
  };

  const setActiveStudent = (studentId: string) => {
    setActiveStudentId(studentId);
    setSaveMessage("");
  };

  const setSavedQuestions = (nextQuestions: ManualGradingQuestion[]) => {
    if (!resolvedActiveStudentId) return;
    setQuestionDraftsByStudentId((current) => ({
      ...current,
      [resolvedActiveStudentId]: nextQuestions,
    }));
  };

  const handleSave = () => {
    if (!activeStudent) return;

    const now = new Date().toISOString();
    const nextQuestions = questions.map((question) => ({
      ...question,
      savedAt: now,
    }));
    setSavedQuestions(nextQuestions);
    writeManualGradingRecord({
      examId: exam.blueprintId,
      studentId: activeStudent.studentId,
      questions: nextQuestions,
      updatedAt: now,
    });
    setSaveMessage("Задгай хэсгийн оноо хадгалагдлаа.");
    window.setTimeout(() => setSaveMessage(""), 2400);
  };

  return (
    <>
      <button
        aria-label="Дэлгэц хаах"
        className="fixed inset-0 z-[90] cursor-default bg-[#1f2a44]/30"
        onClick={onClose}
        type="button"
      />
      <div className="fixed left-1/2 top-1/2 z-[100] flex max-h-[min(94vh,980px)] w-[min(calc(100vw-20px),78rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[28px] border border-[#d9dee8] bg-white shadow-[0_28px_90px_-18px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#e8ecf2] bg-gradient-to-r from-[#f8fbff] to-white px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f8ea8]">
              ЗАДГАЙ ХЭСЭГ
            </p>
            <h2 className="mt-2 truncate text-xl font-extrabold text-[#183153] sm:text-2xl">
              {exam.examTitle}
            </h2>
            <p className="mt-1 text-sm text-[#5f7394]">
              {exam.subject} · {classLabel}
            </p>
          </div>
          <button
            aria-label="Хаах"
            className="shrink-0 rounded-xl p-2 text-[#122459] transition hover:bg-[#e8ecf2]"
            onClick={onClose}
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {students.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[#5f7394]">
            Энэ шалгалтад задгай хариултын мэдээлэл олдсонгүй.
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="overflow-y-auto border-b border-[#e8ecf2] bg-[#fbfdff] p-4 lg:border-b-0 lg:border-r">
              <div className="rounded-2xl border border-[#d8e6f6] bg-[#f8fbff] px-4 py-3 text-sm leading-6 text-[#48607f]">
                Сурагч сонгоод задгай асуултын хариултыг харж, оноо өгөөд
                хадгална.
              </div>
              <div className="mt-4 space-y-3">
                {students.map((student) => {
                  const studentSavedRecord = readManualGradingRecord(
                    exam.blueprintId,
                    student.studentId,
                  );
                  const studentManualScore = studentSavedRecord
                    ? sumManualScore(studentSavedRecord.questions)
                    : 0;
                  const isActive =
                    student.studentId === resolvedActiveStudentId;
                  return (
                    <button
                      key={student.studentId}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                        isActive
                          ? "border-[#62b4ff] bg-[#eef7ff]"
                          : "border-[#e3ebf5] bg-white hover:border-[#b4d8ff] hover:bg-[#f8fbff]"
                      }`}
                      onClick={() => setActiveStudent(student.studentId)}
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-[#183153]">
                            {student.lastName} {student.firstName}
                          </p>
                          <p className="mt-1 text-xs text-[#5f7394]">
                            {student.studentNumber}
                          </p>
                        </div>
                        {studentSavedRecord ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#22a05a]" />
                        ) : null}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-[#183153]">
                          Нийт: {student.score} / {exam.maxScore}
                        </span>
                        <span className="inline-flex rounded-full bg-[#e8f4ff] px-3 py-1 text-xs font-semibold text-[#175ea8]">
                          Задгай: {studentManualScore}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="min-h-0 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              {activeStudent ? (
                <>
                  <div className="grid gap-3 border-b border-[#e8ecf2] pb-5 sm:grid-cols-3">
                    <SummaryCard
                      label="Сурагч"
                      value={`${activeStudent.lastName} ${activeStudent.firstName}`}
                    />
                    <SummaryCard
                      label="Задгай хэсэг"
                      value={`${manualScore} / ${manualMaxScore}`}
                    />
                    <SummaryCard
                      emphasis
                      label="Шинэ нийт дүн"
                      value={`${recomputedTotal} / ${exam.maxScore}`}
                    />
                  </div>

                  <div className="mt-5 space-y-5">
                    {questions.map((question) => (
                      <article
                        key={question.id}
                        className="rounded-3xl border border-[#dbe5f1] bg-[#fbfdff] p-4 sm:p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e8edf5] pb-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8ea8]">
                              Асуулт {question.order}
                            </p>
                            <p className="mt-2 break-words text-base font-bold leading-7 text-[#183153]">
                              {question.prompt}
                            </p>
                          </div>
                          <span className="inline-flex shrink-0 rounded-full border border-[#d9e4f2] bg-white px-3 py-1 text-xs font-semibold text-[#48607f]">
                            Дээд оноо: {question.maxScore}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
                          <div className="space-y-4">
                            <Panel title="Сурагчийн хариулт">
                              <p className="whitespace-pre-line text-sm leading-7 text-[#183153]">
                                {question.studentAnswer}
                              </p>
                            </Panel>
                          </div>

                          <div className="space-y-4">
                            <Panel title="Оноо өгөх">
                              <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-[#183153]">
                                  Оноо
                                </span>
                                <input
                                  className="h-12 w-full rounded-2xl border border-[#d6e2f0] bg-white px-4 text-sm text-[#183153] outline-none transition focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10"
                                  inputMode="numeric"
                                  onChange={(event) => {
                                    const numeric = Number(event.target.value);
                                    const safeValue = Number.isFinite(numeric)
                                      ? Math.max(
                                          0,
                                          Math.min(question.maxScore, numeric),
                                        )
                                      : 0;
                                    updateQuestion(question.id, {
                                      awardedScore: safeValue,
                                    });
                                  }}
                                  pattern="[0-9]*"
                                  type="text"
                                  value={question.awardedScore}
                                />
                              </label>

                              <div className="flex flex-wrap gap-2 pt-2">
                                <QuickScoreButton
                                  label="0 оноо"
                                  onClick={() =>
                                    updateQuestion(question.id, {
                                      awardedScore: 0,
                                    })
                                  }
                                />
                                <QuickScoreButton
                                  label="Бүтэн оноо"
                                  onClick={() =>
                                    updateQuestion(question.id, {
                                      awardedScore: question.maxScore,
                                    })
                                  }
                                />
                              </div>
                            </Panel>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="sticky bottom-0 mt-5 flex flex-col gap-3 border-t border-[#e8ecf2] bg-white/95 pt-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                    {saveMessage ? (
                      <p className="rounded-2xl border border-[#d6ead4] bg-[#f3fbf0] px-4 py-3 text-sm font-medium text-[#2d7a38]">
                        {saveMessage}
                      </p>
                    ) : (
                      <div className="text-sm text-[#5f7394]">
                        Задгай хэсгийн оноо хадгалсны дараа энэ шалгалтын
                        жагсаалт дээр дүн шууд шинэчлэгдэнэ.
                      </div>
                    )}
                    <button
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#29A4FF] px-5 text-sm font-semibold text-white transition hover:bg-[#1997f2]"
                      onClick={handleSave}
                      type="button"
                    >
                      Оноог хадгалах
                    </button>
                  </div>
                </>
              ) : null}
            </section>
          </div>
        )}
      </div>
    </>
  );
}

function Panel({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-[#dbe5f1] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8ea8]">
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function QuickScoreButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="rounded-full border border-[#d9e4f2] bg-white px-3 py-1.5 text-xs font-semibold text-[#183153] transition hover:border-[#9ecbff] hover:bg-[#f5faff]"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function SummaryCard({
  emphasis = false,
  label,
  value,
}: {
  emphasis?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        emphasis
          ? "border-[#8ecbff] bg-[#eef7ff]"
          : "border-[#e0e8f3] bg-[#fbfdff]"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f8ea8]">
        {label}
      </p>
      <p className="mt-2 text-base font-extrabold text-[#183153]">{value}</p>
    </div>
  );
}
