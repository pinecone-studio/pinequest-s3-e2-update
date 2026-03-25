import { Archive, Eye, PlusCircle } from "lucide-react";
import type { Question, QuestionQuality } from "./types";
import {
  difficultyLabel,
  statusLabel,
  subjectLabel,
  typeLabel,
} from "./utils";

type Props = {
  question: Question;
  quality: QuestionQuality;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onPreview: () => void;
  onEdit: () => void;
  onAddToExam: () => void;
  onArchive: () => void;
};

const difficultyTone: Record<Question["difficulty"], string> = {
  Easy: "bg-[#34C759]/15 text-[#1a8c3f]",
  Medium: "bg-[#4F9DFF]/15 text-[#266fcb]",
  Hard: "bg-[#FF6B6B]/15 text-[#c94141]",
};

const statusTone: Record<Question["status"], string> = {
  Active: "bg-[#34C759]/15 text-[#1a8c3f]",
  Draft: "bg-[#FFD65A]/35 text-[#8f6b00]",
  Archived: "bg-slate-200 text-slate-600",
};

export function QuestionCard({
  question,
  quality,
  isSelected,
  onSelect,
  onPreview,
  onEdit,
  onAddToExam,
  onArchive,
}: Props) {
  const accent =
    quality.tone === "danger"
      ? "border-l-[#FF6B6B]"
      : quality.tone === "warning"
        ? "border-l-[#FFD65A]"
        : "border-l-[#34C759]";

  const qualityTone =
    quality.tone === "danger"
      ? "bg-[#FF6B6B]/15 text-[#b83f3f]"
      : quality.tone === "warning"
        ? "bg-[#FFD65A]/35 text-[#8f6b00]"
        : "bg-[#34C759]/15 text-[#1a8c3f]";

  return (
    <article
      className={`rounded-2xl border border-[#d6e7ff] border-l-4 bg-white p-4 shadow-sm ${accent} ${
        question.status === "Archived" ? "opacity-80" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <input
            checked={isSelected}
            className="mt-1 h-4 w-4 rounded border-slate-300"
            onChange={(event) => onSelect(event.target.checked)}
            type="checkbox"
          />
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold text-[#1F2A44]">{question.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#5d6e8c]">
              {question.content}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${qualityTone}`}
        >
          {quality.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-[#4F9DFF]/12 px-2 py-1 text-[#2568bc]">
          {subjectLabel[question.subject]}
        </span>
        <span className="rounded-full bg-indigo-100 px-2 py-1 text-indigo-700">
          {typeLabel[question.type]}
        </span>
        <span className={`rounded-full px-2 py-1 ${difficultyTone[question.difficulty]}`}>
          {difficultyLabel[question.difficulty]}
        </span>
        <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-700">
          {question.skillTag}
        </span>
        <span className={`rounded-full px-2 py-1 ${statusTone[question.status]}`}>
          {statusLabel[question.status]}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-4">
        <StatBox label="Сэдэв" value={question.topic} />
        <StatBox label="Анги" value={question.gradeLevel} />
        <StatBox label="Ашигласан" value={`${question.usageCount} удаа`} />
        <div className="rounded-lg bg-[#F6FAFF] p-2">
          <p className="text-xs text-[#7382a0]">Зөв хариулт</p>
          <p className="font-semibold text-[#1F2A44]">{question.correctRate}%</p>
          <div className="mt-1 h-2 rounded-full bg-[#e3edf9]">
            <div
              className={`h-2 rounded-full ${
                question.correctRate >= 70
                  ? "bg-[#34C759]"
                  : question.correctRate >= 50
                    ? "bg-[#4F9DFF]"
                    : "bg-[#FF6B6B]"
              }`}
              style={{ width: `${Math.max(3, question.correctRate)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-[#d6e7ff] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F2A44]"
          onClick={onPreview}
          type="button"
        >
          <Eye className="h-3.5 w-3.5" />
          Харах
        </button>
        <button
          className="rounded-lg border border-[#d6e7ff] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F2A44]"
          onClick={onEdit}
          type="button"
        >
          Засах
        </button>
        <button
          className="inline-flex items-center gap-1 rounded-lg bg-[#4F9DFF] px-3 py-1.5 text-xs font-semibold text-white"
          onClick={onAddToExam}
          type="button"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Шалгалтад нэмэх
        </button>
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-[#FF6B6B]/30 bg-[#FF6B6B]/10 px-3 py-1.5 text-xs font-semibold text-[#c94141]"
          onClick={onArchive}
          type="button"
        >
          <Archive className="h-3.5 w-3.5" />
          Архивлах
        </button>
      </div>
    </article>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#F6FAFF] p-2">
      <p className="text-xs text-[#7382a0]">{label}</p>
      <p className="truncate font-semibold text-[#1F2A44]">{value}</p>
    </div>
  );
}
