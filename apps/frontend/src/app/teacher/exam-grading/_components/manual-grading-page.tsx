"use client";

import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  buildInitialManualQuestions,
  readManualGradingBootstrap,
  readManualGradingRecord,
  sumManualMaxScore,
  sumManualScore,
  writeManualGradingRecord,
  type ManualGradingQuestion,
} from "../_lib/manual-grading";

export function ManualGradingPage({ examId }: { examId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const studentId = searchParams.get("studentId") ?? "";
  const studentName = searchParams.get("studentName") ?? "Сурагч";
  const studentNumber = searchParams.get("studentNumber") ?? "—";
  const classLabel = searchParams.get("classLabel") ?? "—";
  const examTitle = searchParams.get("examTitle") ?? "Шалгалт";
  const subject = searchParams.get("subject") ?? "Хичээл";
  const maxScore = Number(searchParams.get("maxScore") ?? "100");
  const currentScore = Number(searchParams.get("currentScore") ?? "0");

  const savedRecord = useMemo(
    () => readManualGradingRecord(examId, studentId),
    [examId, studentId],
  );
  const bootstrap = useMemo(
    () => readManualGradingBootstrap(examId, studentId),
    [examId, studentId],
  );

  const [questions, setQuestions] = useState<ManualGradingQuestion[]>(() =>
    buildInitialManualQuestions({
      bootstrap,
      examId,
      examTitle,
      savedRecord,
      subject,
    }),
  );
  const [activeQuestionId, setActiveQuestionId] = useState<string>(
    () => questions[0]?.id ?? "",
  );
  const [saveMessage, setSaveMessage] = useState("");

  const activeQuestion =
    questions.find((question) => question.id === activeQuestionId) ??
    questions[0] ??
    null;

  const previousSavedManualScore = savedRecord
    ? sumManualScore(savedRecord.questions)
    : 0;
  const baselineAutoScore = Math.max(0, currentScore - previousSavedManualScore);
  const manualScore = sumManualScore(questions);
  const manualMaxScore = sumManualMaxScore(questions);
  const recomputedTotal = Math.min(maxScore, baselineAutoScore + manualScore);

  const updateQuestion = (
    questionId: string,
    partial: Partial<ManualGradingQuestion>,
  ) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId ? { ...question, ...partial } : question,
      ),
    );
  };

  const handleSave = () => {
    if (!studentId) return;

    const now = new Date().toISOString();
    const nextQuestions = questions.map((question) => ({
      ...question,
      savedAt: now,
    }));
    setQuestions(nextQuestions);
    writeManualGradingRecord({
      examId,
      studentId,
      questions: nextQuestions,
      updatedAt: now,
    });
    setSaveMessage("Гараар зассан оноог түр хадгаллаа.");
    window.setTimeout(() => setSaveMessage(""), 2400);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="rounded-[28px] border border-[#dbe5f1] bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] sm:p-7">
        <div className="flex flex-col gap-4 border-b border-[#e8edf5] pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#d9e4f2] bg-white px-4 py-2 text-sm font-semibold text-[#183153] transition hover:border-[#9ecbff] hover:bg-[#f5faff]"
              onClick={() => router.back()}
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
              Буцах
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f8ea8]">
                ГАРААР ЗАСАХ
              </p>
              <h1 className="mt-2 text-2xl font-extrabold text-[#183153] sm:text-3xl">
                {examTitle}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#5f7394]">
                {subject} · {classLabel} · {studentName}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryCard label="Одоогийн бүртгэлтэй дүн" value={`${currentScore} / ${maxScore}`} />
            <SummaryCard label="Гараар засах хэсэг" value={`${manualScore} / ${manualMaxScore}`} />
            <SummaryCard
              emphasis
              label="Шинэ нийт дүн"
              value={`${recomputedTotal} / ${maxScore}`}
            />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[#d8e6f6] bg-[#f8fbff] px-4 py-3 text-sm leading-6 text-[#48607f]">
          Задгай асуултын оноог 0-ээс тухайн асуултын дээд оноо хүртэл өгнө.
          `Хадгалах` дарсны дараа энэ screen дээр түр хадгалагдана. Backend
          холболт нэмэхэд эцсийн дүнтэй нэгтгэхэд бэлэн бүтэцтэй.
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-[#dbe5f1] bg-[#fbfdff] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8ea8]">
                  Сурагч
                </p>
                <h2 className="mt-1 text-lg font-bold text-[#183153]">
                  {studentName}
                </h2>
                <p className="text-sm text-[#5f7394]">
                  {studentNumber} · {classLabel}
                </p>
              </div>
              <span className="rounded-full border border-[#d9e4f2] bg-white px-3 py-1 text-xs font-semibold text-[#48607f]">
                {questions.length} задгай асуулт
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {questions.map((question) => {
                const isActive = question.id === activeQuestionId;
                return (
                  <button
                    key={question.id}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                      isActive
                        ? "border-[#62b4ff] bg-[#eef7ff]"
                        : "border-[#e3ebf5] bg-white hover:border-[#b4d8ff] hover:bg-[#f8fbff]"
                    }`}
                    onClick={() => setActiveQuestionId(question.id)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f8ea8]">
                          Асуулт {question.order}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[#183153]">
                          {question.prompt}
                        </p>
                      </div>
                      {question.savedAt ? (
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#22a05a]" />
                      ) : null}
                    </div>
                    <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-[#183153]">
                      {question.awardedScore} / {question.maxScore}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-3xl border border-[#dbe5f1] bg-white p-5">
            {activeQuestion ? (
              <>
                <div className="flex flex-col gap-3 border-b border-[#e8edf5] pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8ea8]">
                      ЗАДГАЙ АСУУЛТ
                    </p>
                    <h2 className="mt-2 text-xl font-extrabold text-[#183153]">
                      Асуулт {activeQuestion.order}
                    </h2>
                  </div>
                  <div className="rounded-full border border-[#d9e4f2] bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#48607f]">
                    Дээд оноо: {activeQuestion.maxScore}
                  </div>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="space-y-5">
                    <Panel title="Асуултын текст">
                      <p className="whitespace-pre-line text-sm leading-7 text-[#183153]">
                        {activeQuestion.prompt}
                      </p>
                    </Panel>

                    <Panel title="Сурагчийн хариулт">
                      <p className="whitespace-pre-line text-sm leading-7 text-[#183153]">
                        {activeQuestion.studentAnswer}
                      </p>
                    </Panel>
                  </div>

                  <div className="space-y-5">
                    <Panel title="Оноо өгөх">
                      <div className="space-y-4">
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-[#183153]">
                            Оноо
                          </span>
                          <input
                            className="h-12 w-full rounded-2xl border border-[#d6e2f0] px-4 text-sm text-[#183153] outline-none transition focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10"
                            max={activeQuestion.maxScore}
                            min={0}
                            onChange={(event) => {
                              const numeric = Number(event.target.value);
                              const safeValue = Number.isFinite(numeric)
                                ? Math.max(0, Math.min(activeQuestion.maxScore, numeric))
                                : 0;
                              updateQuestion(activeQuestion.id, {
                                awardedScore: safeValue,
                              });
                            }}
                            type="number"
                            value={activeQuestion.awardedScore}
                          />
                        </label>

                        <div className="flex flex-wrap gap-2">
                          <QuickScoreButton
                            label="0 оноо"
                            onClick={() =>
                              updateQuestion(activeQuestion.id, { awardedScore: 0 })
                            }
                          />
                          <QuickScoreButton
                            label="Бүтэн оноо"
                            onClick={() =>
                              updateQuestion(activeQuestion.id, {
                                awardedScore: activeQuestion.maxScore,
                              })
                            }
                          />
                        </div>

                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-[#183153]">
                            Багшийн тайлбар
                          </span>
                          <textarea
                            className="min-h-32 w-full rounded-2xl border border-[#d6e2f0] px-4 py-3 text-sm leading-7 text-[#183153] outline-none transition focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10"
                            onChange={(event) =>
                              updateQuestion(activeQuestion.id, {
                                teacherFeedback: event.target.value,
                              })
                            }
                            placeholder="Яагаад энэ оноог өгснөө тайлбарлаж болно."
                            value={activeQuestion.teacherFeedback}
                          />
                        </label>
                      </div>
                    </Panel>

                    <button
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#29A4FF] px-4 text-sm font-semibold text-white transition hover:bg-[#1997f2]"
                      onClick={handleSave}
                      type="button"
                    >
                      <Save className="h-4 w-4" />
                      Гараар зассан оноог хадгалах
                    </button>

                    {saveMessage ? (
                      <p className="rounded-2xl border border-[#d6ead4] bg-[#f3fbf0] px-4 py-3 text-sm font-medium text-[#2d7a38]">
                        {saveMessage}
                      </p>
                    ) : null}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d7e3f4] px-6 py-10 text-center text-sm text-[#5f7394]">
                Гараар засах асуулт олдсонгүй.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
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
      <p className="mt-2 text-lg font-extrabold text-[#183153]">{value}</p>
    </div>
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
    <div className="rounded-3xl border border-[#dbe5f1] bg-[#fbfdff] p-4">
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
      className="inline-flex h-10 items-center justify-center rounded-full border border-[#d7e3f4] bg-white px-4 text-sm font-semibold text-[#365077] transition hover:border-[#aac8f8] hover:text-[#1f6feb]"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
