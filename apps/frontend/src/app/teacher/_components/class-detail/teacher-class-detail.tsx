/** @format */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  getPastExamsForClass,
  type PastExamRow,
  type PastExamStudentScore,
} from "@/app/lib/class-past-exams-mock";
import type { Student } from "@/app/lib/types";
import {
  GET_CLASS_BY_TEACHER_AND_SCHOOL_ID,
  GET_STUDENT_BY_CLASS_ID,
} from "@/graphql/typeDefs/queries";
import {
  HARDCODED_SCHOOL_ID,
  HARDCODED_TEACHER_ID,
} from "@/app/teacher/_lib/hardcoded-teacher-api";
import { ClassDetailAccessDenied } from "./class-detail-access-denied";
import { ClassDetailDeliveryFeedback } from "./class-detail-delivery-feedback";
import { ClassDetailHero } from "./class-detail-hero";
import {
  ClassDetailViewTabs,
  type ClassDetailView,
} from "./class-detail-view-tabs";
import ReviewScreen from "./review-screen";
import { safeExamDateKey } from "./teacher-class-detail-utils";
import { TeacherClassHistoryView } from "./teacher-class-history-view";
import { TeacherClassPastExamStudentPopover } from "./teacher-class-past-exam-student-popover";
import { TeacherClassPendingExamDeliveryFlow } from "./teacher-class-pending-exam-delivery-flow";
import { TeacherClassStudentsView } from "./teacher-class-students-view";

type GqlStudentRow = {
  id: string;
  classId: string;
  firstName: string;
  lastName: string;
  studentCode: string | null;
};

type ClassesByTeacherResponse = {
  getClassByTeacherAndSchoolId: Array<{
    id: string;
    grade: number;
    section: string;
  }>;
};

type StudentsByClassResponse = {
  getStudentByClassId: GqlStudentRow[];
};

function mapGqlStudentToApp(s: GqlStudentRow): Student {
  return {
    id: s.id,
    firstName: s.firstName,
    lastName: s.lastName,
    classId: s.classId,
    studentNumber: s.studentCode?.trim() || s.id.slice(0, 8),
  };
}

