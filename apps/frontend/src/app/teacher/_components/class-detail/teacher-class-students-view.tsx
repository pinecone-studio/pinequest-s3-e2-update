"use client";

import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  PastExamRow,
  PastExamStudentScore,
} from "@/app/lib/class-past-exams-types";
import type { Student } from "@/app/lib/types";
import { TeacherClassAddStudentDialog } from "./teacher-class-add-student-dialog";
import { TeacherClassStudentHistoryDialog } from "./teacher-class-student-history-dialog";
import {
  readStudentStatusMap,
  STUDENT_STATUS_OPTIONS,
  STUDENT_STATUS_UPDATED_EVENT,
  type StudentStatus,
} from "./student-status-ui";

type TeacherClassStudentsViewProps = {
  classId: string;
  className: string;
  isResponsibleClass: boolean;
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
  isResponsibleClass,
  onStudentsChanged,
  selectedId,
  selectedStudentExams,
  setSelectedId,
  students,
}: TeacherClassStudentsViewProps) {
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const [statusByStudentId, setStatusByStudentId] = useState<
    Record<string, StudentStatus>
  >(() => readStudentStatusMap());
  const selectedStudent =
    students.find((student) => student.id === selectedId) ?? null;

  useEffect(() => {
    const sync = () => {
      setStatusByStudentId(readStudentStatusMap());
    };

    window.addEventListener("storage", sync);
    window.addEventListener(STUDENT_STATUS_UPDATED_EVENT, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(STUDENT_STATUS_UPDATED_EVENT, sync);
    };
  }, []);

  return (
    <div className="rounded-2xl bg-white p-5 sm:p-8">
      <div className="mx-auto flex max-w-[930px] flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-5 font-extrabold text-[#122459]">
            <Users className="h-6 w-6 shrink-0 text-[#122459]" />
            Сурагчид
          </h2>
          <p className="mt-2 text-4 text-[#122459]">
            {isResponsibleClass
              ? "Сурагч сонгоогүй байна. Доорх хүснэгтээс мөр дараарай."
              : "Энэ ангид зөвхөн сурагчдын мэдээлэл харах боломжтой."}
          </p>
        </div>
        {isResponsibleClass ? (
          <button
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#d9dee8] bg-white px-4 py-2.5 text-3 font-semibold text-[#122459] shadow-sm transition hover:border-[#7DC8FF] hover:bg-[#EDF6FF] sm:text-4"
            onClick={() => setAddStudentDialogOpen(true)}
            type="button"
          >
            <Plus className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            Сурагч нэмэх
          </button>
        ) : null}
      </div>

      <div className="mx-auto mt-5 max-w-[930px] rounded-xl px-2 py-6 text-center text-4 text-[#122459] sm:px-4">
        <hr className="mx-auto mb-3 h-[2px] w-full border-0 border-t border-[#A1A1A1]" />
        <p className="mt-2 font-semibold text-[#122459]">
          Ангид одоогоор {students.length} сурагч байна.
        </p>
      </div>

      <div className="mt-6 grid justify-items-center gap-y-4 md:justify-center md:[grid-template-columns:repeat(2,455px)] md:gap-x-[20px]">
        {students.map((student, index) => {
          const selected = selectedId === student.id;
          const status =
            statusByStudentId[student.id] ?? ("active" satisfies StudentStatus);
          const activeStatusOption =
            STUDENT_STATUS_OPTIONS.find((item) => item.value === status) ??
            STUDENT_STATUS_OPTIONS[0];

          return (
            <div
              key={student.id}
              aria-expanded={selected}
              className={`w-full cursor-pointer rounded-[12px] border px-4 py-4 transition sm:px-5 md:min-h-[110px] md:w-[455px] md:max-w-[455px] ${
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
              <div className="flex h-full items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
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
                <span
                  className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[12px] font-semibold ${activeStatusOption.badgeClass}`}
                >
                  {activeStatusOption.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <TeacherClassStudentHistoryDialog
        examRows={selectedStudentExams}
        isResponsibleClass={isResponsibleClass}
        onClose={() => setSelectedId(null)}
        open={!!selectedStudent}
        student={selectedStudent}
      />
      {isResponsibleClass && addStudentDialogOpen ? (
        <TeacherClassAddStudentDialog
          classId={classId}
          classLabel={className}
          initialName=""
          onClose={() => setAddStudentDialogOpen(false)}
          onSuccess={() => {
            onStudentsChanged?.();
          }}
        />
      ) : null}
    </div>
  );
}
