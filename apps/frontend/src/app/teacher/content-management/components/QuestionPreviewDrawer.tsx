import { AlertTriangle, Calendar, ClipboardList, Flame, X } from "lucide-react";
import type { Question } from "../types";
import {
  difficultyLabel,
  questionTypeLabel,
  skillLabel,
  statusLabel,
  subjectLabel,
} from "../utils/labels";
import { recommendationFor } from "../utils/questionBank";

type QuestionPreviewDrawerProps = {
  question: Question | null;
  open: boolean;
  onClose: () => void;
  isWeak: boolean;
};

function badgeTone(status: Question["status"]) {
  if (status === "Active") return "bg-emerald-100 text-emerald-700";
  if (status === "Draft") return "bg-amber-100 text-amber-700";
  return "bg-slate-200 text-slate-600";
}

export function QuestionPreviewDrawer({
  question,
  open,
  onClose,
  isWeak,
}: QuestionPreviewDrawerProps) {
  if (!open || !question) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-slate-900/25"
        onClick={onClose}
        type="button"
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Асуултын дэлгэрэнгүй</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">{question.title}</h3>
          </div>
          <button
            className="rounded-md border border-slate-200 p-2 text-slate-600"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">{subjectLabel[question.subject]}</span>
          <span className="rounded-full bg-indigo-50 px-2 py-1 text-indigo-700">{questionTypeLabel[question.type]}</span>
          <span className="rounded-full bg-purple-50 px-2 py-1 text-purple-700">{difficultyLabel[question.difficulty]}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{skillLabel[question.skillTag]}</span>
          <span className={`rounded-full px-2 py-1 ${badgeTone(question.status)}`}>
            {statusLabel[question.status]}
          </span>
          {isWeak && (
            <span className="rounded-full bg-amber-100 px-2 py-1 font-semibold text-amber-700">
              Сайжруулах
            </span>
          )}
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Бүрэн асуулт</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{question.content}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Сэдэв</p>
            <p className="font-semibold text-slate-800">{question.topic}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Анги</p>
            <p className="font-semibold text-slate-800">{question.gradeLevel}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Бүтээсэн багш</p>
            <p className="font-semibold text-slate-800">{question.createdBy}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Сүүлд ашигласан</p>
            <p className="font-semibold text-slate-800">{question.lastUsedAt}</p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-800">Ашиглалтын үзүүлэлт</p>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-slate-600">
                <ClipboardList className="h-4 w-4" /> Ашигласан тоо
              </span>
              <span className="font-semibold text-slate-900">{question.usageCount}</span>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <Flame className="h-4 w-4" /> Зөв хариултын хувь
                </span>
                <span className="font-semibold text-slate-900">{question.correctRate}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className={`h-2 rounded-full ${
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
            <div className="flex items-center justify-between text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Гүйцэтгэлийн төлөв
              </span>
              <span className={isWeak ? "font-semibold text-amber-600" : "font-semibold text-emerald-600"}>
                {isWeak ? "Анхаарах" : "Тогтвортой"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800">
            <AlertTriangle className="h-4 w-4" /> Зөвлөмж
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-900">{recommendationFor(question)}</p>
        </div>
      </aside>
    </div>
  );
}
