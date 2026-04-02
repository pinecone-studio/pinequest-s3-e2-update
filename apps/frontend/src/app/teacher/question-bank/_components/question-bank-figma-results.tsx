"use client";

import { Wrench } from "lucide-react";
import { useState } from "react";
import type { Question } from "../_lib/types";
import { DIFFICULTY_LABELS, resolveQuestionTitle } from "../_lib/utils";
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
      <section className="space-y-4 rounded-[10px] border border-[#E5E5E5] bg-white px-4 pb-5 pt-5 sm:space-y-[20px] sm:px-[28px] sm:pb-[28px] sm:pt-[26px]">
        <div className="grid grid-cols-2 overflow-hidden rounded-[6px] bg-[#f3f3f3]">
          <button
            className={`min-h-[48px] py-2 text-[11px] font-medium uppercase leading-tight tracking-[0.04em] sm:h-[56px] sm:py-0 sm:text-[18px] sm:tracking-[0.06em] md:text-[22px] lg:text-[26px] lg:tracking-[0.08em] ${
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
            className={`min-h-[48px] py-2 text-[11px] font-medium uppercase leading-tight tracking-[0.04em] sm:h-[56px] sm:py-0 sm:text-[18px] sm:tracking-[0.06em] md:text-[22px] lg:text-[26px] lg:tracking-[0.08em] ${
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
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.78fr)_minmax(280px,381px)] lg:gap-[22px]">
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

            <div className="min-w-0 space-y-[12px] pt-0 lg:pt-[4px]">
              <QuestionBankBulkToolbar
                count={selectedCount}
                onClear={onClearSelection}
                onSendToExam={onSendSelectedToExam}
              />
              <QuestionBankActivePanel question={previewQuestion} />
            </div>
          </div>
        ) : myQuestionCount === 0 ? (
          <div className="rounded-[10px] border border-dashed border-[#404040] px-[20px] py-[42px] text-center">
            <p className="text-[24px] font-medium leading-[30px] text-[#122459]">
              Одоогоор таны үүсгэсэн асуулт алга байна.
            </p>
          </div>
        ) : myQuestions.length > 3 ? (
          <div className="overflow-x-auto pb-[6px]">
            <div className="flex min-w-max gap-[10px]">
              {myQuestions.map((question) => (
                <ManagementCard
                  key={question.id}
                  layout="carousel"
                  onEditQuestion={onEditQuestion}
                  question={question}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 xl:grid-cols-3">
            {myQuestions.map((question) => (
              <ManagementCard
                key={question.id}
                layout="grid"
                onEditQuestion={onEditQuestion}
                question={question}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ManagementCard({
  layout = "carousel",
  onEditQuestion,
  question,
}: {
  layout?: "carousel" | "grid";
  onEditQuestion: (questionId: string) => void;
  question: Question;
}) {
  const widthClass =
    layout === "grid"
      ? "w-full min-w-0"
      : "w-[min(85vw,332px)] shrink-0 sm:w-[332px]";

  return (
    <article
      className={`${widthClass} rounded-[10px] border border-[#ECECEC] bg-white p-[24px]`}
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
        <TagChip>
          {question.questionType === "multiple_choice"
            ? "Сонгох асуулт"
            : "Задгай"}
        </TagChip>
        <TagChip>
          {question.gradingType === "auto" ? "Автомат үнэлгээ" : "Гар үнэлгээ"}
        </TagChip>
        <TagChip>{DIFFICULTY_LABELS[question.difficulty]}</TagChip>
      </div>

      <h3 className="mt-[18px] text-[16px] font-medium leading-[22px] text-[#323232]">
        {resolveQuestionTitle(question.title, question.content.prompt) ||
          "Асуултын дэлгэрэнгүй"}
      </h3>

      <div className="mt-[10px] space-y-[2px] text-[12px] leading-[18px] text-[#323232]">
        {splitPromptLines(question.content.prompt).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      {question.questionType === "multiple_choice" ? (
        <div className="mt-[14px] space-y-[8px]">
          {question.options.slice(0, 4).map((option, index) => (
            <div
              key={option.id}
              className={`flex h-[24px] items-center rounded-[4px] border px-[10px] text-[11px] leading-[13px] ${
                option.isCorrect
                  ? "border-[#7DC8FF] bg-[#75B8ED] text-[#122459]"
                  : "border-[#ECECEC] bg-white text-[#122459]"
              }`}
            >
              <span className="mr-[8px] shrink-0">{index + 1}.</span>
              <span className="truncate">{stripLeadingNumber(option.text)}</span>
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
    <span className="inline-flex h-[26px] items-center rounded-[8px] border border-[#ECECEC] bg-white px-[16px] text-[12px] font-normal leading-[14px] text-[#0A0A0A]">
      {children}
    </span>
  );
}

function stripLeadingNumber(value: string) {
  return value.replace(/^\s*\d+\.\s*/, "");
}

function splitPromptLines(prompt: string) {
  const normalized = prompt.trim();
  if (!normalized) return [];

  const explicitLines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (explicitLines.length > 1) return explicitLines;

  const splitIndex = normalized.search(/\s(?=[A-ZА-ЯӨҮЁ])/);
  if (splitIndex > 0) {
    const first = normalized.slice(0, splitIndex).trim();
    const second = normalized.slice(splitIndex + 1).trim();
    if (first && second) return [first, second];
  }

  return [normalized];
}
