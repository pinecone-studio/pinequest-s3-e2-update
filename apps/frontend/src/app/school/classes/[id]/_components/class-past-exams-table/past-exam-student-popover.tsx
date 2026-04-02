"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import type { PastExamRow, PastExamStudentScore } from "@/app/lib/class-past-exams-types";

export function PastExamStudentPopover({
  classLabel,
  exam,
  student,
  onClose,
}: {
  classLabel: string;
  exam: PastExamRow;
  student: PastExamStudentScore;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <button type="button" className="fixed inset-0 z-[90] cursor-default bg-[#1f2a44]/25" aria-label="Дэлгэц хаах" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[100] w-[min(calc(100vw-20px),42rem)] max-h-[min(92vh,900px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[#d9dee8] bg-white shadow-[0_25px_80px_-12px_rgba(15,23,42,0.25)] outline-none" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-[#e8ecf2] bg-gradient-to-r from-[#f8fafc] to-white px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="text-xl font-extrabold tracking-tight text-[#0f172a] sm:text-2xl">{student.lastName} {student.firstName}</p>
            <p className="mt-1.5 truncate text-[0.9375rem] text-[#64748b]">{classLabel}</p>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 rounded-xl p-2 text-[#64748b] transition hover:bg-[#e8ecf2] hover:text-[#1f2a44]" aria-label="Хаах">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="max-h-[min(82vh,820px)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-[#4f9dff]">Шалгалтын статистик</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatCard label="Огноо" value={exam.date} />
            <StatCard label="Хичээл" value={exam.subject} />
            <StatCard label="Шалгалт" value={exam.examTitle} wide />
            <StatCard label="Оноо" value={<><span className="text-[1.125rem] font-bold tabular-nums">{student.score}</span><span className="font-normal text-[#94a3b8]"> / {exam.maxScore}</span></>} />
            <StatCard label="Тэнцсэн" value={student.passed ? "Тийм" : "Үгүй"} valueClass={student.passed ? "text-[#15803d]" : "text-[#b91c1c]"} />
          </dl>
          {student.attempts?.length ? (
            <div className="mt-8 border-t border-[#e8ecf2] pt-6">
              <p className="text-base font-extrabold text-[#0f172a]">Асуулт бүрээр</p>
              <ul className="mt-4 space-y-4">
                {student.attempts.map((a) => {
                  const full = a.pointsEarned >= a.pointsMax;
                  const none = a.pointsEarned <= 0;
                  const bar = full ? "border-emerald-500 bg-emerald-50/80" : none ? "border-rose-400 bg-rose-50/50" : "border-amber-400 bg-amber-50/40";
                  return (
                    <li key={a.order} className={`rounded-2xl border border-[#e4eaf5] ${bar} px-4 py-4 shadow-sm sm:px-5`}>
                      <p className="text-[0.9375rem] font-semibold leading-[1.65] text-[#0f172a]"><span className="mr-2 font-extrabold tabular-nums text-[#4f9dff]">{a.order}.</span>{a.question}</p>
                      <p className="mt-3 text-[0.875rem] text-[#4a5875]"><span className="font-semibold text-[#64748b]">Хариулт: </span><span className="text-[#1e293b]">{a.studentAnswer}</span></p>
                      <p className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-[0.8125rem] font-bold tabular-nums ${full ? "bg-emerald-600 text-white" : none ? "bg-rose-600 text-white" : "bg-amber-600 text-white"}`}>Оноо: {a.pointsEarned} / {a.pointsMax}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  wide,
  valueClass,
}: {
  label: string;
  value: ReactNode;
  wide?: boolean;
  valueClass?: string;
}) {
  return (
    <div className={`rounded-xl border border-[#e8ecf2] bg-[#fafbfd] px-4 py-3 ${wide ? "sm:col-span-2" : ""}`}>
      <dt className="text-[0.75rem] font-semibold uppercase tracking-wide text-[#94a3b8]">{label}</dt>
      <dd className={`mt-1 text-[0.9375rem] font-semibold text-[#0f172a] ${valueClass ?? ""}`}>{value}</dd>
    </div>
  );
}
