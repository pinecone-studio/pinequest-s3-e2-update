"use client";

import type { Question } from "../_lib/types";
import { QuestionBankActivePanel } from "./bank/question-bank-active-panel";
import { QuestionList } from "./question/question-list";

type QuestionBankFigmaResultsProps = {
  activeQuestionId: string | null;
  getQuestionHeartCount: (question: Question) => number;
  myQuestionCount: number;
  onAddToExam: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  onOpenQuestion: (questionId: string) => void;
  onToggleLike: (questionId: string) => void;
  onToggleSelection: (questionId: string) => void;
  previewQuestion: Question | null;
  questions: Question[];
  selectedQuestionIds: string[];
};

export function QuestionBankFigmaResults({
  activeQuestionId,
  myQuestionCount,
  previewQuestion,
  questions,
  selectedQuestionIds,
  getQuestionHeartCount,
  onAddToExam,
  onEditQuestion,
  onOpenQuestion,
  onToggleLike,
  onToggleSelection,
}: QuestionBankFigmaResultsProps) {
  return (
    <div className="space-y-[14px]">
      <section className="min-h-[88px] rounded-[12px] border border-[#E5E5E5] bg-[#F5F5F5] px-[20px] py-[20px]">
        <div className="flex items-start justify-between gap-[18px]">
          <div className="min-w-0">
            <h2 className="text-[24px] font-medium leading-[29px] tracking-[0.01em] text-[#122459]">
              Миний үүсгэсэн асуултууд
            </h2>
            <p className="mt-[4px] text-[14px] font-normal leading-[17px] text-[#737373]">
              Таны өөрөө нэмсэн, засварлах боломжтой асуултууд.
            </p>
          </div>
          <span className="shrink-0 pt-[1px] text-[24px] font-medium leading-[29px] text-[#122459]">
            {myQuestionCount} асуулт
          </span>
        </div>
        <div className="mt-[18px] flex h-[88px] items-center justify-center rounded-[12px] border border-dashed border-[#A3A3A3] bg-white px-[20px] text-center text-[18px] font-normal leading-[22px] tracking-[0.01em] text-[#122459]">
          Одоогоор таны үүсгэсэн асуулт алга байна.
        </div>
      </section>

      <div className="grid grid-cols-[minmax(0,1.78fr)_minmax(224px,0.9fr)] items-start gap-[14px]">
        <QuestionList
          activeQuestionId={activeQuestionId}
          getQuestionHeartCount={getQuestionHeartCount}
          likedQuestionIds={[]}
          onAddToExam={onAddToExam}
          onCreateQuestion={() => {}}
          onDeleteQuestion={() => {}}
          onEditQuestion={onEditQuestion}
          onOpenQuestion={onOpenQuestion}
          onToggleQuestionSelection={onToggleSelection}
          onToggleLike={onToggleLike}
          questions={questions}
          selectedQuestionIds={selectedQuestionIds}
        />
        <QuestionBankActivePanel question={previewQuestion} />
      </div>
    </div>
  );
}
