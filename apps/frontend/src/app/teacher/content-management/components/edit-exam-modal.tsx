"use client";

import { useEffect, useState } from "react";
import type { Exam, Question } from "../types";
import { createEmptyQuestion, normalizeQuestionForType } from "../utils";
import { QuestionFormItem } from "./question-form-item";

export function EditExamModal({
  exam,
  open,
  onClose,
  onSave,
}: {
  exam: Exam | null;
  open: boolean;
  onClose: () => void;
  onSave: (exam: Exam) => void;
}) {
  const [draft, setDraft] = useState<Exam | null>(exam);

  useEffect(() => {
    setDraft(exam);
  }, [exam]);

  if (!open || !draft) return null;

  const updateQuestion = (id: string, next: Question) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.map((item) =>
              item.id === id ? normalizeQuestionForType(next) : item,
            ),
          }
        : prev,
    );
  };

  const removeQuestion = (id: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            questions:
              prev.questions.length === 1
                ? prev.questions
                : prev.questions.filter((item) => item.id !== id),
          }
        : prev,
    );
  };

  const addQuestion = () => {
    setDraft((prev) =>
      prev ? { ...prev, questions: [...prev.questions, createEmptyQuestion()] } : prev,
    );
  };

  const submit = () => {
    if (!draft.title.trim()) return;
    onSave({
      ...draft,
      title: draft.title.trim(),
      questions: draft.questions
        .map((q) => ({
          ...q,
          text: q.text.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctAnswer: q.correctAnswer.trim(),
        }))
        .filter((q) => q.text.length > 0)
        .map((q) => normalizeQuestionForType(q)),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-3">
      <section className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-4 font-bold text-[#1f2a44]">Шалгалт засах</h3>
            <p className="text-2 text-[#5c6f91]">Нэр, хугацаа болон асуултуудыг шинэчилнэ.</p>
          </div>
          <button
            className="rounded-lg border border-[#d9e6fb] px-2 py-1 text-2 text-[#5c6f91]"
            onClick={onClose}
            type="button"
          >
            Хаах
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          <div>
            <p className="mb-1 text-2 text-[#5c6f91]">Шалгалтын нэр: сурагчид харагдах нэр</p>
            <input
              className="h-10 w-full rounded-lg border border-[#d9e6fb] px-3 text-2 text-[#1f2a44]"
              onChange={(e) => setDraft((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
              value={draft.title}
            />
          </div>
          <div>
            <p className="mb-1 text-2 text-[#5c6f91]">Хугацаа: сурагчийн шалгалт өгөх нийт минут</p>
            <input
              className="h-10 w-full rounded-lg border border-[#d9e6fb] px-3 text-2 text-[#1f2a44]"
              min={10}
              onChange={(e) =>
                setDraft((prev) =>
                  prev ? { ...prev, duration: Number(e.target.value) || 10 } : prev,
                )
              }
              type="number"
              value={draft.duration}
            />
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {draft.questions.map((q, index) => (
            <QuestionFormItem
              index={index}
              key={q.id}
              onChange={(next) => updateQuestion(q.id, next)}
              onRemove={() => removeQuestion(q.id)}
              question={q}
            />
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="rounded-xl border border-[#d9e6fb] bg-[#f7fbff] px-3 py-2 text-2 font-semibold text-[#335c96]"
            onClick={addQuestion}
            type="button"
          >
            Асуулт нэмэх
          </button>
          <button
            className="rounded-xl bg-[#4f9dff] px-4 py-2 text-2 font-semibold text-white"
            onClick={submit}
            type="button"
          >
            Хадгалах
          </button>
        </div>
      </section>
    </div>
  );
}
