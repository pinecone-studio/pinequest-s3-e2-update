"use client";

import type { Question } from "../../_lib/types";
import { QuestionList } from "../question/question-list";

type QuestionBankMySectionProps = {
  activeQuestionId: string | null;
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
    <section className="rounded-[12px] border border-[#60a5fa] bg-[#fbfdff] px-[12px] py-[10px]">
      <div className="flex items-start justify-between gap-[12px] border-b border-dashed border-[#93c5fd] pb-[6px]">
        <div>
          <h2 className="text-[13px] font-medium leading-[18px] text-[#355caa]">
            Миний үүсгэсэн асуултууд
          </h2>
          <p className="mt-[2px] text-[10px] leading-[14px] text-[#7a8fb4]">
            Таны өөрөө нэмсэн, засварлах боломжтой асуултууд.
          </p>
        </div>
        <div className="pt-[1px] text-[12px] font-medium leading-[18px] text-[#355caa]">
          {myQuestionCount} асуулт
        </div>
      </div>

      <div className="mt-[10px]">
        {myQuestions.length > 0 ? (
          <QuestionList
            activeQuestionId={activeQuestionId}
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
          <div className="flex h-[48px] items-center justify-center rounded-[10px] border border-dashed border-[#93c5fd] bg-white text-[12px] font-medium text-[#6b7da1]">
            Одоогоор таны үүсгэсэн асуулт алга байна.
          </div>
        )}
      </div>
    </section>
  );
}
