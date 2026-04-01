"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TeacherClassOption } from "../../_lib/teacher-class-options";
import { formatSavedDate } from "../_lib/utils";
import type { SavedExamRecord } from "../_lib/types";
import { TrashIcon } from "@/app/_icons/trashIcon";


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
  const availableClasses = teacherClasses.filter(
    (klass) => klass.grade === savedExam.grade,
  );

  return (
    <article
      className={`rounded-3xl border p-5 transition ${
        isActive
          ? "border-[#7dc8ff] bg-white shadow-[0_14px_30px_rgba(79,157,255,0.08)]"
          : "border-[#d8e2f0] bg-white"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <SavedExamMeta savedExam={savedExam} />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="min-w-52">
            <Select
              disabled={
                savedExam.approvalStatus === "pending" ||
                savedExam.approvalStatus === "needs_fix"
              }
              onValueChange={onSelectClass}
              value={selectedClassId ?? undefined}
            >
              <SelectTrigger className="h-11 w-full rounded-2xl border border-[#a7adb8] bg-white px-4 text-sm font-medium text-[#444] focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10 focus-visible:border-[#4f9dff] focus-visible:ring-4 focus-visible:ring-[#4f9dff]/10">
                <SelectValue placeholder="Анги сонгож илгээх" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.length > 0 ? (
                  availableClasses.map((klass) => (
                    <ClassOption key={klass.id} klass={klass} />
                  ))
                ) : (
                  <SelectItem disabled value="empty">
                    Тохирох анги алга
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <ActionButton
            disabled={
              savedExam.approvalStatus === "pending" ||
              savedExam.approvalStatus === "needs_fix"
            }
            kind="secondary"
            label={
              savedExam.approvalStatus === "pending"
                ? "Зөвшөөрөл хүлээж байна"
                : savedExam.approvalStatus === "needs_fix"
                  ? "Засвар шаардлагатай"
                : "Нээх"
            }
            onClick={onOpen}
          />
          <ActionButton
            label="Засварлах"
            onClick={onOpen}
          />
          <ActionButton
            icon={<TrashIcon />}
            kind="danger"
            label="Устгах"
            onClick={onDelete}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SavedExamStats savedExam={savedExam} />
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
            onClick={onSend}
          />
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
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${savedExam.status === "published" ? "bg-[#deeeff] text-[#2f66b9]" : "bg-amber-100 text-amber-700"}`}
        >
          {savedExam.status === "published" ? "Нийтэлсэн" : "Ноорог"}
        </span>
        {savedExam.approvalStatus === "pending" ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Сургуулийн зөвшөөрөл хүлээж байна
          </span>
        ) : savedExam.approvalStatus === "needs_fix" ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Сургуулиас засвар хүссэн
          </span>
        ) : savedExam.requiresSchoolApproval ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Сургуулийн зөвшөөрөлтэй
          </span>
        ) : null}
        <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#3b5a8f]">
          {savedExam.grade}
        </span>
        <span className="rounded-full bg-[#f8f1ff] px-3 py-1 text-xs font-semibold text-[#7047a9]">
          {savedExam.subject}
        </span>
        <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold text-[#2f66b9]">
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

function ClassOption({ klass }: { klass: TeacherClassOption }) {
  return (
    <SelectItem value={klass.id}>
      {klass.studentCount > 0
        ? `${klass.name} · ${klass.studentCount} сурагч`
        : klass.name}
    </SelectItem>
  );
}

function ActionButton({
  disabled = false,
  icon,
  kind = "secondary",
  label,
  onClick,
}: {
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
      className={`inline-flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-medium transition disabled:cursor-not-allowed ${styles}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon ? icon : null}
      {label}
    </button>
  );
}
