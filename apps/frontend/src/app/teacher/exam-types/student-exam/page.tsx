"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useExamFlow } from "../shared/store";
import { questionTypeLabel } from "../shared/utils";

export default function StudentExamPage() {
  const { examDraft, questions, studentAnswers, updateStudentAnswer, submitStudentExam } =
    useExamFlow();
  const [activeIndex, setActiveIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(examDraft.durationMinutes * 60);
  const [variant, setVariant] = useState<"A" | "B" | "C">("A");
  const [submitted, setSubmitted] = useState(false);

  const variantIds = useMemo(() => {
    const ids = examDraft.variants[variant];
    if (ids.length > 0) return ids;
    return examDraft.selectedQuestionIds;
  }, [examDraft.selectedQuestionIds, examDraft.variants, variant]);

  const examQuestions = useMemo(
    () =>
      variantIds
        .map((id) => questions.find((q) => q.id === id))
        .filter((q): q is NonNullable<typeof q> => Boolean(q)),
    [variantIds, questions],
  );

  const activeQuestion = examQuestions[activeIndex];
  const answeredCount = Object.values(studentAnswers).filter((v) => v.trim().length > 0).length;

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [submitted]);

  if (examQuestions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d9e6fb] bg-white p-8 text-3 text-[#5c6f91]">
        Сурагчийн шалгалт эхлэхийн тулд эхлээд “Шалгалт үүсгэгч” дээр асуулт сонгоод
        variant үүсгэнэ үү.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-6 font-extrabold text-[#1f2a44]">{examDraft.title}</h2>
            <p className="text-3 text-[#5c6f91]">
              {examDraft.subject} · {examDraft.durationMinutes} минут
            </p>
          </div>
          <div className="rounded-xl bg-[#eef6ff] px-3 py-2 text-4 font-bold text-[#335c96]">
            Хугацаа: {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["A", "B", "C"] as const).map((item) => (
            <button
              className={`rounded-lg px-3 py-1.5 text-3 font-semibold ${
                variant === item
                  ? "bg-[#4f9dff] text-white"
                  : "border border-[#d9e6fb] bg-white text-[#335c96]"
              }`}
              key={item}
              onClick={() => {
                setVariant(item);
                setActiveIndex(0);
              }}
              type="button"
            >
              Variant {item}
            </button>
          ))}
        </div>
        <div className="mt-3 h-2 rounded-full bg-[#e8f0fa]">
          <div
            className="h-2 rounded-full bg-[#4f9dff]"
            style={{ width: `${(answeredCount / examQuestions.length) * 100}%` }}
          />
        </div>
        <p className="mt-1 text-3 text-[#5c6f91]">
          Явц: {answeredCount}/{examQuestions.length}
        </p>
      </div>

      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
        <p className="text-3 text-[#5c6f91]">
          Асуулт {activeIndex + 1}/{examQuestions.length} · {questionTypeLabel[activeQuestion.type]}
        </p>
        <p className="mt-2 text-5 font-bold text-[#1f2a44]">{activeQuestion.title}</p>
        <p className="mt-1 text-3 text-[#5c6f91]">{activeQuestion.content}</p>

        <div className="mt-3">
          {activeQuestion.type === "multiple_choice" ? (
            <div className="space-y-2">
              {(activeQuestion.choices ?? []).map((choice) => (
                <label
                  className="flex items-center gap-2 rounded-lg border border-[#d9e6fb] bg-[#f7fbff] px-3 py-2 text-3 text-[#1f2a44]"
                  key={choice}
                >
                  <input
                    checked={studentAnswers[activeQuestion.id] === choice}
                    name={activeQuestion.id}
                    onChange={() => updateStudentAnswer(activeQuestion.id, choice)}
                    type="radio"
                  />
                  {choice}
                </label>
              ))}
            </div>
          ) : (
            <textarea
              className="min-h-28 w-full rounded-xl border border-[#d9e6fb] bg-[#f7fbff] px-3 py-2 text-3 outline-none"
              onChange={(e) => updateStudentAnswer(activeQuestion.id, e.target.value)}
              placeholder="Хариултаа энд бичнэ үү..."
              value={studentAnswers[activeQuestion.id] ?? ""}
            />
          )}
        </div>

        <div className="mt-3 flex flex-wrap justify-between gap-2">
          <button
            className="inline-flex items-center gap-1 rounded-lg border border-[#d9e6fb] bg-white px-3 py-2 text-3 font-semibold text-[#335c96] disabled:opacity-50"
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
            Өмнөх
          </button>
          <button
            className="inline-flex items-center gap-1 rounded-lg border border-[#d9e6fb] bg-white px-3 py-2 text-3 font-semibold text-[#335c96] disabled:opacity-50"
            disabled={activeIndex === examQuestions.length - 1}
            onClick={() =>
              setActiveIndex((prev) => Math.min(examQuestions.length - 1, prev + 1))
            }
            type="button"
          >
            Дараах
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-[#34c759] px-4 py-2 text-3 font-semibold text-white"
          onClick={() => {
            submitStudentExam();
            setSubmitted(true);
          }}
          type="button"
        >
          <Send className="h-4 w-4" />
          Шалгалт илгээх
        </button>
        {submitted && (
          <p className="mt-2 text-3 text-[#1d8a43]">
            Хариулт илгээгдлээ. Одоо “Үр дүн” хэсэг дээр дүнг харна уу.
          </p>
        )}
      </div>
    </div>
  );
}
