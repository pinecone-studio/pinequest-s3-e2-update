"use client";

import { ChevronDown, Download } from "lucide-react";
import type { PastExamRow, PastExamStudentScore } from "@/app/lib/class-past-exams-types";
import type { Student } from "@/app/lib/types";
import {
  downloadSingleStudentPastExamXls,
  formatExamDate,
} from "./teacher-class-detail-utils";

type TeacherClassStudentExamResultsPanelProps = {
  classLabel: string;
  examRows: Array<{ exam: PastExamRow; score: PastExamStudentScore }>;
  placement?: "standalone" | "underRow";
  student: Student;
};

export function TeacherClassStudentExamResultsPanel({
  classLabel,
  examRows,
  placement = "standalone",
  student,
}: TeacherClassStudentExamResultsPanelProps) {
  const underRow = placement === "underRow";

  return (
    <section className={underRow ? "border-t-2 border-[#4f9dff]/35 bg-gradient-to-b from-[#f4f9ff] to-[#fafdff]" : "mt-6 rounded-2xl border border-[#4f9dff]/25 bg-gradient-to-b from-[#f6faff] to-white p-5 shadow-[0_4px_24px_rgba(79,157,255,0.08)] sm:p-6"}>
      <div className={underRow ? "px-4 py-4 sm:px-5 sm:py-5" : ""}>
        <div className={underRow ? "mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-[#e2e8f0] pb-3" : "flex flex-col gap-1 border-b border-[#e2e8f0] pb-4 sm:flex-row sm:items-end sm:justify-between"}>
          <div>
            <h3 className={`${underRow ? "text-[0.8125rem] font-semibold" : "text-lg font-extrabold sm:text-xl"} text-[#122459]`}>
              {student.firstName} {student.lastName}
              <span className={`${underRow ? "ml-2 font-normal" : "hidden"} text-[#122459]`}>· {student.studentNumber} · {classLabel}</span>
            </h3>
            {!underRow ? <p className="mt-1 text-[0.875rem] text-[#122459]">{student.studentNumber} · {classLabel}</p> : null}
          </div>
          <p className="text-[0.8125rem] font-medium text-[#122459]">Өмнөх шалгалт: <span className="font-bold tabular-nums">{examRows.length}</span></p>
        </div>

        {examRows.length === 0 ? (
          <p className={`rounded-xl border border-dashed border-[#cbd5e1] bg-white/80 px-4 text-center text-[0.875rem] text-[#122459] ${underRow ? "mt-3 py-6" : "mt-6 py-8"}`}>
            Энэ сурагчийн ангийн жагсаалтад өмнөх шалгалтын дүн байхгүй байна.
          </p>
        ) : (
          <div className={`${underRow ? "mt-3 space-y-3" : "mt-5 space-y-3"}`}>
            {examRows.map(({ exam, score }) => (
              <details key={exam.id} className={`${underRow ? "rounded-[12px] border border-[#D4D4D4] bg-white px-4 py-3" : "group rounded-2xl border border-[#e2e8f0] bg-white shadow-sm open:shadow-md"}`}>
                <summary className={`${underRow ? "flex flex-wrap items-center justify-between gap-3 list-none" : "flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3.5 transition hover:bg-[#f8fafc] sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden"}`}>
                  <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <span className="whitespace-nowrap text-[0.8125rem] font-semibold tabular-nums text-[#122459]">{formatExamDate(exam.date)}</span>
                    <span className={`${underRow ? "text-[0.875rem]" : "text-[0.9375rem]"} min-w-0 font-semibold leading-snug text-[#122459]`}>{exam.subject} — {exam.examTitle}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-bold ${score.passed ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>{score.passed ? "Тэнцсэн" : "Тэнцээгүй"}</span>
                    <span className={`${underRow ? "text-[0.875rem]" : "text-[0.9375rem]"} font-bold tabular-nums text-[#122459]`}>{score.score}<span className="font-normal"> / {exam.maxScore}</span></span>
                    <ChevronDown className={`shrink-0 text-[#122459] ${underRow ? "h-4 w-4" : "h-5 w-5 transition group-open:rotate-180"}`} />
                  </div>
                </summary>

                {!underRow ? (
                  <div className="border-t border-[#e8ecf2] px-4 py-4 sm:px-5 sm:py-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[0.8125rem] font-semibold text-[#122459]">Асуулт бүрээр</p>
                      <button className="inline-flex items-center gap-1.5 rounded-xl border border-[#c8d6ea] bg-white px-3 py-2 text-[0.8125rem] font-semibold text-[#122459] shadow-sm transition hover:border-[#4f9dff] hover:bg-[#f1f6ff]" onClick={() => downloadSingleStudentPastExamXls(classLabel, exam, score)} type="button">
                        <Download className="h-4 w-4 shrink-0" />Excel
                      </button>
                    </div>
                    {score.attempts?.length ? (
                      <ul className="space-y-3">
                        {score.attempts.map((attempt) => {
                          const full = attempt.pointsEarned >= attempt.pointsMax;
                          const none = attempt.pointsEarned <= 0;
                          const cardClass = full ? "border-emerald-500 bg-emerald-50/80" : none ? "border-rose-400 bg-rose-50/50" : "border-amber-400 bg-amber-50/40";
                          const badgeClass = full ? "bg-emerald-600" : none ? "bg-rose-600" : "bg-amber-600";
                          return (
                            <li key={attempt.order} className={`rounded-xl border px-3 py-3 sm:px-4 sm:py-3.5 ${cardClass}`}>
                              <p className="text-[0.875rem] font-semibold leading-relaxed text-[#122459]"><span className="mr-1.5 font-extrabold">{attempt.order}.</span>{attempt.question}</p>
                              <p className="mt-2 text-[0.8125rem] text-[#122459]"><span className="font-semibold">Хариулт: </span>{attempt.studentAnswer}</p>
                              <p className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[0.75rem] font-bold tabular-nums text-white ${badgeClass}`}>{attempt.pointsEarned} / {attempt.pointsMax}</p>
                            </li>
                          );
                        })}
                      </ul>
                    ) : <p className="text-[0.875rem] text-[#122459]">Асуулт бүрийн дэлгэрэнгүй алга.</p>}
                  </div>
                ) : null}
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
