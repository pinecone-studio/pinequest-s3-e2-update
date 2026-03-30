"use client";

import { ChevronDown, ChevronUp, Download, Search } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import type { PastExamRow } from "@/app/lib/class-past-exams-mock";
import { downloadFullExamStatisticsXls } from "./class-past-exams-table/helpers";
import { PastExamExpandedContent } from "./class-past-exams-table/past-exam-expanded-content";
import { PastExamStudentPopover } from "./class-past-exams-table/past-exam-student-popover";

type Props = { classNameLabel: string; rows: PastExamRow[] };

export function ClassPastExamsTable({ classNameLabel, rows }: Props) {
  const [historyQuery, setHistoryQuery] = useState("");
  const [expandedPastExamId, setExpandedPastExamId] = useState<string | null>(null);
  const [examStudentPopover, setExamStudentPopover] = useState<{ examId: string; studentId: string } | null>(null);

  const filteredPastExams = useMemo(() => {
    const q = historyQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((e) =>
      e.subject.toLowerCase().includes(q) ||
      e.examTitle.toLowerCase().includes(q) ||
      e.date.toLowerCase().includes(q) ||
      e.studentScores.some(
        (s) =>
          s.studentNumber.toLowerCase().includes(q) ||
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          `${s.lastName} ${s.firstName}`.toLowerCase().includes(q),
      ),
    );
  }, [rows, historyQuery]);

  const examStudentPopoverResolved = useMemo(() => {
    if (!examStudentPopover) return null;
    const exam = filteredPastExams.find((e) => e.id === examStudentPopover.examId);
    const student = exam?.studentScores.find((s) => s.studentId === examStudentPopover.studentId);
    return exam && student ? { exam, student } : null;
  }, [examStudentPopover, filteredPastExams]);

  if (rows.length === 0) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-zinc-900">Өгсөн шалгалтууд</h3>
        <p className="mt-4 text-sm text-zinc-500">Энэ ангид шалгалтын мэдээлэл алга.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm sm:p-8">
      <h3 className="flex items-center gap-2 text-xl font-extrabold text-[#1f2a44]">Шалгалтын статистик</h3>
      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a96ac]" />
        <input type="search" value={historyQuery} onChange={(e) => { setExamStudentPopover(null); setHistoryQuery(e.target.value); }} placeholder="Хайх: хичээл, шалгалт, огноо, сурагч…" className="w-full rounded-2xl border border-[#d9dee8] bg-[#fafbfd] py-3.5 pl-11 pr-4 text-[0.9375rem] text-[#1f2a44] shadow-inner outline-none transition placeholder:text-[#94a3b8] focus:border-[#4f9dff] focus:bg-white" />
      </div>

      {filteredPastExams.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 py-10 text-center text-[0.9375rem] text-[#64748b]">Хайлтад тохирох шалгалт олдсонгүй.</div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[#e2e8f0] shadow-sm">
          <table className="w-full min-w-[520px]">
            <thead><tr className="border-b border-[#e2e8f0] bg-[#f8fafc]"><th className="w-10 px-2 py-3.5" /><th className="px-4 py-3.5 text-left text-sm font-semibold text-[#64748b]">Огноо</th><th className="px-4 py-3.5 text-left text-sm font-semibold text-[#64748b]">Хичээл</th><th className="px-4 py-3.5 text-left text-sm font-semibold text-[#64748b]">Шалгалт</th><th className="px-4 py-3.5 text-right text-sm font-semibold text-[#64748b]">Тэнцсэн</th><th className="w-[1%] whitespace-nowrap px-3 py-3.5 text-center text-sm font-semibold text-[#64748b]">Татах</th></tr></thead>
            <tbody>
              {filteredPastExams.map((row) => {
                const open = expandedPastExamId === row.id;
                const activeStudentId = examStudentPopoverResolved?.exam.id === row.id ? examStudentPopoverResolved.student.studentId : null;
                return (
                  <Fragment key={row.id}>
                    <tr role="button" tabIndex={0} onClick={() => setExpandedPastExamId((id) => (id === row.id ? null : row.id))} onKeyDown={(ev) => { if (ev.key !== "Enter" && ev.key !== " ") return; ev.preventDefault(); setExpandedPastExamId((id) => (id === row.id ? null : row.id)); }} className={`cursor-pointer border-b border-[#f1f5f9] transition last:border-0 hover:bg-[#f0f7ff] ${open ? "bg-[#eef4ff]/50" : ""}`}>
                      <td className="px-2 py-3.5 text-[#4f9dff]">{open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[0.9375rem] font-semibold text-[#1f2a44]">{row.date}</td>
                      <td className="px-4 py-3.5 text-[0.9375rem] text-[#334261]">{row.subject}</td>
                      <td className="max-w-[min(280px,40vw)] px-4 py-3.5 text-[0.9375rem] leading-snug text-[#334261]">{row.examTitle}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-right text-[0.9375rem] tabular-nums text-[#4a5875]">{row.passed} / {row.total}</td>
                      <td className="px-3 py-3.5 text-center"><button type="button" onClick={(e) => { e.stopPropagation(); downloadFullExamStatisticsXls(classNameLabel, row); }} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#c8d6ea] bg-white text-[#4f9dff] shadow-sm transition hover:border-[#4f9dff] hover:bg-[#f1f6ff]"><Download className="h-4 w-4 shrink-0" /></button></td>
                    </tr>
                    {open ? (
                      <tr className="border-b border-[#e2e8f0] bg-[#f1f5f9]/40"><td colSpan={6} className="px-3 py-5 sm:px-5 sm:py-6"><PastExamExpandedContent classNameLabel={classNameLabel} row={row} activeStudentId={activeStudentId} onStudentToggle={(studentId) => setExamStudentPopover((cur) => cur?.examId === row.id && cur?.studentId === studentId ? null : { examId: row.id, studentId })} /></td></tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {examStudentPopoverResolved ? (
        <PastExamStudentPopover classLabel={classNameLabel} exam={examStudentPopoverResolved.exam} student={examStudentPopoverResolved.student} onClose={() => setExamStudentPopover(null)} />
      ) : null}
    </section>
  );
}
