"use client";

import { BookOpen } from "lucide-react";
import type { PastExamRow } from "@/app/lib/class-past-exams-types";

export function TeacherClassPastExamMostFailedInsight({
  row,
}: {
  row: PastExamRow;
}) {
  const insight = row.mostFailedQuestion;
  if (!insight) {
    return (
      <section className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f1f5f9] text-[#122459]">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0 text-[0.9375rem] leading-relaxed text-[#122459] sm:text-base">
            <p className="font-semibold text-[#122459]">Даваагүй асуулт олдсонгүй</p>
            <p className="mt-1.5">
              Энэ шалгалтын бүх асуултаар сурагчид бүрэн оноо авсан, эсвэл статистикийн дата байхгүй байна.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const failPct = Math.round((insight.failCount / Math.max(1, insight.totalStudents)) * 100);

  return (
    <section className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 p-5 shadow-[0_4px_24px_rgba(180,83,9,0.08)] sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shadow-sm ring-1 ring-amber-200/80">
            <BookOpen className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-amber-900/90">
              Хамгийн олон сурагч алдсан асуулт
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[0.8125rem] font-semibold tabular-nums text-amber-950 shadow-sm ring-1 ring-amber-100">
                Асуулт №{insight.order}
              </span>
              <span className="inline-flex items-center rounded-full bg-amber-900/90 px-3 py-1 text-[0.8125rem] font-semibold text-white shadow-sm">
                {insight.failCount} / {insight.totalStudents} сурагч · {failPct}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm sm:px-6 sm:py-5">
          <p className="text-[0.8125rem] font-semibold uppercase tracking-wide text-[#122459]">
            Асуултын өгүүлбэр
          </p>
          <p className="mt-3 text-[0.9375rem] font-medium leading-[1.65] text-[#122459] sm:text-base sm:leading-[1.7]">
            {insight.question}
          </p>
        </div>
      </div>
    </section>
  );
}
