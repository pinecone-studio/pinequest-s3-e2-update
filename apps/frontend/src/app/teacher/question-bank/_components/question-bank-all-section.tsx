"use client";

import type { Question } from "../_lib/types";
import { QuestionList } from "./question-list";
import { QuestionPreviewPanel } from "./question-preview-panel";

type QuestionBankAllSectionProps = {
  activeQuestionId: string | null;
  activeQuestion: Question | null;
  filteredQuestions: Question[];
  getQuestionHeartCount: (question: Question) => number;
  likedQuestionIds: string[];
  onAddToExam: (questionId: string) => void;
  onCreateQuestion: () => void;
  onDeleteQuestion: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  onOpenQuestion: (questionId: string) => void;
  onToggleQuestionSelection: (questionId: string) => void;
  onToggleLike: (questionId: string) => void;
  selectedQuestionIds: string[];
};

export function QuestionBankAllSection({
  activeQuestion,
  activeQuestionId,
  filteredQuestions,
  getQuestionHeartCount,
  likedQuestionIds,
  onAddToExam,
  onCreateQuestion,
  onDeleteQuestion,
  onEditQuestion,
  onOpenQuestion,
  onToggleQuestionSelection,
  onToggleLike,
  selectedQuestionIds,
}: QuestionBankAllSectionProps) {
  return (
    <div className="qb-fade-up">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
            Системийн сан
          </p>
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#111827]">
            Бүх асуултууд
          </h2>
        </div>
        <p className="text-sm text-[#6b7280]">Сонгосон хүрээний бүх багшийн асуултууд</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px]">
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
          questions={filteredQuestions}
          selectedQuestionIds={selectedQuestionIds}
        />
        <div className="xl:sticky xl:top-24 xl:self-start">
          <QuestionPreviewPanel question={activeQuestion} />
        </div>
      </div>
    </div>
  );
}
