import { Archive, Eye, PlusCircle, TriangleAlert } from "lucide-react";
import type { Question } from "../types";
import {
  difficultyLabel,
  questionTypeLabel,
  skillLabel,
  statusLabel,
  subjectLabel,
} from "../utils/labels";

type QuestionCardProps = {
  question: Question;
  isWeak: boolean;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onPreview: () => void;
  onEdit: () => void;
  onAddToExam: () => void;
  onArchive: () => void;
};

const difficultyTone: Record<Question["difficulty"], string> = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-blue-100 text-blue-700",
  Hard: "bg-rose-100 text-rose-700",
};

const statusTone: Record<Question["status"], string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
  Archived: "bg-slate-200 text-slate-600",
};

export function QuestionCard({
  question,
  isWeak,
  isSelected,
  onSelect,
  onPreview,
  onEdit,
  onAddToExam,
  onArchive,
}: QuestionCardProps) {
  const archived = question.status === "Archived";

  return (
    <article
      className={`rounded-xl border p-4 shadow-sm transition ${
        isWeak
          ? "border-amber-300 bg-amber-50/40"
          : archived
            ? "border-slate-200 bg-slate-50"
            : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <input
            checked={isSelected}
            className="mt-1 h-4 w-4 rounded border-slate-300"
            onChange={(event) => onSelect(event.target.checked)}
            type="checkbox"
          />
          <div>
            <p className="text-base font-semibold text-slate-900">{question.title}</p>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
              {question.content}
            </p>
          </div>
        </div>

        {isWeak && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
            <TriangleAlert className="h-3.5 w-3.5" /> Сайжруулах
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
          {subjectLabel[question.subject]}
        </span>
        <span className="rounded-full bg-indigo-100 px-2 py-1 text-indigo-700">
          {questionTypeLabel[question.type]}
        </span>
        <span className={`rounded-full px-2 py-1 ${difficultyTone[question.difficulty]}`}>
          {difficultyLabel[question.difficulty]}
        </span>
        <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-700">
          {skillLabel[question.skillTag]}
        </span>
        <span className={`rounded-full px-2 py-1 ${statusTone[question.status]}`}>
          {statusLabel[question.status]}
        </span>
        {question.correctRate > 70 && question.usageCount >= 15 && (
          <span className="rounded-full bg-teal-100 px-2 py-1 font-medium text-teal-700">
            Санал болгож буй
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
        <div className="rounded-md bg-slate-100 p-2">
          <p className="text-xs text-slate-500">Сэдэв</p>
          <p className="font-medium text-slate-700">{question.topic}</p>
        </div>
        <div className="rounded-md bg-slate-100 p-2">
          <p className="text-xs text-slate-500">Анги</p>
          <p className="font-medium text-slate-700">{question.gradeLevel}</p>
        </div>
        <div className="rounded-md bg-slate-100 p-2">
          <p className="text-xs text-slate-500">Ашигласан</p>
          <p className="font-medium text-slate-700">{question.usageCount} удаа</p>
        </div>
        <div className="rounded-md bg-slate-100 p-2">
          <p className="text-xs text-slate-500">Зөв хариулт</p>
          <p className="font-medium text-slate-700">{question.correctRate}%</p>
          <div className="mt-1 h-1.5 rounded-full bg-slate-200">
            <div
              className={`h-1.5 rounded-full ${
                question.correctRate >= 70
                  ? "bg-emerald-500"
                  : question.correctRate >= 50
                    ? "bg-blue-500"
                    : "bg-amber-500"
              }`}
              style={{ width: `${question.correctRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
          onClick={onPreview}
          type="button"
        >
          <Eye className="h-3.5 w-3.5" /> Харах
        </button>
        <button
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
          onClick={onEdit}
          type="button"
        >
          Засах
        </button>
        <button
          className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white"
          onClick={onAddToExam}
          type="button"
        >
          <PlusCircle className="h-3.5 w-3.5" /> Шалгалтад нэмэх
        </button>
        <button
          className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700"
          onClick={onArchive}
          type="button"
        >
          <Archive className="h-3.5 w-3.5" /> Архивлах
        </button>
      </div>
    </article>
  );
}
