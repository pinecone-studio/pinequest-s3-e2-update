"use client";

import { ChevronDown, Download } from "lucide-react";
import type { Student } from "@/app/lib/types";
import type { PastExamRow, PastExamStudentScore } from "@/app/lib/class-past-exams-mock";
import { downloadSingleStudentPastExamXls, shortStudentName } from "./helpers";

export function StudentExamHistory({
  classNameLabel,
  student,
  examRows,
}: {
  classNameLabel: string;
  student: Student;
  examRows: Array<{ exam: PastExamRow; score: PastExamStudentScore }>;
}) {
  return (
    <section className="border-t-2 border-[#4f9dff]/35 bg-gradient-to-b from-[#f4f9ff] to-[#fafdff]">
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-[#e2e8f0] pb-3">
          <p className="text-[0.8125rem] font-semibold text-[#334261]">{shortStudentName(student)}<span className="ml-2 font-normal text-[#64748b]">· {student.studentNumber} · {classNameLabel}</span></p>
          <p className="text-[0.8125rem] text-[#64748b]">Өмнөх шалгалт: <span className="font-bold tabular-nums text-[#0f172a]">{examRows.length}</span></p>
        </div>

        {examRows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#cbd5e1] bg-white/80 px-4 py-6 text-center text-[0.875rem] text-[#64748b]">Энэ сурагчийн өмнөх шалгалтын дүн алга байна.</p>
        ) : (
          <div className="mt-1 space-y-3">
            {examRows.map(({ exam, score }) => (
              <details key={exam.id} className="group rounded-2xl border border-[#e2e8f0] bg-white shadow-sm open:shadow-md">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3.5 transition hover:bg-[#f8fafc] sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
                  <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <span className="whitespace-nowrap text-[0.8125rem] font-semibold tabular-nums text-[#475569]">{exam.date}</span>
                    <span className="min-w-0 text-[0.9375rem] font-semibold leading-snug text-[#0f172a]">{exam.subject} — {exam.examTitle}</span>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-bold ${score.passed ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>{score.passed ? "Тэнцсэн" : "Тэнцээгүй"}</span>
                    <span className="text-[0.9375rem] font-bold tabular-nums text-[#0f172a]">{score.score}<span className="font-normal text-[#94a3b8]"> / {exam.maxScore}</span></span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#94a3b8] transition group-open:rotate-180" />
                  </div>
                </summary>
                <div className="border-t border-[#e8ecf2] px-4 py-4 sm:px-5 sm:py-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[0.8125rem] font-semibold text-[#64748b]">Асуулт бүрээр</p>
                    <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-[#c8d6ea] bg-white px-3 py-2 text-[0.8125rem] font-semibold text-[#4f9dff] shadow-sm transition hover:border-[#4f9dff] hover:bg-[#f1f6ff]" onClick={() => downloadSingleStudentPastExamXls(classNameLabel, exam, score)}><Download className="h-4 w-4 shrink-0" />Excel</button>
                  </div>
                  {score.attempts?.length ? (
                    <ul className="space-y-3">{score.attempts.map((a) => {const full = a.pointsEarned >= a.pointsMax; const none = a.pointsEarned <= 0; const barColor = full ? "border-emerald-500 bg-emerald-50/80" : none ? "border-rose-400 bg-rose-50/50" : "border-amber-400 bg-amber-50/40"; return (<li key={a.order} className={`rounded-xl border px-3 py-3 sm:px-4 sm:py-3.5 ${barColor}`}><p className="text-[0.875rem] font-semibold leading-relaxed text-[#0f172a]"><span className="mr-1.5 font-extrabold text-[#4f9dff]">{a.order}.</span>{a.question}</p><p className="mt-2 text-[0.8125rem] text-[#4a5875]"><span className="font-semibold text-[#64748b]">Хариулт: </span>{a.studentAnswer}</p><p className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[0.75rem] font-bold tabular-nums text-white ${full ? "bg-emerald-600" : none ? "bg-rose-600" : "bg-amber-600"}`}>{a.pointsEarned} / {a.pointsMax}</p></li>);})}</ul>
                  ) : (
                    <p className="text-[0.875rem] text-[#64748b]">Асуулт бүрийн дэлгэрэнгүй алга.</p>
                  )}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
