"use client";

import { CheckSquare, CopyPlus, PencilLine, Square, Star } from "lucide-react";
import type { Question } from "../_lib/types";
import { formatDate } from "../_lib/utils";
import {
  DifficultyBadge,
  GradingTypeBadge,
  QuestionStatusBadge,
  QuestionTypeBadge,
} from "./question-badges";

type QuestionCardProps = {
  question: Question;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onEdit: () => void;
  onReuse: () => void;
};

export function QuestionCard({
  question,
  isActive,
  isSelected,
  onSelect,
  onOpen,
  onEdit,
  onReuse,
}: QuestionCardProps) {
  return (
    <article
      className={`rounded-3xl border p-5 shadow-sm transition ${
        isActive
          ? "border-[#7fb3ff] bg-[#f8fbff] shadow-[0_14px_30px_rgba(79,157,255,0.12)]"
          : "border-[#d8e2f0] bg-white hover:border-[#9fc2f4]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          className="mt-1 text-[#4f6b96] transition hover:text-[#1f6feb]"
          onClick={onSelect}
          type="button"
        >
          {isSelected ? (
            <CheckSquare className="h-5 w-5" />
          ) : (
            <Square className="h-5 w-5" />
          )}
        </button>

        <button
          className="min-w-0 flex-1 text-left"
          onClick={onOpen}
          type="button"
        >
          <div className="flex flex-wrap items-center gap-2">
            <QuestionStatusBadge status={question.status} />
            <QuestionTypeBadge type={question.questionType} />
            <DifficultyBadge difficulty={question.difficulty} />
          </div>
          <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-[#183153]">
            {question.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5f7394]">
            {question.content.prompt}
          </p>
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#6d7f9c]">
        <span className="rounded-full bg-[#f5f1ff] px-2.5 py-1 font-medium text-[#6242a7]">
          {question.grade}
        </span>
        <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 font-medium text-[#3b5a8f]">
          {question.subject}
        </span>
        <span className="rounded-full bg-[#eef6ff] px-2.5 py-1 font-medium text-[#2f66b9]">
          {question.topic}
        </span>
        <GradingTypeBadge gradingType={question.gradingType} />
        <span>{question.points} оноо</span>
        <span>{formatDate(question.updatedAt)} шинэчилсэн</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#ecf1f7] pt-4">
        <div className="inline-flex items-center gap-1 text-sm font-medium text-[#7a8aa5]">
          <Star className="h-4 w-4 text-[#ffb340]" />
          {question.usageCount} удаа ашигласан
        </div>

        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-10 items-center rounded-xl border border-[#d7e2f1] px-3 text-sm font-semibold text-[#365077] transition hover:border-[#aac8f8] hover:text-[#1f6feb]"
            onClick={onEdit}
            type="button"
          >
            <PencilLine className="mr-2 h-4 w-4" />
            Засах
          </button>
          <button
            className="inline-flex h-10 items-center rounded-xl bg-[#1f6feb] px-3 text-sm font-semibold text-white transition hover:bg-[#195fcc]"
            onClick={onReuse}
            type="button"
          >
            <CopyPlus className="mr-2 h-4 w-4" />
            Шалгалтад нэмэх
          </button>
        </div>
      </div>
    </article>
  );
}
