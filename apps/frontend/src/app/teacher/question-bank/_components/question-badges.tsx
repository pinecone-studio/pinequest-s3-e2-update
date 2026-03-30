"use client";

import { cn } from "@/lib/utils";
import type {
  QuestionDifficulty,
  QuestionGradingType,
  QuestionStatus,
  QuestionType,
} from "../types";
import {
  DIFFICULTY_LABELS,
  GRADING_TYPE_LABELS,
  QUESTION_TYPE_LABELS,
  STATUS_LABELS,
} from "../utils";

type BadgeProps =
  | { type: "status"; value: QuestionStatus }
  | { type: "questionType"; value: QuestionType }
  | { type: "difficulty"; value: QuestionDifficulty }
  | { type: "grading"; value: QuestionGradingType };

export function QuestionBadge(props: BadgeProps) {
  let label = "";
  let className = "";

  if (props.type === "status") {
    label = STATUS_LABELS[props.value];
    className =
      props.value === "published"
        ? "bg-[#deeeff] text-[#2f66b9]"
        : "bg-amber-100 text-amber-700";
  }

  if (props.type === "questionType") {
    label = QUESTION_TYPE_LABELS[props.value];
    className = "bg-slate-100 text-slate-700";
  }

  if (props.type === "difficulty") {
    label = DIFFICULTY_LABELS[props.value];
    className = cn(
      props.value === "easy" && "bg-sky-100 text-sky-700",
      props.value === "medium" && "bg-orange-100 text-orange-700",
      props.value === "hard" && "bg-rose-100 text-rose-700",
    );
  }

  if (props.type === "grading") {
    label = GRADING_TYPE_LABELS[props.value];
    className = "bg-[#ecf2ff] text-[#355a9a]";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        className,
      )}
    >
      {label}
    </span>
  );
}

export function QuestionStatusBadge({ status }: { status: QuestionStatus }) {
  return <QuestionBadge type="status" value={status} />;
}

export function QuestionTypeBadge({ type }: { type: QuestionType }) {
  return <QuestionBadge type="questionType" value={type} />;
}

export function DifficultyBadge({ difficulty }: { difficulty: QuestionDifficulty }) {
  return <QuestionBadge type="difficulty" value={difficulty} />;
}

export function GradingTypeBadge({
  gradingType,
}: {
  gradingType: QuestionGradingType;
}) {
  return <QuestionBadge type="grading" value={gradingType} />;
}
