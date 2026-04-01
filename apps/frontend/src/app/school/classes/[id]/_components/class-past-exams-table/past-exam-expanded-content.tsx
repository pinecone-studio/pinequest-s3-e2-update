"use client";

import { Download } from "lucide-react";
import type { PastExamRow } from "@/app/lib/class-past-exams-types";
import {
  downloadSingleStudentPastExamXls,
  sortPastExamStudents,
} from "./helpers";
import { PastExamGradeChart } from "./past-exam-grade-chart";
import { PastExamMostFailedInsight } from "./past-exam-most-failed-insight";

export function PastExamExpandedContent({
  classNameLabel,
  row,
  onStudentToggle,
  activeStudentId,
}: {
  classNameLabel: string;
  row: PastExamRow;
  onStudentToggle: (studentId: string) => void;
  activeStudentId: string | null;
}) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-gradient-to-b from-white via-[#fafbfd] to-[#f4f7fc] p-4 shadow-[0_4px_32px_rgba(15,23,42,0.06)] sm:p-6 md:p-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 lg:items-stretch">
        <PastExamGradeChart row={row} />
        <PastExamMostFailedInsight row={row} />
      </div>

      <div className="mt-8 border-t border-[#e2e8f0] pt-8">
        <h4 className="text-lg font-extrabold tracking-tight text-[#0f172a] sm:text-xl">Сурагч бүрийн оноо</h4>
        {row.studentScores.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-[#cbd5e1] bg-white/80 px-4 py-8 text-center text-[0.9375rem] text-[#64748b]">
            Энэ ангид сурагч алга.
          </p>
        ) : (
          <div className="mt-4 max-h-[min(28rem,55vh)] overflow-auto rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
            <table className="w-full min-w-[320px] text-left text-[0.9375rem]">
              <thead className="sticky top-0 z-10 border-b border-[#e2e8f0] bg-[#f8fafc]">
                <tr>
                  <th className="px-4 py-3.5 font-semibold text-[#475569] sm:px-5">Овог, нэр</th>
                  <th className="px-4 py-3.5 text-right font-semibold text-[#475569] sm:px-5">Оноо</th>
                  <th className="w-[1%] whitespace-nowrap px-4 py-3.5 text-right font-semibold text-[#475569] sm:px-5">Татах</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {sortPastExamStudents(row.studentScores).map((s) => (
                  <tr
                    key={s.studentId}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter" && e.key !== " ") return;
                      e.preventDefault();
                      e.stopPropagation();
                      onStudentToggle(s.studentId);
                    }}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("button")) return;
                      e.stopPropagation();
                      onStudentToggle(s.studentId);
                    }}
                    className={`cursor-pointer transition-colors hover:bg-[#f0f7ff] ${activeStudentId === s.studentId ? "bg-[#e8f2ff]" : ""}`}
                  >
                    <td className="px-4 py-3.5 font-medium text-[#334261] sm:px-5 sm:py-4">{s.lastName} {s.firstName}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right sm:px-5 sm:py-4"><span className="text-[1.0625rem] font-bold tabular-nums text-[#0f172a]">{s.score}</span><span className="ml-1 text-[0.875rem] font-normal tabular-nums text-[#94a3b8]">/ {row.maxScore}</span></td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right sm:px-5 sm:py-4">
                      <button type="button" onClick={(e) => { e.stopPropagation(); downloadSingleStudentPastExamXls(classNameLabel, row, s); }} className="inline-flex items-center justify-center rounded-xl border border-[#c8d6ea] bg-white p-2.5 text-[#4f9dff] shadow-sm transition hover:border-[#4f9dff] hover:bg-[#f1f6ff]">
                        <Download className="h-4 w-4 shrink-0" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