export default function TeacherClassDetail({ classId }: { classId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentNumber = searchParams.get("student");
  const classPath = `/teacher/class/${encodeURIComponent(classId)}`;
  const pendingExamDelivery = useMemo(() => {
    const examId = searchParams.get("deliveryExamId");
    const examTitle = searchParams.get("deliveryExamTitle");
    const deliveryClassId = searchParams.get("deliveryClassId");
    if (!examId || !examTitle || !deliveryClassId) return null;
    return { classId: deliveryClassId, examId, examTitle };
  }, [searchParams]);

  const { data: classesData, loading: classesLoading } =
    useQuery<ClassesByTeacherResponse>(GET_CLASS_BY_TEACHER_AND_SCHOOL_ID, {
      variables: {
        input: {
          teacherId: HARDCODED_TEACHER_ID,
          schoolId: HARDCODED_SCHOOL_ID,
        },
      },
    });

  const apiClassRow = useMemo(() => {
    const list = classesData?.getClassByTeacherAndSchoolId ?? [];
    return list.find((c) => c.id === classId);
  }, [classesData, classId]);

  const { data: studentsData, loading: studentsLoading, refetch: refetchStudents } =
    useQuery<StudentsByClassResponse>(GET_STUDENT_BY_CLASS_ID, {
      variables: { classId },
      skip: !apiClassRow,
    });

  const students = useMemo(
    () =>
      (studentsData?.getStudentByClassId ?? []).map(mapGqlStudentToApp),
    [studentsData],
  );

  const clsLabel = apiClassRow
    ? `${apiClassRow.grade}${apiClassRow.section}`
    : "";

  const pageLoading =
    classesLoading || (!!apiClassRow && studentsLoading);

  const pastExams = useMemo(
    () =>
      apiClassRow && clsLabel
        ? getPastExamsForClass(classId, students)
        : [],
    [apiClassRow, classId, clsLabel, students],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ClassDetailView>("students");
  const [historyQuery, setHistoryQuery] = useState("");
  const [expandedPastExamId, setExpandedPastExamId] = useState<string | null>(
    null,
  );
  const [deliveryFeedback, setDeliveryFeedback] = useState("");
  const [examStudentPopover, setExamStudentPopover] = useState<{
    examId: string;
    studentId: string;
  } | null>(null);

  const selectedStudentExams = useMemo(() => {
    if (!selectedId) return [];
    const items: Array<{ exam: PastExamRow; score: PastExamStudentScore }> = [];
    for (const exam of pastExams) {
      const score = exam.studentScores.find(
        (student) => student.studentId === selectedId,
      );
      if (score) items.push({ exam, score });
    }
    return items.sort((a, b) =>
      safeExamDateKey(a.exam.date).localeCompare(safeExamDateKey(b.exam.date)),
    );
  }, [pastExams, selectedId]);

  const filteredPastExams = useMemo(() => {
    const query = historyQuery.trim().toLowerCase();
    if (!query) return pastExams;
    return pastExams.filter(
      (exam) =>
        exam.subject.toLowerCase().includes(query) ||
        exam.examTitle.toLowerCase().includes(query) ||
        safeExamDateKey(exam.date).toLowerCase().includes(query) ||
        `${exam.maxScore}`.includes(query) ||
        exam.studentScores.some(
          (student) =>
            student.studentNumber.toLowerCase().includes(query) ||
            `${student.firstName} ${student.lastName}`
              .toLowerCase()
              .includes(query) ||
            `${student.lastName} ${student.firstName}`
              .toLowerCase()
              .includes(query),
        ),
    );
  }, [historyQuery, pastExams]);

  const examStudentPopoverResolved = useMemo(() => {
    if (!examStudentPopover) return null;
    const exam = filteredPastExams.find(
      (item) => item.id === examStudentPopover.examId,
    );
    const student = exam?.studentScores.find(
      (item) => item.studentId === examStudentPopover.studentId,
    );
    return exam && student ? { exam, student } : null;
  }, [examStudentPopover, filteredPastExams]);

  if (pageLoading) {
    return (
      <section className="px-4 py-10 sm:px-10">
        <p className="text-center text-4 font-semibold text-[#475569]">
          Ачааллаж байна…
        </p>
      </section>
    );
  }

  if (!apiClassRow || !clsLabel) {
    return <ClassDetailAccessDenied />;
  }

  if (studentNumber) {
    return (
      <ReviewScreen
        onBack={() => router.push(classPath)}
        studentCode={studentNumber}
      />
    );
  }

  return (
    <section className="px-4 py-6 sm:px-10 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <ClassDetailHero className={clsLabel} />

        {deliveryFeedback ? (
          <ClassDetailDeliveryFeedback message={deliveryFeedback} />
        ) : null}
        {pendingExamDelivery ? (
          <TeacherClassPendingExamDeliveryFlow
            classId={pendingExamDelivery.classId}
            className={clsLabel}
            classPath={classPath}
            examId={pendingExamDelivery.examId}
            examTitle={pendingExamDelivery.examTitle}
            onComplete={setDeliveryFeedback}
            students={students}
          />
        ) : null}

        <ClassDetailViewTabs
          activeView={activeView}
          onClearPopover={() => setExamStudentPopover(null)}
          onViewChange={setActiveView}
        />

        {activeView === "students" ? (
          <TeacherClassStudentsView
            classId={classId}
            className={clsLabel}
            onStudentsChanged={() => void refetchStudents()}
            selectedId={selectedId}
            selectedStudentExams={selectedStudentExams}
            setSelectedId={setSelectedId}
            students={students}
          />
        ) : (
          <TeacherClassHistoryView
            className={clsLabel}
            examStudentPopoverResolved={examStudentPopoverResolved}
            expandedPastExamId={expandedPastExamId}
            filteredPastExams={filteredPastExams}
            historyQuery={historyQuery}
            onHistoryQueryChange={(value) => {
              setExamStudentPopover(null);
              setHistoryQuery(value);
            }}
            onToggleExam={(examId) =>
              setExpandedPastExamId((current) => {
                if (current === examId) {
                  setExamStudentPopover((popover) =>
                    popover?.examId === examId ? null : popover,
                  );
                  return null;
                }
                setExamStudentPopover(null);
                return examId;
              })
            }
            onToggleExamStudentPopover={(examId, studentId) =>
              setExamStudentPopover((current) =>
                current?.examId === examId && current?.studentId === studentId
                  ? null
                  : { examId, studentId },
              )
            }
          />
        )}
      </div>

      {examStudentPopoverResolved ? (
        <TeacherClassPastExamStudentPopover
          classLabel={clsLabel}
          exam={examStudentPopoverResolved.exam}
          onClose={() => setExamStudentPopover(null)}
          student={examStudentPopoverResolved.student}
        />
      ) : null}
    </section>
  );
}
