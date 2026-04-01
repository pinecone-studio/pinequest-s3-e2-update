"use client";

import { useEffect, useState } from "react";
import type { PastExamRow } from "@/app/lib/class-past-exams-mock";
import { getLivePastExamsForClassClient } from "@/app/lib/class-past-exams-live";
import type { Student } from "@/app/lib/types";
import { ClassPastExamsTable } from "./class-past-exams-table";
import { ClassStudentHistoryPanel } from "./class-student-history-panel";

type Props = {
  classId: string;
  classNameLabel: string;
  students: Student[];
  fallbackPastExams: PastExamRow[];
  updateStudentAction: (formData: FormData) => void | Promise<void>;
  removeStudentAction: (formData: FormData) => void | Promise<void>;
};

export function ClassLinkedExamResults({
  classId,
  classNameLabel,
  students,
  fallbackPastExams,
  updateStudentAction,
  removeStudentAction,
}: Props) {
  const [pastExams, setPastExams] = useState<PastExamRow[]>(fallbackPastExams);

  useEffect(() => {
    const sync = () => {
      const liveRows = getLivePastExamsForClassClient(classId, students);
      if (liveRows.length > 0) {
        setPastExams(liveRows);
        return;
      }
      setPastExams(fallbackPastExams);
    };

    sync();
    window.addEventListener("exam-management.local.updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("exam-management.local.updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [classId, students, fallbackPastExams]);

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

