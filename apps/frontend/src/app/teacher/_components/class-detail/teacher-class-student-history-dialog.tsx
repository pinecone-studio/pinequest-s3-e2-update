"use client";

import { useEffect } from "react";
import type { PastExamRow, PastExamStudentScore } from "@/app/lib/class-past-exams-mock";
import type { Student } from "@/app/lib/types";
import { formatExamDate } from "./teacher-class-detail-utils";

type TeacherClassStudentHistoryDialogProps = {
  examRows: Array<{ exam: PastExamRow; score: PastExamStudentScore }>;
  onClose: () => void;
  open: boolean;
  student: Student | null;
};

export function TeacherClassStudentHistoryDialog({
  examRows,
  onClose,
  open,
  student,
}: TeacherClassStudentHistoryDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose, open]);

  if (!open || !student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/55 px-4 py-6"
      onClick={onClose}
    >
      <div
        aria-modal="true"
        className="flex w-full max-w-[768px] flex-col overflow-hidden rounded-[28px] border border-[#e5e7eb] bg-white shadow-[0_25px_80px_-12px_rgba(15,23,42,0.32)] md:h-[365px] md:w-[768px]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="px-6 pb-6 pt-7 sm:px-10 md:px-11 md:pb-5 md:pt-8">
          <div className="min-w-0">
            <h3 className="text-[2.125rem] font-extrabold leading-none tracking-tight text-[#122459]">
              {student.firstName} {student.lastName}
            </h3>
            <p className="mt-4 text-[1rem] leading-none text-[#737373] sm:text-[1.0625rem]">
              {`${student.studentNumber.toLowerCase()}@gmail.com`}
            </p>
          </div>
        </div>

        <div className="flex-1 border-t border-[#d1d5db] px-6 py-6 sm:px-10 md:px-6 md:py-7">
          <div className="mx-auto max-w-[720px]">
            <h4 className="text-[1.125rem] font-extrabold text-[#122459] sm:text-[1.25rem]">
              Шалгалтууд
            </h4>

            {examRows.length === 0 ? (
              <div className="mt-6 rounded-[20px] border border-dashed border-[#cbd5e1] bg-[#f8fbff] px-5 py-8 text-center text-[0.95rem] text-[#122459]">
                Энэ сурагчийн өмнөх шалгалтын дүн одоогоор байхгүй байна.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {examRows.map(({ exam, score }) => (
                  <div
                    key={exam.id}
                    className="grid h-10 w-full grid-cols-[auto_auto_minmax(0,1fr)_104px_145px] items-center gap-3 rounded-[20px] border border-[#f3f6fa] bg-[#EDF6FF] px-4"
                  >
                    <span className="whitespace-nowrap rounded-[10px] bg-white px-4 py-1 text-[0.95rem] leading-none text-[#122459]">
                      {formatExamDate(exam.date)}
                    </span>
                    <span className="whitespace-nowrap rounded-[10px] bg-white px-4 py-1 text-[0.95rem] leading-none text-[#122459]">
                      {exam.subject}
                    </span>
                    <span className="min-w-0 truncate rounded-[10px] bg-white px-4 py-1 text-[0.95rem] leading-none text-[#122459]">
                      {exam.examTitle}
                    </span>
                    <span className="whitespace-nowrap rounded-[10px] bg-white px-4 py-1 text-center text-[0.95rem] leading-none text-[#122459]">
                      {score.score} / {exam.maxScore}
                    </span>
                    <span
                      className={`whitespace-nowrap rounded-[10px] border px-4 py-1 text-center text-[0.95rem] leading-none ${
                        score.passed
                          ? "border-[#b7efc5] bg-[#dcfce7] text-[#16a34a]"
                          : "border-[#fecaca] bg-[#fee2e2] text-[#ef4444]"
                      }`}
                    >
                      {score.passed ? "Тэнцсэн" : "Тэнцээгүй"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
