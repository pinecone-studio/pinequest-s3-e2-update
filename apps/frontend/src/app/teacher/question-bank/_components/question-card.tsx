"use client";

import { Bookmark, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question } from "../types";
import { DIFFICULTY_LABELS } from "../utils";

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
        "group flex min-h-[185px] flex-col rounded-[12px] border bg-white px-[22px] py-[14px]",
        isSelected
          ? "border-[#7DC8FF]"
          : isActive
            ? "border-[#7DC8FF]"
            : "border-[#E5E5E5]",
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
          className="inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[7px] border border-[#2F4A87] text-[#2F4A87]"
          onClick={onToggleSelect}
          type="button"
        >
          {isSelected ? (
            <span className="h-[10px] w-[10px] rounded-[3px] bg-[#2F4A87]" />
          ) : null}
        </button>
      </div>

      <button className="mt-[16px] w-full text-left" onClick={onOpen} type="button">
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
