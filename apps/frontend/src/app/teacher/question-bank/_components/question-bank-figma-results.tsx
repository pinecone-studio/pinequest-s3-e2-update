"use client";

import { Wrench } from "lucide-react";
import { useState } from "react";
import type { Question } from "../_lib/types";
import { DIFFICULTY_LABELS } from "../_lib/utils";
import { QuestionBankActivePanel } from "./bank/question-bank-active-panel";
import { QuestionBankBulkToolbar } from "./bank/question-bank-bulk-toolbar";
import { QuestionList } from "./question/question-list";

type QuestionBankFigmaResultsProps = {
  activeQuestionId: string | null;
  getQuestionHeartCount: (question: Question) => number;
  likedQuestionIds: string[];
  myQuestionCount: number;
  myQuestions: Question[];
  onAddToExam: (questionId: string) => void;
  onCreateQuestion: () => void;
  onOpenQuestion: (questionId: string) => void;
  onToggleLike: (questionId: string) => void;
  onToggleSelection: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  previewQuestion: Question | null;
  questions: Question[];
  selectedQuestionIds: string[];
  selectedCount: number;
  onClearSelection: () => void;
  onSendSelectedToExam: () => void;
};

export function QuestionBankFigmaResults({
  activeQuestionId,
  getQuestionHeartCount,
  likedQuestionIds,
  myQuestionCount,
  myQuestions,
  onAddToExam,
  onCreateQuestion,
  onOpenQuestion,
  onToggleLike,
  onToggleSelection,
  onEditQuestion,
  previewQuestion,
  questions,
  selectedQuestionIds,
  selectedCount,
  onClearSelection,
  onSendSelectedToExam,
}: QuestionBankFigmaResultsProps) {
  const [activeCategory, setActiveCategory] = useState<"bank" | "management">(
    "bank",
  );

  return (
    <div className="space-y-[18px]">
      <section className="space-y-[20px] rounded-[10px] border border-[#ECECEC] bg-white px-[28px] pb-[28px] pt-[26px]">
        <div className="grid grid-cols-2 overflow-hidden rounded-[6px] bg-[#f3f3f3]">
          <button
            className={`h-[56px] text-[26px] font-medium uppercase tracking-[0.08em] ${
              activeCategory === "bank"
                ? "bg-[#e9e9e9] text-[#122459]"
                : "bg-white text-[#122459]"
            }`}
            onClick={() => setActiveCategory("bank")}
            type="button"
          >
            АСУУЛТЫН САН
          </button>
          <button
            className={`h-[56px] text-[26px] font-medium uppercase tracking-[0.08em] ${
              activeCategory === "management"
                ? "bg-[#e9e9e9] text-[#122459]"
                : "bg-white text-[#122459]"
            }`}
            onClick={() => setActiveCategory("management")}
            type="button"
          >
            АСУУЛТЫН УДИРДЛАГА
          </button>
        </div>

        {activeCategory === "bank" ? (
          <div className="grid grid-cols-[minmax(0,1.78fr)_381px] items-start gap-[22px]">
            <QuestionList
              activeQuestionId={activeQuestionId}
              getQuestionHeartCount={getQuestionHeartCount}
              likedQuestionIds={likedQuestionIds}
              onAddToExam={onAddToExam}
              onCreateQuestion={onCreateQuestion}
              onDeleteQuestion={() => {}}
              onEditQuestion={onEditQuestion}
              onOpenQuestion={onOpenQuestion}
              onToggleQuestionSelection={onToggleSelection}
              onToggleLike={onToggleLike}
              questions={questions}
              selectedQuestionIds={selectedQuestionIds}
            />
            <div className="space-y-[12px] pt-[4px]">
              <QuestionBankBulkToolbar
                count={selectedCount}
                onClear={onClearSelection}
                onSendToExam={onSendSelectedToExam}
              />
              <QuestionBankActivePanel question={previewQuestion} />
            </div>
          </div>
        ) : myQuestions.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-[#404040] px-[20px] py-[42px] text-center">
            <p className="text-[24px] font-medium leading-[30px] text-[#122459]">
              Одоогоор таны үүсгэсэн асуулт алга байна.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-[6px]">
            <div className="flex min-w-max gap-[10px]">
              {myQuestions.map((question) => (
              <article
                className="w-[332px] shrink-0 rounded-[10px] border border-[#ECECEC] bg-white p-[24px]"
                key={question.id}
              >
                <div className="flex items-start justify-between gap-[10px]">
                  <p className="text-[13px] font-normal uppercase leading-[16px] text-[#7B7B7B]">
                    АСУУЛТЫН ДЭЛГЭРЭНГҮЙ
                  </p>
                  <button
                    className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-[#ECECEC] text-[#122459] transition hover:bg-[#f8fafc]"
                    onClick={() => onEditQuestion(question.id)}
                    type="button"
                  >
                    <Wrench className="h-[18px] w-[18px]" />
                  </button>
                </div>

                <div className="mt-[16px] flex flex-wrap gap-[10px]">
                  <TagChip>{question.questionType === "multiple_choice" ? "Сонгох асуулт" : "Задгай"}</TagChip>
                  <TagChip>{question.gradingType === "auto" ? "Автомат үнэлгээ" : "Гар үнэлгээ"}</TagChip>
                  <TagChip>{DIFFICULTY_LABELS[question.difficulty]}</TagChip>
                </div>

                <h3 className="mt-[18px] text-[16px] font-medium leading-[22px] text-[#323232]">
                  {question.title || "Асуултын дэлгэрэнгүй"}
                </h3>
                <p className="mt-[10px] text-[12px] leading-[18px] text-[#323232]">
                  {question.content.prompt}
                </p>

                {question.questionType === "multiple_choice" ? (
                  <div className="mt-[14px] space-y-[8px]">
                    {question.options.slice(0, 4).map((option, index) => (
                      <div
                        className={`flex h-[24px] items-center rounded-[4px] border px-[10px] text-[11px] leading-[13px] ${
                          option.isCorrect
                            ? "border-[#7DC8FF] bg-[#75B8ED] text-[#122459]"
                            : "border-[#ECECEC] bg-white text-[#122459]"
                        }`}
                        key={option.id}
                      >
                        <span className="mr-[8px] shrink-0">{index + 1}.</span>
                        <span className="truncate">{option.text}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-[18px] grid grid-cols-[1fr_auto] gap-x-[12px] gap-y-[8px]">
                  <MetaRow label="Сургууль" value="16" />
                  <MetaRow label="Багш" value={question.teacherName ?? "О.Наранзул"} />
                  <MetaRow label="Анги" value={question.grade} />
                  <MetaRow label="Хичээл" value={question.subject} />
                  <MetaRow label="Сэдэв" value={question.subtopic?.trim() || question.topic} />
                  <MetaRow label="Оноо" value={`${question.points}`} />
                  <MetaRow label="Ашигласан тоо" value={`${question.usageCount}`} />
                  <MetaRow label="Шинэчилсэн" value={question.updatedAt} />
                </div>
              </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="contents">
      <span className="text-[12px] leading-[15px] text-[#23407D]">{label}</span>
      <span className="text-[12px] leading-[15px] text-[#23407D]">{value}</span>
    </div>
  );
}

function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex h-[26px] items-center rounded-[8px] border border-[#ECECEC] bg-white px-[16px] text-[12px] font-normal leading-[14px] text-[#0A0A0A]"
    >
      {children}
    </span>
  );
}
