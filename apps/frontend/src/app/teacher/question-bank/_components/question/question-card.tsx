"use client";

import { Bookmark, Check, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question } from "../../_lib/types";
import { DIFFICULTY_LABELS } from "../../_lib/utils";

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
  return (
    <article
      className={cn(
        "group relative flex min-h-[248px] flex-col rounded-[14px] border px-[28px] pb-[20px] pt-[24px]",
        isActive && !isSelected ? "min-h-[185px]" : "",
        isSelected
          ? "border-[#7DC8FF] bg-white"
          : isActive
            ? "border-[#7DC8FF] bg-white"
            : "border-[#E5E5E5] bg-white",
      )}
    >
      <button
        aria-label="Select question"
        aria-pressed={isSelected}
        className={cn(
          "absolute right-[26px] top-[18px] inline-flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[10px] border-[2px] transition-colors",
          isSelected
            ? "border-[#404040] bg-white text-[#404040]"
            : "border-[#404040] bg-white text-transparent hover:bg-[#eef4ff]",
        )}
        onClick={onToggleSelect}
        type="button"
      >
        <Check className="h-[18px] w-[18px]" strokeWidth={3} />
      </button>

      <button
        className="w-full pr-[60px] text-left"
        onClick={onOpen}
        type="button"
      >
        <h3 className="line-clamp-2 text-[18px] font-medium leading-[22px] text-[#323232]">
          {question.title || "Квадрат функцийн оройг олох"}
        </h3>
        <p className="mt-[14px] line-clamp-2 text-[12px] leading-[18px] text-[#323232]">
          {question.content.prompt}
        </p>
      </button>

      <div className="mt-[18px] flex flex-wrap items-center gap-[10px]">
        <Tag>{question.grade}</Tag>
        <Tag>{question.subject}</Tag>
        <Tag>{question.subtopic?.trim() || question.topic}</Tag>
      </div>

      <div className="mt-[8px] flex flex-wrap items-center gap-[10px]">
        <Tag>{question.questionType === "multiple_choice" ? "Сонгох асуулт" : "Задгай"}</Tag>
        <Tag>{DIFFICULTY_LABELS[question.difficulty]}</Tag>
        <Tag>{question.gradingType === "auto" ? "Автомат үнэлгээ" : "Гар үнэлгээ"}</Tag>
      </div>

      <p className="mt-[14px] text-[12px] leading-[15px] text-[#323232]">
        16-р сургууль · Багш: {question.teacherName ?? "О.Наранзул"}
      </p>

      <div className="mt-auto pt-[14px]">
        <div className="h-px w-full bg-[#E5E5E5]" />
      </div>

      <div className="mt-[12px] flex items-center justify-between text-[12px] leading-[15px] text-[#7B7B7B]">
        <button
          className="inline-flex items-center gap-[6px]"
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

        <div className="inline-flex items-center gap-[6px]">
          <Bookmark className="h-[14px] w-[14px] text-[#7B7B7B]" />
          <span>{question.usageCount} удаа ашигласан</span>
        </div>
      </div>
    </article>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[26px] items-center rounded-[10px] border border-[#E5E5E5] bg-white px-[16px] text-[12px] font-normal leading-[14px] text-[#0A0A0A]">
      {children}
    </span>
  );
}
