"use client";

import { ArrowRight, Heart, PencilLine, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTeacher } from "../../teacher-shell";
import type { Question } from "../_lib/types";
import { DIFFICULTY_LABELS } from "../_lib/utils";

type QuestionCardProps = {
  heartCount: number;
  isActive?: boolean;
  isLiked: boolean;
  question: Question;
  onAddToExam: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onOpen?: () => void;
  onToggleLike: () => void;
};

const difficultyStyles = {
  easy: "bg-[#ecfdf3] text-[#027a48]",
  medium: "bg-[#fff7ed] text-[#c2410c]",
  hard: "bg-[#fff1f2] text-[#be123c]",
} as const;

export function QuestionCard({
  heartCount,
  isActive = false,
  isLiked,
  question,
  onAddToExam,
  onDelete,
  onEdit,
  onOpen,
  onToggleLike,
}: QuestionCardProps) {
  const teacher = useTeacher();
  const canManage =
    question.source === "school" && question.teacherName === teacher.name;

  return (
    <article
      className={cn(
        "group flex h-full flex-col justify-between rounded-[22px] border bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.09)]",
        isActive
          ? "border-[#93c5fd] shadow-[0_16px_40px_rgba(59,130,246,0.14)]"
          : "border-[#e5ebf3]",
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#eef4ff] px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-[#355caa]">
              Системийн сан
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                difficultyStyles[question.difficulty],
              )}
            >
              {DIFFICULTY_LABELS[question.difficulty]}
            </span>
          </div>

          <div className="hidden items-center gap-2 text-xs text-[#9ca3af] lg:flex">
            Нээлттэй
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#9ca3af]">
            {question.subject}
          </p>
          <button className="w-full text-left" onClick={onOpen} type="button">
            <h3 className="line-clamp-3 text-lg font-semibold leading-7 tracking-[-0.02em] text-[#111827]">
              {question.content.prompt}
            </h3>
            {question.title && question.title !== question.content.prompt ? (
              <p className="line-clamp-1 text-sm text-[#6b7280]">{question.title}</p>
            ) : null}
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Tag>{question.grade}</Tag>
            <Tag>{question.subject}</Tag>
            <Tag>{question.subtopic?.trim() || question.topic}</Tag>
          </div>
          <button
            className={cn(
              "inline-flex items-center gap-1 self-start rounded-full border px-2.5 py-1 transition",
              isLiked
                ? "border-[#fecdd3] bg-[#fff1f2] text-[#e11d48]"
                : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-[#fbcfe8] hover:text-[#e11d48]",
            )}
            onClick={onToggleLike}
            type="button"
          >
            <Heart className={cn("h-4 w-4", isLiked ? "fill-current" : "")} />
            {heartCount}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-[#f1f3f5] pt-4 sm:flex-row sm:items-center sm:justify-end">
        {canManage ? (
          <>
            <button
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dbe4f0] bg-white px-3 text-sm font-medium text-[#355caa] transition hover:border-[#bfd2f6] hover:text-[#1d4ed8] active:translate-y-px"
              onClick={onEdit}
              type="button"
            >
              <PencilLine className="mr-2 h-4 w-4" />
              Засах
            </button>
            <button
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#f0d7d9] bg-white px-3 text-sm font-medium text-[#b42318] transition hover:border-[#e8b4b8] hover:bg-[#fff5f5] active:translate-y-px"
              onClick={onDelete}
              type="button"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Устгах
            </button>
          </>
        ) : null}
        <button
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[#111827] px-3 text-sm font-semibold text-white opacity-100 transition hover:bg-[#1f2937] active:translate-y-px md:opacity-80 md:group-hover:opacity-100"
          onClick={onAddToExam}
          type="button"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Шалгалтанд нэмэх
        </button>
      </div>
    </article>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#eceef2] bg-[#f8fafc] px-2.5 py-1 text-xs font-medium text-[#4b5563]">
      {children}
    </span>
  );
}
