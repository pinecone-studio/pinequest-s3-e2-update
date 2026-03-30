"use client";

import { useMemo, useState } from "react";
import type { Student } from "@/app/lib/types";
import type { PastExamRow } from "@/app/lib/class-past-exams-mock";
import { StudentRow } from "./class-student-history/student-row";

export function ClassStudentHistoryPanel({
  classNameLabel,
  classId,
  students,
  pastExams,
  updateStudentAction,
  removeStudentAction,
}: {
  classNameLabel: string;
  classId: string;
  students: Student[];
  pastExams: PastExamRow[];
  updateStudentAction: (formData: FormData) => void | Promise<void>;
  removeStudentAction: (formData: FormData) => void | Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sortedStudents = useMemo(
    () =>
      [...students].sort(
        (a, b) =>
          a.lastName.localeCompare(b.lastName, "mn", { sensitivity: "base" }) ||
          a.firstName.localeCompare(b.firstName, "mn", { sensitivity: "base" }),
      ),
    [students],
  );

  return (
    <section className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm sm:p-8">
      <div className="overflow-x-auto rounded-xl border border-[#e2e8f0]">
        <table className="w-full min-w-[320px]">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#64748b]">
                № / Нэр
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student, index) => (
              <StudentRow
                key={student.id}
                classId={classId}
                classNameLabel={classNameLabel}
                index={index}
                student={student}
                open={selectedId === student.id}
                editing={editingId === student.id}
                onToggleOpen={() =>
                  setSelectedId((cur) => (cur === student.id ? null : student.id))
                }
                onToggleEdit={() =>
                  setEditingId((cur) => (cur === student.id ? null : student.id))
                }
                pastExams={pastExams}
                updateStudentAction={updateStudentAction}
                removeStudentAction={removeStudentAction}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
