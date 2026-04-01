"use client";

import { BarChart3, Download, Eye, EyeClosed, Search } from "lucide-react";
import { Fragment } from "react";
import type {
  PastExamRow,
  PastExamStudentScore,
} from "@/app/lib/class-past-exams-mock";
import {
  downloadFullExamStatisticsXls,
  downloadSingleStudentPastExamXls,
  formatExamDate,
  sortPastExamStudents,
} from "./teacher-class-detail-utils";
import { TeacherClassPastExamGradeChart } from "./teacher-class-past-exam-grade-chart";
import { TeacherClassPastExamMostFailedInsight } from "./teacher-class-past-exam-most-failed-insight";

type TeacherClassHistoryViewProps = {
  className: string;
  examStudentPopoverResolved: {
    exam: PastExamRow;
    student: PastExamStudentScore;
  } | null;
  expandedPastExamId: string | null;
  filteredPastExams: PastExamRow[];
  historyQuery: string;
  onHistoryQueryChange: (value: string) => void;
  onToggleExam: (examId: string) => void;
  onToggleExamStudentPopover: (examId: string, studentId: string) => void;
};

export function TeacherClassHistoryView({
  className,
  examStudentPopoverResolved,
  expandedPastExamId,
  filteredPastExams,
  historyQuery,
  onHistoryQueryChange,
  onToggleExam,
  onToggleExamStudentPopover,
}: TeacherClassHistoryViewProps) {
  return (
    <div className="rounded-sm bg-white p-6 sm:p-8">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-5 font-extrabold text-[#122459]">
          <BarChart3 className="h-6 w-6 shrink-0 text-[#122459]" />
          Шалгалтын статистик
        </h2>
        <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-[#737373] sm:text-base">
          Хичээл, шалгалт, огноо, дүн эсвэл сурагчийн нэрээр хайна уу. Мөр
          дарахад ангийн үнэлгээ, хамгийн олон сурагч алдсан асуулт, сурагчдын
          жагсаалт нэг дор нээгдэнэ.
        </p>
      </div>
      <hr className="mt-5 h-px w-full border-0 bg-[#d9dee8]" />

      {filteredPastExams.length === 0 ? (
        <div className="mt-6 rounded-sm border border-dashed border-[#f3e1a4] bg-[#EDF6FF] px-4 py-10 text-center text-4 text-[#122459]">
          {historyQuery.trim()
            ? "Хайлтад тохирох шалгалт олдсонгүй."
            : "Энэ ангийн шалгалтын статистик одоогоор алга."}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="overflow-hidden rounded-[12px] border border-[#d4d4d4] bg-white">
            <div className="relative flex h-10 items-center px-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#c4c4c4]" />
              <input
                className="w-full bg-transparent pl-10 pr-3 text-[0.8125rem] text-[#737373] outline-none placeholder:text-[#9ca3af] sm:text-[0.875rem]"
                onChange={(e) => onHistoryQueryChange(e.target.value)}
                placeholder="Хайх: хичээл, шалгалт, огноо, сурагч…"
                type="search"
                value={historyQuery}
              />
            </div>
          </div>

          <table className="w-full min-w-[520px] border-collapse">
            <tbody>
              {filteredPastExams.map((row) => {
                const open = expandedPastExamId === row.id;
                return (
                  <Fragment key={row.id}>
                    <tr
                      className={`cursor-pointer border-b border-[#e6edf8] transition last:border-0 hover:bg-[#f8fafc] ${open ? "bg-[#f8fafc]" : ""}`}
                      onClick={() => onToggleExam(row.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 text-[0.9375rem] font-semibold text-[#122459]">
                        {formatExamDate(row.date)}
                      </td>
                      <td className="px-4 py-3.5 text-[0.9375rem] text-[#737373]">
                        {row.subject}
                      </td>
                      <td className="max-w-[min(280px,40vw)] px-4 py-3.5 text-[0.9375rem] leading-snug text-[#737373]">
                        {row.examTitle}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-right text-[0.9375rem] tabular-nums text-[#122459]">
                        {row.passed} / {row.total}
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="inline-flex items-center gap-1 rounded-full border border-[#d9dee8] bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-[#122459] shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleExam(row.id);
                            }}
                            type="button"
                          >
                            Харах{" "}
                            {open ? (
                              <Eye className="h-3.5 w-3.5 text-[#B8DCFF]" />
                            ) : (
                              <EyeClosed className="h-3.5 w-3.5 text-[#B8DCFF]" />
                            )}
                          </button>
                          <button
                            className="inline-flex items-center gap-1 rounded-full border border-[#d9dee8] bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-[#122459] shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadFullExamStatisticsXls(className, row);
                            }}
                            type="button"
                          >
                            Файл <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {open ? (
                      <tr className="border-b border-[#e6edf8] bg-[#f8fafc]">
                        <td className="px-3 py-5 sm:px-5 sm:py-6" colSpan={5}>
                          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.06)] sm:p-6 md:p-8">
                            <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
                              <TeacherClassPastExamGradeChart row={row} />
                              <TeacherClassPastExamMostFailedInsight
                                row={row}
                              />
                            </div>
                            <div className="mt-8 border-t border-[#e2e8f0] pt-8">
                              <div className="max-h-[min(28rem,55vh)] overflow-auto rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
                                <table className="w-full min-w-[320px] text-left text-[0.9375rem]">
                                  <tbody>
                                    {sortPastExamStudents(
                                      row.studentScores,
                                    ).map((student) => (
                                      <tr
                                        key={student.studentId}
                                        className={`${examStudentPopoverResolved?.exam.id === row.id && examStudentPopoverResolved.student.studentId === student.studentId ? "bg-[#e8f2ff]" : ""} cursor-pointer transition-colors hover:bg-[#f0f7ff]`}
                                        onClick={() =>
                                          onToggleExamStudentPopover(
                                            row.id,
                                            student.studentId,
                                          )
                                        }
                                      >
                                        <td className="px-4 py-3.5 font-medium text-[#122459] sm:px-5 sm:py-4">
                                          {student.lastName} {student.firstName}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-right sm:px-5 sm:py-4">
                                          <span className="text-[1.0625rem] font-bold tabular-nums text-[#122459]">
                                            {student.score}
                                          </span>
                                          <span className="ml-1 text-[0.875rem] font-normal tabular-nums text-[#122459]">
                                            / {row.maxScore}
                                          </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-right sm:px-5 sm:py-4">
                                          <button
                                            className="inline-flex items-center justify-center rounded-xl border border-[#c8d6ea] bg-white p-2.5 text-[#122459] shadow-sm transition hover:border-[#4f9dff] hover:bg-[#f1f6ff]"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              downloadSingleStudentPastExamXls(
                                                className,
                                                row,
                                                student,
                                              );
                                            }}
                                            type="button"
                                          >
                                            <Download className="h-4 w-4 shrink-0" />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
