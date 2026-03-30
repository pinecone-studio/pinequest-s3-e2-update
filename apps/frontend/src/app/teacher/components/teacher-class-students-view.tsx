"use client";

import { Eye, EyeClosed, Users } from "lucide-react";
import type { PastExamRow, PastExamStudentScore } from "@/app/lib/class-past-exams-mock";
import type { Student } from "@/app/lib/types";
import { downloadStudentListPdf, downloadStudentListXls } from "./teacher-class-detail-utils";
import { TeacherClassDownloadMenu } from "./teacher-class-download-menu";
import { TeacherClassStudentExamResultsPanel } from "./teacher-class-student-exam-results-panel";

type TeacherClassStudentsViewProps = {
  className: string;
  selectedId: string | null;
  selectedStudentExams: Array<{ exam: PastExamRow; score: PastExamStudentScore }>;
  setSelectedId: (studentId: string | null | ((current: string | null) => string | null)) => void;
  students: Student[];
};

export function TeacherClassStudentsView({
  className,
  selectedId,
  selectedStudentExams,
  setSelectedId,
  students,
}: TeacherClassStudentsViewProps) {
  return (
    <div className="rounded-2xl bg-white p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-5 font-extrabold text-[#122459]">
            <Users className="h-6 w-6 shrink-0 text-[#122459]" />
            Сурагчид
          </h2>
          <p className="mt-2 text-4 text-[#122459]">Сурагч сонгоогүй байна. Доорх хүснэгтээс мөр дараарай.</p>
        </div>
        <TeacherClassDownloadMenu
          onExcel={() => downloadStudentListXls(className, students)}
          onPdf={() => downloadStudentListPdf(className, students)}
        />
      </div>

      <div className="mt-5 rounded-xl px-2 py-6 text-center text-4 text-[#122459] sm:px-4">
        <hr className="mx-auto mb-3 h-[2px] w-full max-w-[984px] border-0 border-t border-[#A1A1A1]" />
        <p className="mt-2 font-semibold text-[#122459]">Ангид одоогоор {students.length} сурагч байна.</p>
      </div>

      <div className="mt-6 space-y-4">
        {students.map((student, index) => {
          const open = selectedId === student.id;
          return (
            <div
              key={student.id}
              aria-expanded={open}
              className={`mx-auto w-full max-w-[455px] cursor-pointer rounded-[12px] border border-[#D4D4D4] bg-white px-4 transition hover:bg-[#EDF6FF] sm:px-5 ${open ? "pb-5" : "py-4 sm:h-[86px]"}`}
              onClick={() => setSelectedId((current) => (current === student.id ? null : student.id))}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedId((current) => (current === student.id ? null : student.id));
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className={`flex h-full justify-between gap-4 ${open ? "items-start pt-4" : "items-center"}`}>
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 w-8 shrink-0 text-4 font-semibold text-[#122459]">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-4 font-semibold text-[#122459]">{student.firstName} {student.lastName}</p>
                    <p className="mt-1 text-3 text-[#122459]">{`${student.studentNumber.toLowerCase()}@gmail.com`}</p>
                  </div>
                </div>
                <span className="flex h-[50px] w-[50px] items-center justify-center rounded-xl bg-white">
                  {open ? <Eye className="h-5 w-5 text-[#1f6feb]" /> : <EyeClosed className="h-5 w-5 text-[#1f6feb]" />}
                </span>
              </div>
              {open ? (
                <div className="mt-4">
                  <TeacherClassStudentExamResultsPanel
                    classLabel={className}
                    examRows={selectedStudentExams}
                    placement="underRow"
                    student={student}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
