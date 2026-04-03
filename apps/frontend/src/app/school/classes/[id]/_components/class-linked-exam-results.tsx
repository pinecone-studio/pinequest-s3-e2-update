"use client";

import type { PastExamRow } from "@/app/lib/class-past-exams-types";
import type { Student } from "@/app/lib/types";
import { ClassPastExamsTable } from "./class-past-exams-table";
import { ClassStudentHistoryPanel } from "./class-student-history-panel";

type Props = {
  classId: string;
  classNameLabel: string;
  students: Student[];
  pastExams: PastExamRow[];
  updateStudentAction: (formData: FormData) => void | Promise<void>;
  removeStudentAction: (formData: FormData) => void | Promise<void>;
};

export function ClassLinkedExamResults({
  classId,
  classNameLabel,
  students,
  pastExams,
  updateStudentAction,
  removeStudentAction,
}: Props) {
  return (
    <>
      <ClassPastExamsTable classNameLabel={classNameLabel} rows={pastExams} />
      <ClassStudentHistoryPanel
        classNameLabel={classNameLabel}
        classId={classId}
        students={students}
        pastExams={pastExams}
        updateStudentAction={updateStudentAction}
        removeStudentAction={removeStudentAction}
      />
    </>
  );
}

