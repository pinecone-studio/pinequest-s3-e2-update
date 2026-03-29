"use client";

import { ArrowRight, CopyPlus, PencilLine, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question, QuestionBankTab } from "../_lib/types";
import { DIFFICULTY_LABELS } from "../_lib/utils";

type QuestionCardProps = {
  question: Question;
  tab: QuestionBankTab;
  onAddToExam: () => void;
  onCopyToSchool?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
};

const difficultyStyles = {
  easy: "bg-[#ecfdf3] text-[#027a48]",
  medium: "bg-[#fff7ed] text-[#c2410c]",
  hard: "bg-[#fff1f2] text-[#be123c]",
} as const;

export function QuestionCard({
  question,
  tab,
  onAddToExam,
  onCopyToSchool,
  onDelete,
  onEdit,
}: QuestionCardProps) {
  const isGlobal = tab === "global";

  return (
    <article
      className={cn(
        "group flex h-full flex-col justify-between rounded-[22px] border bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.09)]",
        isGlobal ? "border-[#e5ebf3]" : "border-[#efe6dc]",
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em]",
                isGlobal
                  ? "bg-[#eef4ff] text-[#355caa]"
                  : "bg-[#fff5eb] text-[#a16207]",
              )}
            >
              {isGlobal ? "Улсын сан" : "Сургуулийн сан"}
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
            {isGlobal ? "Verified source" : "Editable"}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#9ca3af]">
            {question.subject}
          </p>
          <h3 className="line-clamp-3 text-lg font-semibold leading-7 tracking-[-0.02em] text-[#111827]">
            {question.content.prompt}
          </h3>
          {question.title && question.title !== question.content.prompt ? (
            <p className="line-clamp-1 text-sm text-[#6b7280]">{question.title}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Tag>{question.grade}</Tag>
          <Tag>{question.subject}</Tag>
          <Tag>{question.subtopic?.trim() || question.topic}</Tag>
        </div>

        {isGlobal ? (
          <p className="text-sm text-[#6b7280]">Баталгаажсан улсын сангийн асуулт</p>
        ) : (
          <p className="text-sm text-[#6b7280]">
            Багш: <span className="font-medium text-[#374151]">{question.teacherName ?? "Тодорхойгүй"}</span>
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-[#f1f3f5] pt-4 sm:flex-row sm:items-center sm:justify-end">
        {isGlobal ? (
          <>
            <button
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dbe4f0] bg-white px-3 text-sm font-medium text-[#4b5563] transition hover:border-[#c7d2fe] hover:text-[#111827] active:translate-y-px"
              onClick={onCopyToSchool}
              type="button"
            >
              <CopyPlus className="mr-2 h-4 w-4" />
              Сургуулийн санд хуулах
            </button>
          </>
        ) : (
          <>
            <button
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#eadfce] bg-white px-3 text-sm font-medium text-[#7c5a36] transition hover:border-[#d6c2a4] hover:text-[#5b3d1e] active:translate-y-px"
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
            <button
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#a16207] px-3 text-sm font-semibold text-white opacity-100 transition hover:bg-[#8b4f08] active:translate-y-px md:opacity-80 md:group-hover:opacity-100"
              onClick={onAddToExam}
              type="button"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Шалгалтанд нэмэх
            </button>
          </>
        )}
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
