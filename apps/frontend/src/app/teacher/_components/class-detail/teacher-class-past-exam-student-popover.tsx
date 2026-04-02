"use client";

import { Download, X } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { PastExamRow, PastExamStudentScore } from "@/app/lib/class-past-exams-types";
import { downloadSingleStudentPastExamXls, formatExamDate } from "./teacher-class-detail-utils";

type TeacherClassPastExamStudentPopoverProps = {
  classLabel: string;
  exam: PastExamRow;
  onClose: () => void;
  student: PastExamStudentScore;
};

export function TeacherClassPastExamStudentPopover({
  classLabel,
  exam,
  onClose,
  student,
}: TeacherClassPastExamStudentPopoverProps) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const openManualGrading = () => {
    const storageKey = `manual-grading-bootstrap:${exam.blueprintId}:${student.studentId}`;
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        classLabel,
        exam,
        student,
      }),
    );

    const params = new URLSearchParams({
      studentId: student.studentId,
      studentName: `${student.lastName} ${student.firstName}`,
      studentNumber: student.studentNumber,
      classLabel,
      examTitle: exam.examTitle,
      subject: exam.subject,
      maxScore: String(exam.maxScore),
      currentScore: String(student.score),
    });

    router.push(
      `/teacher/exam-grading/${encodeURIComponent(exam.blueprintId)}?${params.toString()}`,
    );
  };

  return (
    <>
      <button aria-label="Дэлгэц хаах" className="fixed inset-0 z-[90] cursor-default bg-[#1f2a44]/25" onClick={onClose} type="button" />
      <div className="fixed left-1/2 top-1/2 z-[100] max-h-[min(92vh,900px)] w-[min(calc(100vw-20px),42rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[#d9dee8] bg-white shadow-[0_25px_80px_-12px_rgba(15,23,42,0.25)] outline-none">
        <div className="flex items-start justify-between gap-3 border-b border-[#e8ecf2] bg-gradient-to-r from-[#f8fafc] to-white px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="text-xl font-extrabold tracking-tight text-[#122459] sm:text-2xl">{student.lastName} {student.firstName}</p>
            <p className="mt-1.5 truncate text-[0.9375rem] text-[#122459]">{classLabel}</p>
          </div>
          <button aria-label="Хаах" className="shrink-0 rounded-xl p-2 text-[#122459] transition hover:bg-[#e8ecf2]" onClick={onClose} type="button">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="max-h-[min(82vh,820px)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-[#122459]">Шалгалтын статистик</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Огноо", value: formatExamDate(exam.date) },
              { label: "Хичээл", value: exam.subject },
              { label: "Шалгалт", value: exam.examTitle, className: "sm:col-span-2" },
              { label: "Оноо", value: <><span className="text-[1.125rem] font-bold tabular-nums">{student.score}</span><span className="font-normal"> / {exam.maxScore}</span></> },
              { label: "Тэнцсэн", value: student.passed ? "Тийм" : "Үгүй", valueClass: "font-semibold text-[#122459]" },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border border-[#e8ecf2] bg-[#fafbfd] px-4 py-3 ${"className" in item ? item.className ?? "" : ""}`}>
                <dt className="text-[0.75rem] font-semibold uppercase tracking-wide text-[#122459]">{item.label}</dt>
                <dd className={`mt-1 text-[0.9375rem] font-semibold leading-snug text-[#122459] ${"valueClass" in item ? item.valueClass ?? "" : ""}`}>{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <button
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#3a9df2] bg-[#ecf6ff] px-3 py-2 text-[0.8125rem] font-semibold text-[#175ea8] shadow-sm transition hover:border-[#1f89e5] hover:bg-[#e1f0ff]"
              onClick={openManualGrading}
              type="button"
            >
              Гараар засах
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-[#c8d6ea] bg-white px-3 py-2 text-[0.8125rem] font-semibold text-[#122459] shadow-sm transition hover:border-[#4f9dff] hover:bg-[#f1f6ff]" onClick={() => downloadSingleStudentPastExamXls(classLabel, exam, student)} type="button">
              <Download className="h-4 w-4 shrink-0" />
              Excel
            </button>
          </div>

          {student.attempts?.length ? (
            <div className="mt-8 border-t border-[#e8ecf2] pt-6">
              <p className="text-base font-extrabold text-[#122459]">Асуулт бүрээр</p>
              <ul className="mt-4 space-y-4">
                {student.attempts.map((attempt) => {
                  const full = attempt.pointsEarned >= attempt.pointsMax;
                  const none = attempt.pointsEarned <= 0;
                  const cardClass = full ? "border-emerald-500 bg-emerald-50/80" : none ? "border-rose-400 bg-rose-50/50" : "border-amber-400 bg-amber-50/40";
                  const badgeClass = full ? "bg-emerald-600" : none ? "bg-rose-600" : "bg-amber-600";
                  return (
                    <li key={attempt.order} className={`rounded-2xl border px-4 py-4 shadow-sm sm:px-5 ${cardClass}`}>
                      <p className="text-[0.9375rem] font-semibold leading-[1.65] text-[#122459] sm:text-base">
                        <span className="mr-2 font-extrabold tabular-nums">{attempt.order}.</span>{attempt.question}
                      </p>
                      <p className="mt-3 text-[0.875rem] leading-relaxed text-[#122459]"><span className="font-semibold">Хариулт: </span>{attempt.studentAnswer}</p>
                      <p className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-[0.8125rem] font-bold tabular-nums text-white ${badgeClass}`}>Оноо: {attempt.pointsEarned} / {attempt.pointsMax}</p>
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
