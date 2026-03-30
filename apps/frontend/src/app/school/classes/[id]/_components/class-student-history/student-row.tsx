"use client";

import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Student } from "@/app/lib/types";
import type { PastExamRow, PastExamStudentScore } from "@/app/lib/class-past-exams-mock";
import { shortStudentName } from "./helpers";
import { StudentExamHistory } from "./student-exam-history";

export function StudentRow({
  classId,
  classNameLabel,
  index,
  student,
  open,
  editing,
  onToggleOpen,
  onToggleEdit,
  pastExams,
  updateStudentAction,
  removeStudentAction,
}: {
  classId: string;
  classNameLabel: string;
  index: number;
  student: Student;
  open: boolean;
  editing: boolean;
  onToggleOpen: () => void;
  onToggleEdit: () => void;
  pastExams: PastExamRow[];
  updateStudentAction: (formData: FormData) => void | Promise<void>;
  removeStudentAction: (formData: FormData) => void | Promise<void>;
}) {
  const router = useRouter();
  const examRows = pastExams
    .map((exam) => {
      const score = exam.studentScores.find((s) => s.studentId === student.id);
      return score ? { exam, score } : null;
    })
    .filter((v): v is { exam: PastExamRow; score: PastExamStudentScore } => !!v)
    .sort((a, b) => b.exam.date.localeCompare(a.exam.date));

  return (
    <tr className="border-b border-[#f1f5f9]">
      <td className="p-0">
        <div role="button" tabIndex={0} aria-expanded={open} onClick={onToggleOpen} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggleOpen(); } }} className={`cursor-pointer px-4 py-4 transition hover:bg-[#f6faff] ${open ? "bg-[#eef6ff]" : ""}`}>
          <div className="flex items-center gap-3">
            {open ? <ChevronUp className="h-5 w-5 text-[#4f9dff]" /> : <ChevronDown className="h-5 w-5 text-[#4f9dff]" />}
            <p className="w-12 text-2 font-bold tabular-nums text-[#64748b] sm:w-16">{index + 1}.</p>
            <div className="min-w-0"><p className="text-2 font-semibold text-[#1f2a44]">{shortStudentName(student)}</p><p className="mt-1 text-2 text-[#7b8aa3]">{student.studentNumber}</p></div>
            <div className="ml-auto flex items-center gap-2">
              <button type="button" onClick={(e) => { e.stopPropagation(); onToggleEdit(); }} className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"><Pencil className="h-3.5 w-3.5" />Edit</button>
              <form action={(formData) => { void Promise.resolve(removeStudentAction(formData)).then(() => router.refresh()); }} onClick={(e) => e.stopPropagation()}>
                <input type="hidden" name="id" value={student.id} />
                <input type="hidden" name="classId" value={classId} />
                <button type="submit" className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"><Trash2 className="h-3.5 w-3.5" />Delete</button>
              </form>
            </div>
          </div>
        </div>

        {editing ? (
          <div className="border-t border-[#e2e8f0] bg-white px-4 py-4">
            <form action={(formData) => { void Promise.resolve(updateStudentAction(formData)).then(() => router.refresh()); }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end" onClick={(e) => e.stopPropagation()}>
              <input type="hidden" name="id" value={student.id} />
              <input type="hidden" name="classId" value={classId} />
              <label className="block"><span className="text-xs font-medium text-zinc-500">Регистр</span><input name="studentNumber" defaultValue={student.studentNumber} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900" /></label>
              <label className="block"><span className="text-xs font-medium text-zinc-500">Овог</span><input name="lastName" defaultValue={student.lastName} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900" /></label>
              <label className="block"><span className="text-xs font-medium text-zinc-500">Нэр</span><input name="firstName" defaultValue={student.firstName} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900" /></label>
              <div className="flex items-center gap-2"><button type="submit" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">Хадгалах</button><button type="button" onClick={onToggleEdit} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Болих</button></div>
            </form>
          </div>
        ) : null}

        {open ? <StudentExamHistory classNameLabel={classNameLabel} student={student} examRows={examRows} /> : null}
      </td>
    </tr>
  );
}
