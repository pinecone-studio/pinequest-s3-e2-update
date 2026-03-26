"use client";
/* eslint-disable @next/next/no-img-element */

import { Eye } from "lucide-react";
import type { Question } from "../_lib/types";
import { formatDate } from "../_lib/utils";
import {
  DifficultyBadge,
  GradingTypeBadge,
  QuestionStatusBadge,
  QuestionTypeBadge,
} from "./question-badges";

export function QuestionPreviewPanel({ question }: { question: Question | null }) {
  if (!question) {
    return (
      <aside className="rounded-[24px] border border-[#d8e2f0] bg-white p-5 shadow-sm">
        <p className="text-sm text-[#6d7f9c]">Сурагчид хэрхэн харагдахыг урьдчилан үзэхийн тулд асуулт сонгоно уу.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-[24px] border border-[#d8e2f0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7c8ba4]">
        <Eye className="h-4 w-4" />
        Асуултын дэлгэрэнгүй
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <QuestionStatusBadge status={question.status} />
        <QuestionTypeBadge type={question.questionType} />
        <DifficultyBadge difficulty={question.difficulty} />
        <GradingTypeBadge gradingType={question.gradingType} />
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold text-[#183153]">{question.title}</h3>
        <p className="mt-2 text-sm leading-7 text-[#3b4d69]">{question.content.prompt}</p>
      </div>

      {question.imageUrl ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#e2ebf7]">
          <img alt={question.title} className="h-48 w-full object-cover" src={question.imageUrl} />
        </div>
      ) : null}

      {question.options.length > 0 ? (
        <div className="mt-4 space-y-2">
          {question.options.map((option) => (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                option.isCorrect
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-[#dce5f2] bg-[#f8fbff] text-[#435770]"
              }`}
              key={option.id}
            >
              {option.text}
            </div>
          ))}
        </div>
      ) : null}

      {question.formulaRaw ? (
        <div className="mt-4 rounded-2xl border border-[#dce5f2] bg-[#f8fbff] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#70809b]">Томьёоны харагдац</p>
          <p className="mt-2 font-mono text-sm text-[#183153]">{question.formulaPreview}</p>
        </div>
      ) : null}

      {question.fileUploadConfig.instructions ? (
        <div className="mt-4 rounded-2xl border border-[#dce5f2] bg-[#f8fbff] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#70809b]">Хавсаргах заавар</p>
          <p className="mt-2 text-sm text-[#435770]">{question.fileUploadConfig.instructions}</p>
          <p className="mt-2 text-xs text-[#70809b]">
            Зөвшөөрөх төрөл: {question.fileUploadConfig.acceptedFileTypes.join(", ")}
          </p>
        </div>
      ) : null}

      {question.rubric ? (
        <div className="mt-4 rounded-2xl border border-[#f1e3b5] bg-[#fff9e8] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92743a]">Рубрикийн тэмдэглэл</p>
          <p className="mt-2 text-sm leading-6 text-[#6d5622]">{question.rubric}</p>
        </div>
      ) : null}

      <dl className="mt-5 grid gap-3 rounded-2xl bg-[#f8fbff] p-4 text-sm text-[#5f7394]">
        <div className="flex items-center justify-between gap-3">
          <dt>Хичээл</dt>
          <dd className="font-semibold text-[#183153]">{question.subject}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Оноо</dt>
          <dd className="font-semibold text-[#183153]">{question.points}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Ашигласан тоо</dt>
          <dd className="font-semibold text-[#183153]">{question.usageCount}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Шинэчилсэн</dt>
          <dd className="font-semibold text-[#183153]">{formatDate(question.updatedAt)}</dd>
        </div>
      </dl>
    </aside>
  );
}
