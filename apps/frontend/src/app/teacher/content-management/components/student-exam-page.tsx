"use client";

import { Clock3, Flag, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Exam, StudentAnswer, TeacherClass } from "../types";

export function StudentExamPage({
  exam,
  studentClass,
  onClose,
}: {
  exam: Exam;
  studentClass: TeacherClass | null;
  onClose: () => void;
}) {
  const [answers, setAnswers] = useState<StudentAnswer[]>(() =>
    exam.questions.map((q) => ({ questionId: q.id, value: "" })),
  );
  const [remainingSeconds, setRemainingSeconds] = useState(() => exam.duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);

  useEffect(() => {
    if (submitted || remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds, submitted]);

  const timerLabel = useMemo(() => {
    const min = Math.floor(remainingSeconds / 60);
    const sec = remainingSeconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }, [remainingSeconds]);

  const answeredCount = answers.filter((item) => item.value.trim().length > 0).length;
  const currentQuestion = exam.questions[currentIndex];
  const currentAnswer = answers.find((item) => item.questionId === currentQuestion.id)?.value ?? "";

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) =>
      prev.map((item) => (item.questionId === questionId ? { ...item, value } : item)),
    );
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedIds((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    );
  };

  const questionState = (questionId: string) => {
    const answered = answers.find((item) => item.questionId === questionId)?.value.trim();
    const flagged = flaggedIds.includes(questionId);
    if (currentQuestion.id === questionId) return "current";
    if (flagged) return "flagged";
    if (answered) return "answered";
    return "idle";
  };

  const questionStateClass = (questionId: string) => {
    const state = questionState(questionId);
    if (state === "current") return "border-[#2f5ed5] bg-[#2f5ed5] text-white";
    if (state === "flagged") return "border-[#f39c12] bg-[#fff7e8] text-[#c07a10]";
    if (state === "answered") return "border-[#34c759] bg-[#ecf9f0] text-[#1d8a47]";
    return "border-[#d9e6fb] bg-white text-[#1f2a44]";
  };

  return (
    <section className="space-y-4 rounded-2xl border border-[#d9e6fb] bg-[#f4f7fd] p-4">
      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-4 font-bold text-[#1f2a44]">
              {exam.subject} — {studentClass?.grade ?? exam.grade}
            </h3>
            <p className="text-2 text-[#6b7590]">
              {exam.title} · {studentClass?.name ?? "Анги сонгогдоогүй"}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9e6fb] bg-[#f7fbff] px-3 py-2 text-2 text-[#5f6e90]">
            <Clock3 className="h-4 w-4 text-[#c26b3c]" />
            <span className="font-semibold text-[#2c3550]">{timerLabel}</span>
            <span>үлдсэн хугацаа</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4">
        <p className="text-2 font-semibold text-[#6b7590]">Асуулт {currentIndex + 1}</p>
        <p className="mt-2 text-4 font-bold text-[#1f2a44]">{currentQuestion.text}</p>

        <div className="mt-3 space-y-2">
          {currentQuestion.type === "multiple_choice" ? (
            currentQuestion.options.map((opt, optIndex) => {
              const label = String.fromCharCode(65 + optIndex);
              const selected = currentAnswer === opt;
              return (
                <button
                  className={
                    "flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-2 " +
                    (selected
                      ? "border-[#6f9cff] bg-[#f3f6ff] text-[#1f2a44]"
                      : "border-[#d9e6fb] bg-white text-[#1f2a44]")
                  }
                  key={label + opt}
                  onClick={() => setAnswer(currentQuestion.id, opt)}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={
                        "inline-flex h-7 w-7 items-center justify-center rounded-full text-2 font-semibold " +
                        (selected ? "bg-[#2f5ed5] text-white" : "bg-[#eef2f8] text-[#4f5d7f]")
                      }
                    >
                      {label}
                    </span>
                    {opt}
                  </span>
                  {selected ? (
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2f5ed5] text-white">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : null}
                </button>
              );
            })
          ) : currentQuestion.type === "short_answer" ? (
            <input
              className="h-11 w-full rounded-xl border border-[#d9e6fb] px-3 text-2 text-[#1f2a44]"
              onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
              placeholder="Богино хариулт"
              value={currentAnswer}
            />
          ) : (
            <textarea
              className="min-h-28 w-full rounded-xl border border-[#d9e6fb] px-3 py-2 text-2 text-[#1f2a44]"
              onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
              placeholder="Эсээ хариулт"
              value={currentAnswer}
            />
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <button
            className="rounded-xl border border-[#d9e6fb] bg-white px-4 py-2 text-2 font-semibold text-[#405174]"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            type="button"
          >
            ← Өмнөх
          </button>

          <div className="flex gap-2">
            <button
              className="rounded-xl border border-[#d9e6fb] bg-white px-4 py-2 text-2 font-semibold text-[#405174]"
              onClick={() => toggleFlag(currentQuestion.id)}
              type="button"
            >
              <Flag className="mr-1 inline h-4 w-4" />
              Тэмдэглэх
            </button>
            <button
              className="rounded-xl bg-[#2f5ed5] px-4 py-2 text-2 font-semibold text-white"
              onClick={() =>
                setCurrentIndex((prev) => Math.min(exam.questions.length - 1, prev + 1))
              }
              type="button"
            >
              Дараах →
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-4 font-bold text-[#1f2a44]">Асуултууд</h4>
          <div className="flex flex-wrap items-center gap-3 text-2 text-[#556080]">
            <Legend dotClass="bg-[#2f5ed5]" label="Одоогийн" />
            <Legend dotClass="bg-[#34c759]" label="Хариулсан" />
            <Legend dotClass="bg-[#f39c12]" label="Тэмдэглэсэн" />
            <Legend dotClass="bg-[#c6d2e3]" label="Хариулаагүй" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-3 md:grid-cols-10">
          {exam.questions.map((q, idx) => (
            <button
              className={"h-12 rounded-xl border text-2 font-semibold " + questionStateClass(q.id)}
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              type="button"
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-2 text-[#556080]">
            Явц: {answeredCount}/{exam.questions.length} хариулсан
          </p>
          {submitted ? (
            <div className="rounded-xl border border-[#34c759]/40 bg-[#ecf9f0] px-4 py-2 text-2 text-[#1d8a47]">
              Шалгалт амжилттай илгээгдлээ.
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                className="rounded-xl border border-[#d9e6fb] bg-white px-4 py-2 text-2 text-[#405174]"
                onClick={onClose}
                type="button"
              >
                Хаах
              </button>
              <button
                className="rounded-xl bg-[#2f5ed5] px-4 py-2 text-2 font-semibold text-white"
                onClick={() => setSubmitted(true)}
                type="button"
              >
                Дуусгах
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Legend({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={"h-2.5 w-2.5 rounded-full " + dotClass} />
      {label}
    </span>
  );
}
