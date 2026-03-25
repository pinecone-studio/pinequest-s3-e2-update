import { CalendarDays, ClipboardList, Flame, X } from "lucide-react";
import type { Question } from "./types";
import {
  detectQuestionQuality,
  difficultyLabel,
  statusLabel,
  subjectLabel,
  typeLabel,
} from "./utils";

type Props = {
  question: Question | null;
  open: boolean;
  onClose: () => void;
};

export function QuestionPreviewDrawer({ question, open, onClose }: Props) {
  if (!open || !question) return null;

  const quality = detectQuestionQuality(question);

  const qualityTone =
    quality.tone === "danger"
      ? "border-[#FF6B6B]/30 bg-[#FF6B6B]/10 text-[#b83f3f]"
      : quality.tone === "warning"
        ? "border-[#FFD65A]/60 bg-[#FFD65A]/20 text-[#8f6b00]"
        : "border-[#34C759]/30 bg-[#34C759]/10 text-[#1a8c3f]";

  return (
    <div className="fixed inset-0 z-40">
      <button
        aria-label="Хаах"
        className="absolute inset-0 bg-[#1F2A44]/30"
        onClick={onClose}
        type="button"
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-[#d6e7ff] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-[#7d8fae]">
              Асуултын дэлгэрэнгүй
            </p>
            <h3 className="mt-1 text-3xl font-bold text-[#1F2A44]">{question.title}</h3>
          </div>
          <button
            className="rounded-lg border border-[#d6e7ff] p-2 text-[#1F2A44]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-[#4F9DFF]/12 px-2 py-1 text-[#2568bc]">
            {subjectLabel[question.subject]}
          </span>
          <span className="rounded-full bg-indigo-100 px-2 py-1 text-indigo-700">
            {typeLabel[question.type]}
          </span>
          <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-700">
            {difficultyLabel[question.difficulty]}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
            {question.skillTag}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
            {statusLabel[question.status]}
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-[#d6e7ff] bg-[#F6FAFF] p-4">
          <p className="text-sm font-semibold text-[#1F2A44]">Бүрэн агуулга</p>
          <p className="mt-2 text-sm leading-7 text-[#425272]">{question.content}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <InfoBlock label="Сэдэв" value={question.topic} />
          <InfoBlock label="Анги" value={question.gradeLevel} />
          <InfoBlock label="Үүсгэсэн багш" value={question.createdBy} />
          <InfoBlock label="Сүүлд ашигласан" value={question.lastUsedAt} />
        </div>

        <div className="mt-4 rounded-xl border border-[#d6e7ff] p-4">
          <p className="text-sm font-semibold text-[#1F2A44]">Ашиглалтын үзүүлэлт</p>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 text-[#5d6e8c]">
                <ClipboardList className="h-4 w-4" />
                Ашигласан тоо
              </span>
              <span className="font-semibold text-[#1F2A44]">{question.usageCount}</span>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-[#5d6e8c]">
                  <Flame className="h-4 w-4" />
                  Зөв хариултын хувь
                </span>
                <span className="font-semibold text-[#1F2A44]">{question.correctRate}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#e3edf9]">
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
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 text-[#5d6e8c]">
                <CalendarDays className="h-4 w-4" />
                Чанарын төлөв
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${qualityTone}`}
              >
                {quality.label}
              </span>
            </div>
          </div>
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${qualityTone}`}>
          <p className="text-sm font-semibold">Санал болгох зөвлөмж</p>
          <p className="mt-1 text-sm leading-6">{quality.recommendation}</p>
        </div>
      </aside>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#d6e7ff] bg-white p-3">
      <p className="text-xs text-[#7382a0]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#1F2A44]">{value}</p>
    </div>
  );
}
