"use client";

import { Bookmark, Check, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question } from "../../_lib/types";
import { DIFFICULTY_LABELS, resolveQuestionTitle } from "../../_lib/utils";

type QuestionCardProps = {
  compactAction?: boolean;
  heartCount: number;
  isActive?: boolean;
  isLiked: boolean;
  isSelected?: boolean;
  question: Question;
  onAddToExam: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onOpen?: () => void;
  onToggleSelect: () => void;
  onToggleLike: () => void;
};

export function QuestionCard({
  heartCount,
  isActive = false,
  isLiked,
  isSelected = false,
  question,
  onOpen,
  onToggleSelect,
  onToggleLike,
}: QuestionCardProps) {
  const promptLines = splitPromptLines(question.content.prompt);

  return (
    <article
      className={cn(
        "group relative flex min-h-[248px] flex-col rounded-[10px] border px-4 pb-4 pt-5 sm:px-[28px] sm:pb-[20px] sm:pt-[24px]",
        isSelected || isActive
          ? "border-[#7DC8FF] bg-white"
          : "border-[#ECECEC] bg-white",
      )}
    >
      <button
        aria-label="Select question"
        aria-pressed={isSelected}
        className={cn(
          "absolute right-[26px] top-[18px] inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[6px] border-[2px] transition-colors",
          isSelected
            ? "border-[#404040] bg-white text-[#404040]"
            : "border-[#404040] bg-white text-transparent hover:bg-[#eef4ff]",
        )}
        onClick={onToggleSelect}
        type="button"
      >
        <Check className="h-[14px] w-[14px]" strokeWidth={3} />
      </button>

      <button
        className="w-full pr-[60px] text-left"
        onClick={onOpen}
        type="button"
      >
        <h3 className="line-clamp-2 text-[20px] font-semibold leading-[120%] tracking-[0.04em] text-[#323232]">
          {resolveQuestionTitle(question.title, question.content.prompt) ||
            "Квадрат функцийн оройг олох"}
        </h3>
        <div className="mt-[14px] space-y-[2px] text-[14px] leading-[20px] text-[#323232]">
          {promptLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </button>

      <div className="mt-[18px] flex flex-wrap items-center gap-[10px]">
        <Tag>{question.grade}</Tag>
        <Tag>{question.subject}</Tag>
        <Tag>{question.subtopic?.trim() || question.topic}</Tag>
      </div>

      <div className="mt-[8px] flex flex-wrap items-center gap-[10px]">
        <Tag borderless>
          {question.questionType === "multiple_choice"
            ? "Сонгох асуулт"
            : "Задгай"}
        </Tag>
        <Tag borderless>{DIFFICULTY_LABELS[question.difficulty]}</Tag>
        <Tag borderless>
          {question.gradingType === "auto" ? "Автомат үнэлгээ" : "Гар үнэлгээ"}
        </Tag>
      </div>

      <p className="mt-[14px] text-[14px] font-normal leading-[140%] tracking-[0.04em] text-[#323232]">
        16-р сургууль · Багш: {question.teacherName ?? "О.Наранзул"}
      </p>

      <div className="mt-auto pt-[14px]">
        <div className="h-px w-full bg-[#E5E5E5]" />
      </div>

      <div className="mt-[12px] flex items-center justify-between text-[12px] leading-[140%] text-[#7B7B7B]">
        <button
          className={cn(
            "inline-flex items-center gap-[6px] px-[12px]",
            isLiked ? "text-[#e11d48]" : "text-[#7B7B7B]",
          )}
          onClick={onToggleLike}
          type="button"
        >
          <Heart
            className={cn(
              "h-[14px] w-[14px]",
              isLiked ? "fill-current text-[#e11d48]" : "text-[#7B7B7B]",
            )}
          />
          <span className={cn(isLiked ? "text-[#e11d48]" : "text-[#7B7B7B]")}>
            {heartCount}
          </span>
        </button>

        <div className="inline-flex items-center gap-[6px] px-[12px]">
          <Bookmark className="h-[14px] w-[14px] text-[#7B7B7B]" />
          <span>{question.usageCount} удаа ашигласан</span>
        </div>
      </div>
    </article>
  );
}

function Tag({
  borderless = false,
  children,
}: {
  borderless?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[26px] items-center rounded-[8px] px-[16px] text-[14px] font-normal leading-[14px] tracking-[0.04em] text-[#0A0A0A]",
        borderless ? "bg-transparent" : "border border-[#ECECEC] bg-white",
      )}
    >
      {children}
    </span>
  );
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
