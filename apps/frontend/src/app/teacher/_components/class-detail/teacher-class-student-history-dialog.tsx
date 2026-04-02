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
        className="flex w-full max-w-[1434px] flex-col overflow-hidden rounded-[22px] border border-[#e5e7eb] bg-white shadow-[0_25px_80px_-12px_rgba(15,23,42,0.32)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="px-6 pb-6 pt-7 sm:px-10 md:px-11 md:pb-5 md:pt-8">
          <div className="min-w-0">
            <h3 className="text-[48px] font-semibold leading-[120%] tracking-[10%] text-[#122459]">
              {student.firstName} {student.lastName}
            </h3>
            <p className="mt-3 text-[26px] font-medium leading-none text-[#737373]">
              {`${student.studentNumber.toLowerCase()}@gmail.com`}
            </p>
          </div>
        </div>

        <div className="border-t border-[#d1d5db] px-6 py-6 sm:px-10 md:px-6 md:py-7">
          <div className="mx-auto w-full max-w-[1434px]">
            <h4 className="text-[33px] font-medium leading-none text-[#122459]">
              Шалгалтууд
            </h4>

            {examRows.length === 0 ? (
              <div className="mt-6 rounded-[20px] border border-dashed border-[#E5E5E5] bg-[#EDF6FF] px-5 py-8 text-center text-[0.95rem] text-[#122459]">
                Энэ сурагчийн өмнөх шалгалтын дүн одоогоор байхгүй байна.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {examRows.map(({ exam, score }) => (
                  <div
                    key={exam.id}
                    className="flex w-full items-center justify-between gap-6 rounded-[12px] border border-[#f3f6fa] bg-[#EDF6FF] px-6 py-3"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <span className="inline-flex h-8 min-w-[176px] items-center justify-center whitespace-nowrap rounded-[4px] bg-white px-[22.41px] text-[14px] leading-none text-[#122459]">
                        {formatExamDate(exam.date)}
                      </span>
                      <span className="inline-flex h-8 min-w-[174px] items-center justify-center whitespace-nowrap rounded-[4px] bg-white px-[22.41px] text-[14px] leading-none text-[#122459]">
                        {exam.subject}
                      </span>
                      <span className="inline-flex h-8 w-fit max-w-[220px] min-w-[120px] items-center truncate rounded-[4px] bg-white px-[22.41px] text-[14px] leading-none text-[#122459]">
                        {exam.examTitle}
                      </span>
                    </div>
                    <div className="ml-6 flex shrink-0 items-center gap-4">
                      <span className="inline-flex h-8 min-w-[118px] items-center justify-center whitespace-nowrap rounded-[4px] bg-white px-4 text-[14px] leading-none text-[#122459]">
                        {score.score} / {exam.maxScore}
                      </span>
                      <span
                        className={`inline-flex h-8 min-w-[180px] items-center justify-center whitespace-nowrap rounded-[4px] border px-4 text-[14px] leading-none ${
                          score.passed
                            ? "border-[#b7efc5] bg-[#dcfce7] text-[#16a34a]"
                            : "border-[#fecaca] bg-[#fee2e2] text-[#ef4444]"
                        }`}
                      >
                        {score.passed ? "Тэнцсэн" : "Тэнцээгүй"}
                      </span>
                    </div>
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
