"use client";

import { Plus, Users } from "lucide-react";
import { useState } from "react";
import type {
  PastExamRow,
  PastExamStudentScore,
} from "@/app/lib/class-past-exams-types";
import type { Student } from "@/app/lib/types";
import {
  downloadStudentListPdf,
  downloadStudentListXls,
} from "./teacher-class-detail-utils";
import { TeacherClassAddStudentDialog } from "./teacher-class-add-student-dialog";
import { TeacherClassDownloadMenu } from "./teacher-class-download-menu";
import { TeacherClassStudentHistoryDialog } from "./teacher-class-student-history-dialog";

type TeacherClassStudentsViewProps = {
  classId: string;
  className: string;
  onStudentsChanged?: () => void;
  selectedId: string | null;
  selectedStudentExams: Array<{
    exam: PastExamRow;
    score: PastExamStudentScore;
  }>;
  setSelectedId: (
    studentId: string | null | ((current: string | null) => string | null),
  ) => void;
  students: Student[];
};

export function TeacherClassStudentsView({
  classId,
  className,
  onStudentsChanged,
  selectedId,
  selectedStudentExams,
  setSelectedId,
  students,
}: TeacherClassStudentsViewProps) {
  const [draftStudentName, setDraftStudentName] = useState("");
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const selectedStudent =
    students.find((student) => student.id === selectedId) ?? null;

  return (
    <div className="rounded-2xl bg-white p-5 sm:p-8">
      <div className="mx-auto flex max-w-[930px] flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-5 font-extrabold text-[#122459]">
            <Users className="h-6 w-6 shrink-0 text-[#122459]" />
            Сурагчид
          </h2>
          <p className="mt-2 text-4 text-[#122459]">
            Сурагч сонгоогүй байна. Доорх хүснэгтээс мөр дараарай.
          </p>
        </div>
        <TeacherClassDownloadMenu
          onExcel={() => downloadStudentListXls(className, students)}
          onPdf={() => downloadStudentListPdf(className, students)}
        />
      </div>

      <div className="mx-auto mt-5 max-w-[930px] rounded-xl px-2 py-6 text-center text-4 text-[#122459] sm:px-4">
        <hr className="mx-auto mb-3 h-[2px] w-full border-0 border-t border-[#A1A1A1]" />
        <p className="mt-2 font-semibold text-[#122459]">
          Ангид одоогоор {students.length} сурагч байна.
        </p>
      </div>

      <div className="mt-6 grid justify-items-center gap-y-4 md:justify-center md:[grid-template-columns:repeat(2,455px)] md:gap-x-[20px]">
        <div className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-4 transition sm:px-5 md:h-[86px] md:w-[455px] md:max-w-[455px]">
          <div className="flex h-full items-center gap-4">
            <span className="mt-1.5 w-9 shrink-0 text-[22px] font-semibold leading-none text-[#122459]">
              00
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="min-w-0 flex-1">
                <input
                  className="w-full border-0 bg-transparent p-0 text-4 font-semibold text-[#122459] outline-none placeholder:text-[#7DC8FF]"
                  onChange={(event) => setDraftStudentName(event.target.value)}
                  placeholder="Сурагч нэр оруулах"
                  type="text"
                  value={draftStudentName}
                />
                <p className="mt-0.5 text-3 text-[#94a3b8]">
                  Сурагчийн код оруулах
                </p>
              </div>
              <button
                aria-label="Сурагч нэмэх"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#29A4FF] bg-white text-[#29A4FF] transition hover:bg-[#EDF6FF]"
                onClick={() => setAddStudentDialogOpen(true)}
                type="button"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {students.map((student, index) => {
          const selected = selectedId === student.id;
          return (
            <div
              key={student.id}
              aria-expanded={selected}
              className={`w-full cursor-pointer rounded-[12px] border px-4 py-4 transition sm:px-5 md:h-[86px] md:w-[455px] md:max-w-[455px] ${
                selected
                  ? "border-[#cfe3f7] bg-[#EDF6FF]"
                  : "border-[#e5e7eb] bg-white hover:bg-[#EDF6FF]"
              }`}
              onClick={() => setSelectedId(student.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedId(student.id);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex h-full items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="mt-1.5 w-9 shrink-0 text-[22px] font-semibold leading-none text-[#122459]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-4 font-semibold text-[#122459]">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="mt-0.5 text-3 text-[#122459]">{`${student.studentNumber.toLowerCase()}@gmail.com`}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <TeacherClassStudentHistoryDialog
        examRows={selectedStudentExams}
        onClose={() => setSelectedId(null)}
        open={!!selectedStudent}
        student={selectedStudent}
      />
      <TeacherClassAddStudentDialog
        classId={classId}
        classLabel={className}
        initialName={draftStudentName}
        onClose={() => setAddStudentDialogOpen(false)}
        onSuccess={() => {
          onStudentsChanged?.();
          setDraftStudentName("");
        }}
        open={addStudentDialogOpen}
      />
    </div>
  );
}
