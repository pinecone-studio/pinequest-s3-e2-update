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
        "group flex min-h-[185px] flex-col rounded-[12px] border px-[22px] py-[14px]",
        isActive && !isSelected ? "min-h-[185px]" : "",
        isSelected
          ? "border-[#7DC8FF] bg-white"
          : isActive
            ? "border-[#7DC8FF] bg-[#DCEEFF]"
            : "border-[#E5E5E5] bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex flex-wrap items-center gap-[10px]">
          <Chip tone="blue">Нэгтгэсэн</Chip>
          <Chip tone="neutral">
            {question.questionType === "multiple_choice"
              ? "Сонгох асуулт"
              : "Задгай"}
          </Chip>
          <Chip tone="blue">{DIFFICULTY_LABELS[question.difficulty]}</Chip>
        </div>

        <button
          aria-label="Select question"
          aria-pressed={isSelected}
          className={cn(
            "inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] border transition-colors",
            isSelected
              ? "border-[#2F4A87] bg-[#2F4A87] text-white"
              : "border-[#2F4A87] bg-white text-transparent hover:bg-[#eef4ff]",
          )}
          onClick={onToggleSelect}
          type="button"
        >
          <Check className="h-[14px] w-[14px]" strokeWidth={3} />
        </button>
      </div>

      <button
        className="mt-[16px] w-full text-left"
        onClick={onOpen}
        type="button"
      >
        <h3 className="line-clamp-2 text-[16px] font-medium leading-[20px] text-[#323232]">
          {question.title || "Квадрат функцийн оройг олох"}
        </h3>
        <p className="mt-[10px] line-clamp-2 text-[12px] leading-[18px] text-[#7B7B7B]">
          {question.content.prompt}
        </p>
      </button>

      <div className="mt-[14px] flex flex-wrap items-center gap-[10px]">
        <Tag>{question.grade}</Tag>
        <Tag>{question.subject}</Tag>
        <Tag>{question.subtopic?.trim() || question.topic}</Tag>
        <Tag>
          {question.gradingType === "auto" ? "Автомат үнэлгээ" : "Гар үнэлгээ"}
        </Tag>
      </div>

      <div className="mt-[14px] flex items-center justify-end gap-[18px] text-[12px] leading-[15px] text-[#7B7B7B]">
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
          <span>{heartCount}</span>
        </button>

        <div className="inline-flex items-center gap-[6px]">
          <Bookmark className="h-[14px] w-[14px] text-[#7B7B7B]" />
          <span>{question.usageCount} удаа ашигласан</span>
        </div>
      </div>
    </article>
  );
}

function Chip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "blue" | "neutral";
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[20px] items-center rounded-[5px] px-[14px] text-[8px] font-medium leading-[10px]",
        tone === "blue"
          ? "bg-[#D7ECFF] text-[#5172A6]"
          : "bg-[#F1F3F7] text-[#2F4A87]",
      )}
    >
      {children}
    </span>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[20px] items-center rounded-[5px] bg-[#D7ECFF] px-[14px] text-[8px] font-medium leading-[10px] text-[#5172A6]">
      {children}
    </span>
  );
}
