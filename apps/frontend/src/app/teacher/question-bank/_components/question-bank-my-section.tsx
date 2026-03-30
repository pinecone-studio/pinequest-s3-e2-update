"use client";

import type { Question } from "../types";
import { QuestionList } from "./question-list";

type QuestionBankMySectionProps = {
  activeQuestionId: string | null;
  getQuestionHeartCount: (question: Question) => number;
  likedQuestionIds: string[];
  myQuestionCount: number;
  myQuestions: Question[];
  onAddToExam: (questionId: string) => void;
  onCreateQuestion: () => void;
  onDeleteQuestion: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  onOpenQuestion: (questionId: string) => void;
  onToggleQuestionSelection: (questionId: string) => void;
  onToggleLike: (questionId: string) => void;
  selectedQuestionIds: string[];
};

export function QuestionBankMySection({
  activeQuestionId,
  getQuestionHeartCount,
  likedQuestionIds,
  myQuestionCount,
  myQuestions,
  onAddToExam,
  onCreateQuestion,
  onDeleteQuestion,
  onEditQuestion,
  onOpenQuestion,
  onToggleQuestionSelection,
  onToggleLike,
  selectedQuestionIds,
}: QuestionBankMySectionProps) {
  return (
    <section className="rounded-[28px] border border-[#e7e9ee] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)] sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
            Миний хэсэг
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#111827]">
            Миний үүсгэсэн асуултууд
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#6b7280]">
            Таны өөрөө нэмсэн, засварлах боломжтой асуултууд.
          </p>
        </div>
        <div className="inline-flex items-center rounded-full border border-[#dbe4f0] bg-[#f8fbff] px-3 py-1.5 text-sm font-medium text-[#355caa]">
          {myQuestionCount} асуулт
        </div>
      </div>

      <div className="mt-6">
        {myQuestions.length > 0 ? (
          <QuestionList
            activeQuestionId={activeQuestionId}
            getQuestionHeartCount={getQuestionHeartCount}
            likedQuestionIds={likedQuestionIds}
            onAddToExam={onAddToExam}
            onCreateQuestion={onCreateQuestion}
            onDeleteQuestion={onDeleteQuestion}
            onEditQuestion={onEditQuestion}
            onOpenQuestion={onOpenQuestion}
            onToggleQuestionSelection={onToggleQuestionSelection}
            onToggleLike={onToggleLike}
            questions={myQuestions}
            selectedQuestionIds={selectedQuestionIds}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[#dbe4f0] bg-[#fbfdff] px-5 py-8 text-sm text-[#6b7280]">
            Одоогоор таны үүсгэсэн асуулт алга байна.
          </div>
        )}
      </div>
    </section>
  );
}
