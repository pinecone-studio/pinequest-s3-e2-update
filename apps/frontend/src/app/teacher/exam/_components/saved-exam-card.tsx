"use client";

import {
  BookCopy,
  CheckCircle2,
  Eye,
  SendHorizontal,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { teacherClasses, type TeacherClass } from "../_lib/class-data";
import { formatSavedDate } from "../_lib/utils";
import type { SavedExamRecord } from "../_lib/types";

export function SavedExamCard({
  savedExam,
  isActive,
  selectedClassId,
  onDelete,
  onOpen,
  onSelectClass,
  onSend,
}: {
  savedExam: SavedExamRecord;
  isActive: boolean;
  selectedClassId?: string;
  onDelete: () => void;
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
          ? "border-[#7fb3ff] bg-[#edf5ff] shadow-[0_14px_30px_rgba(79,157,255,0.12)]"
          : "border-[#d8e2f0] bg-[#f9fcff]"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <SavedExamMeta savedExam={savedExam} />
          <SavedExamSendState sentClassIds={savedExam.sentClassIds ?? []} />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="min-w-52">
            <Select
              onValueChange={onSelectClass}
              value={selectedClassId ?? undefined}
            >
              <SelectTrigger className="h-11 w-full rounded-2xl border border-[#d7e2f1] bg-white px-4 text-sm font-semibold text-[#365077]">
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
            icon={<SendHorizontal className="mr-2 h-4 w-4" />}
            kind="primary"
            label="Илгээх"
            onClick={onSend}
          />
          <ActionButton
            icon={<Eye className="mr-2 h-4 w-4" />}
            label="Нээх"
            onClick={onOpen}
          />
          <ActionButton
            icon={<BookCopy className="mr-2 h-4 w-4" />}
            label="Засварлах"
            onClick={onOpen}
          />
          <ActionButton
            icon={<Trash2 className="mr-2 h-4 w-4" />}
            kind="danger"
            label="Устгах"
            onClick={onDelete}
          />
        </div>
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
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#60728f]">
        <span>{savedExam.questionCount} асуулт</span>
        <span>{savedExam.totalPoints} нийт оноо</span>
        <span>{savedExam.durationInMinutes} минут</span>
        <span>{formatSavedDate(savedExam.savedAt)} хадгалсан</span>
      </div>
    </>
  );
}

function SavedExamSendState({ sentClassIds }: { sentClassIds: string[] }) {
  if (sentClassIds.length === 0) return null;
  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-start gap-3 rounded-2xl border border-[#cfe0fb] bg-[#eef6ff] px-4 py-3 text-sm text-[#2f66b9]">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">Шалгалт амжилттай илгээгдлээ.</p>
          <p className="mt-1 text-[#54739f]">
            Сонгосон ангид энэ шалгалтыг илгээсэн байна.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {sentClassIds.map((classId) => {
          const klass = teacherClasses.find((item) => item.id === classId);
          return klass ? (
            <span
              className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold text-[#2f66b9]"
              key={classId}
            >
              Илгээсэн: {klass.name}
            </span>
          ) : null;
        })}
      </div>
    </div>
  );
}

function ClassOption({ klass }: { klass: TeacherClass }) {
  return (
    <SelectItem value={klass.id}>
      {klass.name} · {klass.studentCount} сурагч
    </SelectItem>
  );
}

function ActionButton({
  icon,
  kind = "secondary",
  label,
  onClick,
}: {
  icon: React.ReactNode;
  kind?: "secondary" | "primary" | "danger";
  label: string;
  onClick: () => void;
}) {
  const styles =
    kind === "primary"
      ? "bg-[#1f6feb] text-white hover:bg-[#195fcc]"
      : kind === "danger"
        ? "border-[#f0d0d0] bg-[#fff5f5] text-[#c95050] hover:bg-[#ffeaea]"
        : "border-[#d7e2f1] bg-white text-[#365077] hover:border-[#aac8f8] hover:text-[#1f6feb]";
  return (
    <button
      className={`inline-flex h-11 items-center rounded-2xl border px-4 text-sm font-semibold transition ${styles}`}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}
