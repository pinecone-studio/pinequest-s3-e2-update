"use client";

import { cn } from "@/lib/utils";
import type { QuestionDifficulty, QuestionGradingType, QuestionStatus, QuestionType } from "../_lib/types";
import {
  DIFFICULTY_LABELS,
  GRADING_TYPE_LABELS,
  QUESTION_TYPE_LABELS,
  STATUS_LABELS,
} from "../_lib/utils";

export function QuestionStatusBadge({ status }: { status: QuestionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "published"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700",
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function QuestionTypeBadge({ type }: { type: QuestionType }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      {QUESTION_TYPE_LABELS[type]}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: QuestionDifficulty }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        difficulty === "easy" && "bg-sky-100 text-sky-700",
        difficulty === "medium" && "bg-orange-100 text-orange-700",
        difficulty === "hard" && "bg-rose-100 text-rose-700",
      )}
    >
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

export function GradingTypeBadge({ gradingType }: { gradingType: QuestionGradingType }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#ecf2ff] px-2.5 py-1 text-xs font-semibold text-[#355a9a]">
      {GRADING_TYPE_LABELS[gradingType]}
    </span>
  );
}
