"use client";

import {
  Link2,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import type { TeacherClassOption } from "../../_lib/teacher-class-options";
import { formatSavedDate } from "../_lib/utils";
import type { SavedExamRecord } from "../_lib/types";
import { TrashIcon } from "@/app/_icons/trashIcon";
import { cn } from "@/lib/utils";

export function SavedExamCard({
  savedExam,
  isActive,
  teacherClasses,
  selectedClassId,
  onDelete,
  onOpenMonitoring,
  onOpen,
  onSelectClass,
  onSend,
}: {
  savedExam: SavedExamRecord;
  isActive: boolean;
  teacherClasses: TeacherClassOption[];
  selectedClassId?: string;
  onDelete: () => void;
  onOpenMonitoring: () => void;
  onOpen: () => void;
  onSelectClass: (classId: string) => void;
  onSend: () => void;
}) {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = async () => {
    if (typeof window === "undefined") return;
    const examLink = `${window.location.origin}/student/${savedExam.id}`;
    try {
      await navigator.clipboard.writeText(examLink);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      window.prompt("Шалгалтын линк:", examLink);
    }
  };

  return (
    <article
      className={`rounded-3xl border p-4 transition sm:p-5 ${
        isActive
          ? "border-[#7dc8ff] bg-white shadow-[0_14px_30px_rgba(79,157,255,0.08)]"
          : "border-[#d8e2f0] bg-white"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <SavedExamMeta savedExam={savedExam} />
        </div>

        <div className="flex w-full flex-row justify-end gap-2 sm:w-auto">
          <button
            aria-label="Засварлах"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#a7adb8] bg-white text-[#444] transition hover:bg-[#f8fbff]"
            onClick={onOpen}
            type="button"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            aria-label="Устгах"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ffc6c6] bg-white text-[#ff7e7e] transition hover:bg-[#fff5f5]"
            onClick={onDelete}
            type="button"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <SavedExamStats savedExam={savedExam} />
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <ActionButton
              className="w-full sm:w-auto"
              icon={<Link2 className="h-4 w-4" />}
              kind="secondary"
              label={linkCopied ? "Линк хуулсан" : "Линк"}
              onClick={handleCopyLink}
            />
            <ActionButton
              disabled={
                savedExam.approvalStatus === "pending" ||
                savedExam.approvalStatus === "needs_fix"
              }
              kind="primary"
              label={
                savedExam.approvalStatus === "pending"
                  ? "Зөвшөөрөл хүлээж байна"
                  : savedExam.approvalStatus === "needs_fix"
                    ? "Засвар шаардлагатай"
                    : "Илгээх"
              }
              className="w-full sm:w-auto"
              onClick={onSend}
            />
          </div>
        </div>
        <SavedExamSendState
          onOpenMonitoring={onOpenMonitoring}
          sentClassIds={savedExam.sentClassIds ?? []}
          sentClassLabels={savedExam.sentClassLabels}
          teacherClasses={teacherClasses}
        />
      </div>
    </article>
  );
}

function SavedExamMeta({ savedExam }: { savedExam: SavedExamRecord }) {
  const plainBadgeClass =
    "rounded-[12px] border border-[#d4d4d8] bg-transparent px-3 py-[6px] text-[14px] font-medium leading-[20px] text-[#2d2d2d]";

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className={plainBadgeClass}>
          {savedExam.grade}
        </span>
        <span className={plainBadgeClass}>
          {savedExam.subject}
        </span>
        <span className={plainBadgeClass}>
          {savedExam.topic}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-[#183153]">
        {savedExam.title}
      </h3>
    </>
  );
}

function SavedExamStats({ savedExam }: { savedExam: SavedExamRecord }) {
  return (
    <div className="flex flex-wrap items-center gap-4 font-normal text-[12px] text-[#122459]">
      <span>{savedExam.questionCount} асуулт</span>
      <span>{savedExam.totalPoints} нийт оноо</span>
      <span>{savedExam.durationInMinutes} минут</span>
      <span>{formatSavedDate(savedExam.savedAt)} хадгалсан</span>
    </div>
  );
}

function SavedExamSendState({
  onOpenMonitoring,
  sentClassIds,
  sentClassLabels,
  teacherClasses,
}: {
  onOpenMonitoring: () => void;
  sentClassIds: string[];
  sentClassLabels?: Record<string, string>;
  teacherClasses: TeacherClassOption[];
}) {
  if (sentClassIds.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {sentClassIds.map((classId) => {
        const displayName =
          sentClassLabels?.[classId] ??
          teacherClasses.find((item) => item.id === classId)?.name;
        if (!displayName) return null;

        return (
          <span
            className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold text-[#2f66b9]"
            key={classId}
          >
            Илгээсэн: {displayName}
          </span>
        );
      })}
      <button
        className="rounded-full border border-[#cfe0fb] bg-white px-3 py-1 text-xs font-semibold text-[#1f6feb] transition hover:bg-[#eef6ff]"
        onClick={onOpenMonitoring}
        type="button"
      >
        Хяналт руу орох
      </button>
    </div>
  );
}

function ActionButton({
  className,
  disabled = false,
  icon,
  kind = "secondary",
  label,
  onClick,
}: {
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  kind?: "secondary" | "primary" | "danger";
  label: string;
  onClick: () => void;
}) {
  const styles =
    kind === "primary"
      ? "bg-[#2f9cf4] text-white hover:bg-[#2388da] disabled:bg-[#9fbceb] disabled:text-white"
      : kind === "danger"
        ? "border-[#ffc6c6] bg-white text-[#ff7e7e] hover:bg-[#fff5f5] disabled:border-[#e6eaf1] disabled:bg-[#f7f9fc] disabled:text-[#90a0ba]"
        : "border-[#a7adb8] bg-white text-[#444] hover:bg-[#f8fbff] disabled:border-[#e6eaf1] disabled:bg-[#f7f9fc] disabled:text-[#90a0ba]";
  return (
    <button
      className={cn(
        "inline-flex h-11 min-h-[2.75rem] items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-medium transition disabled:cursor-not-allowed sm:px-4",
        styles,
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon ? icon : null}
      {label}
    </button>
  );
}
