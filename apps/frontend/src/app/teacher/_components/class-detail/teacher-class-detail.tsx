/** @format */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { buildPastExamRowsFromApi } from "@/app/lib/class-past-exams-from-api";
import { getLivePastExamsForClassClient } from "@/app/lib/class-past-exams-live";
import { getPastExamsForClass } from "@/app/lib/class-past-exams-mock";
import type { PastExamRow, PastExamStudentScore } from "@/app/lib/class-past-exams-types";
import { store } from "@/app/lib/store";
import { TEACHER_DEMO_CLASS_IDS } from "@/app/lib/teacher-demo-class";
import type { Student } from "@/app/lib/types";
import {
  GET_ALL_SUBJECTS,
  GET_CLASS_BY_TEACHER_AND_SCHOOL_ID,
  GET_EXAM_QUESTION_ITEMS,
  GET_EXAMS_BY_IDS,
  GET_STUDENT_BY_CLASS_ID,
  GET_STUDENT_EXAM_RESULTS_BY_CLASS_ID,
} from "@/graphql/typeDefs/queries";
import { useTeacherDb } from "@/app/teacher/_components/teacher-db-context";
import { applySavedManualGradingToRows } from "@/app/teacher/exam-grading/_lib/manual-grading";
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
import { TeacherClassOpenAnswerGradingDialog } from "./teacher-class-open-answer-grading-dialog";
import { TeacherClassPastExamStudentPopover } from "./teacher-class-past-exam-student-popover";
import { TeacherClassPendingExamDeliveryFlow } from "./teacher-class-pending-exam-delivery-flow";
import { TeacherClassDetailSkeleton } from "./teacher-class-detail-skeleton";
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
    sectionTeacherId: string;
    section: string;
  }>;
};

type StudentsByClassResponse = {
  getStudentByClassId: GqlStudentRow[];
};

type ExamResultsResponse = {
  getStudentExamResultsByClassId: Array<{
    id: string;
    examId: string;
    studentId: string;
    totalScore: number | null;
    actualScore: number | null;
    status: string | null;
  }>;
};

type ExamsByIdsResponse = {
  getExamsByIds: Array<{
    id: string;
    subjectId: string;
    title: string | null;
    date: string | null;
    score: number | null;
    grade: number;
    testIds: string[] | null;
    openExerciseIds: string[] | null;
  }>;
};

type ExamQuestionItemsResponse = {
  getTestsByIds: Array<{
    id: string;
    question: string;
    score: number | null;
    rightAnswer?: string | null;
  }>;
  getOpenExerciesByIds: Array<{
    id: string;
    question: string | null;
    title: string | null;
    answer: string | null;
    score: number | null;
  }>;
};

type AllSubjectsResponse = {
  getAllSubject: Array<{ id: string; name: string }>;
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

const CLASS_LABEL_CHAR_MAP: Record<string, string> = {
  A: "A",
  А: "A",
  B: "B",
  Б: "B",
  C: "C",
  С: "C",
  D: "D",
  Д: "D",
  E: "E",
  Е: "E",
  Ё: "E",
  F: "F",
  Ф: "F",
  G: "G",
  Г: "G",
  H: "H",
  Х: "H",
  I: "I",
  И: "I",
  Й: "I",
  J: "J",
  Ж: "J",
  K: "K",
  К: "K",
  L: "L",
  Л: "L",
  M: "M",
  М: "M",
  N: "N",
  Н: "N",
  O: "O",
  О: "O",
  Ө: "O",
  P: "P",
  П: "P",
  R: "R",
  Р: "R",
  T: "T",
  Т: "T",
  U: "U",
  У: "U",
  Ү: "U",
  V: "V",
  В: "V",
  Y: "Y",
  Ы: "Y",
  Z: "Z",
  З: "Z",
};

function normalizeClassLabel(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .split("")
    .map((char) => CLASS_LABEL_CHAR_MAP[char] ?? char)
    .join("");
}

export default function TeacherClassDetail({ classId }: { classId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { teacher: dbTeacher, loading: teacherDbLoading } = useTeacherDb();
  const teacherId = dbTeacher?.id ?? "";
  const schoolId = dbTeacher?.schoolId ?? "";
  const studentNumber = searchParams.get("student");
  const classPath = `/teacher/class/${encodeURIComponent(classId)}`;
  const pendingExamDelivery = useMemo(() => {
    const examId = searchParams.get("deliveryExamId");
    const examTitle = searchParams.get("deliveryExamTitle");
    const deliveryClassId = searchParams.get("deliveryClassId");
    if (!examId || !examTitle || !deliveryClassId) return null;
    return { classId: deliveryClassId, examId, examTitle };
  }, [searchParams]);

  const { data: subjectsData } = useQuery<AllSubjectsResponse>(GET_ALL_SUBJECTS);

  const subjectNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of subjectsData?.getAllSubject ?? []) {
      m.set(s.id, s.name);
    }
    return m;
  }, [subjectsData?.getAllSubject]);

  const { data: classesData, loading: classesLoading } =
    useQuery<ClassesByTeacherResponse>(GET_CLASS_BY_TEACHER_AND_SCHOOL_ID, {
      variables: {
        input: {
          teacherId,
          schoolId,
        },
      },
      skip: !teacherId || !schoolId,
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

  const { data: resultsData, loading: resultsLoading } =
    useQuery<ExamResultsResponse>(GET_STUDENT_EXAM_RESULTS_BY_CLASS_ID, {
      variables: { classId },
      skip: !apiClassRow,
      fetchPolicy: "cache-and-network",
    });

  const examIds = useMemo(() => {
    const raw = resultsData?.getStudentExamResultsByClassId ?? [];
    return [...new Set(raw.map((r) => r.examId).filter(Boolean))];
  }, [resultsData?.getStudentExamResultsByClassId]);

  const { data: examsData, loading: examsLoading } = useQuery<ExamsByIdsResponse>(
    GET_EXAMS_BY_IDS,
    {
      variables: { ids: examIds },
      skip: !apiClassRow || examIds.length === 0,
      fetchPolicy: "cache-and-network",
    },
  );
  const questionItemIds = useMemo(() => {
    const tests = new Set<string>();
    const openExercises = new Set<string>();
    for (const exam of examsData?.getExamsByIds ?? []) {
      for (const testId of exam.testIds ?? []) {
        if (testId) tests.add(testId);
      }
      for (const openExerciseId of exam.openExerciseIds ?? []) {
        if (openExerciseId) openExercises.add(openExerciseId);
      }
    }
    return {
      testIds: [...tests],
      openExerciseIds: [...openExercises],
    };
  }, [examsData?.getExamsByIds]);

  const { data: questionItemsData, loading: questionItemsLoading } =
    useQuery<ExamQuestionItemsResponse>(GET_EXAM_QUESTION_ITEMS, {
      variables: questionItemIds,
      skip:
        !apiClassRow ||
        (questionItemIds.testIds.length === 0 &&
          questionItemIds.openExerciseIds.length === 0),
      fetchPolicy: "cache-and-network",
    });

  const clsLabel = apiClassRow
    ? `${apiClassRow.grade}${apiClassRow.section}`
    : "";
  const apiStudents = useMemo(
    () =>
      (studentsData?.getStudentByClassId ?? []).map(mapGqlStudentToApp),
    [studentsData],
  );
  const fallbackStudents = useMemo(() => {
    const byId = store.listStudentsInClass(classId);
    if (byId.length > 0) return byId;

    const normalizedClassLabel = normalizeClassLabel(clsLabel);
    const allClasses = store.listClasses();
    if (normalizedClassLabel) {
      const matchedClass = allClasses.find(
        (item) => normalizeClassLabel(item.name) === normalizedClassLabel,
      );
      if (matchedClass) return store.listStudentsInClass(matchedClass.id);

      const gradePrefix = normalizedClassLabel.match(/^\d+/)?.[0];
      if (gradePrefix) {
        const matchedGradeClass = allClasses.find((item) =>
          normalizeClassLabel(item.name).startsWith(gradePrefix),
        );
        if (matchedGradeClass) {
          return store.listStudentsInClass(matchedGradeClass.id);
        }
      }
    }

    for (const demoClassId of TEACHER_DEMO_CLASS_IDS) {
      const demoStudents = store.listStudentsInClass(demoClassId);
      if (demoStudents.length > 0) return demoStudents;
    }

    return [];
  }, [classId, clsLabel]);
  const students =
    apiStudents.length > 0 ? apiStudents : fallbackStudents;
  const isResponsibleClass = apiClassRow?.sectionTeacherId === teacherId;

  const pageLoading =
    teacherDbLoading ||
    classesLoading ||
    (!!apiClassRow && studentsLoading) ||
    (!!apiClassRow &&
      (resultsLoading ||
        (examIds.length > 0 && examsLoading) ||
        ((questionItemIds.testIds.length > 0 ||
          questionItemIds.openExerciseIds.length > 0) &&
          questionItemsLoading)));

  const questionById = useMemo(() => {
    const map = new Map<
      string,
      { id: string; question: string; score: number; correctAnswer?: string }
    >();
    for (const test of questionItemsData?.getTestsByIds ?? []) {
      map.set(test.id, {
        id: test.id,
        question: test.question,
        score: Math.max(1, test.score ?? 1),
        correctAnswer: test.rightAnswer?.trim() || undefined,
      });
    }
    for (const openExercise of questionItemsData?.getOpenExerciesByIds ?? []) {
      map.set(openExercise.id, {
        id: openExercise.id,
        question:
          openExercise.question?.trim() ||
          openExercise.title?.trim() ||
          "Задгай асуулт",
        score: Math.max(1, openExercise.score ?? 1),
        correctAnswer: openExercise.answer?.trim() || undefined,
      });
    }
    return map;
  }, [questionItemsData?.getOpenExerciesByIds, questionItemsData?.getTestsByIds]);

  const fallbackPastExams = useMemo(() => {
    if (!apiClassRow || !clsLabel) return [];
    const apiRows = buildPastExamRowsFromApi(
      classId,
      students,
      resultsData?.getStudentExamResultsByClassId ?? [],
      examsData?.getExamsByIds ?? [],
      subjectNameById,
      questionById,
    );
    if (apiRows.length > 0) return apiRows;
    return getPastExamsForClass(classId, students);
  }, [
    apiClassRow,
    classId,
    clsLabel,
    students,
    resultsData?.getStudentExamResultsByClassId,
    examsData?.getExamsByIds,
    subjectNameById,
    questionById,
  ]);
  const [pastExams, setPastExams] = useState<PastExamRow[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ClassDetailView>("students");
  const [historyQuery, setHistoryQuery] = useState("");
  const [expandedPastExamId, setExpandedPastExamId] = useState<string | null>(
    null,
  );
  const [historyExpandedTouched, setHistoryExpandedTouched] = useState(false);
  const [deliveryFeedback, setDeliveryFeedback] = useState("");
  const [examStudentPopover, setExamStudentPopover] = useState<{
    examId: string;
    studentId: string;
  } | null>(null);
  const [openAnswerExamId, setOpenAnswerExamId] = useState<string | null>(null);

  useEffect(() => {
    const syncPastExams = () => {
      const liveRows = getLivePastExamsForClassClient(classId, students);
      const sourceRows = liveRows.length > 0 ? liveRows : fallbackPastExams;
      setPastExams(applySavedManualGradingToRows(sourceRows));
    };

    syncPastExams();
    window.addEventListener("exam-management.local.updated", syncPastExams);
    window.addEventListener("storage", syncPastExams);
    return () => {
      window.removeEventListener("exam-management.local.updated", syncPastExams);
      window.removeEventListener("storage", syncPastExams);
    };
  }, [classId, students, fallbackPastExams]);

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

  const hasDetailedPastExamRows = useMemo(
    () =>
      pastExams.some((exam) =>
        exam.studentScores.some((student) => student.attempts.length > 0),
      ),
    [pastExams],
  );

  const resolvedExpandedPastExamId = useMemo(() => {
    if (historyExpandedTouched) return expandedPastExamId;
    if (activeView !== "history") return expandedPastExamId;
    if (!hasDetailedPastExamRows) return expandedPastExamId;
    return filteredPastExams[0]?.id ?? null;
  }, [
    activeView,
    expandedPastExamId,
    filteredPastExams,
    hasDetailedPastExamRows,
    historyExpandedTouched,
  ]);

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

  const openAnswerExamResolved = useMemo(() => {
    if (!openAnswerExamId) return null;
    return pastExams.find((exam) => exam.id === openAnswerExamId) ?? null;
  }, [openAnswerExamId, pastExams]);

  if (pageLoading) {
    return <TeacherClassDetailSkeleton />;
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
            isResponsibleClass={isResponsibleClass}
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
            expandedPastExamId={resolvedExpandedPastExamId}
            filteredPastExams={filteredPastExams}
            historyQuery={historyQuery}
            onHistoryQueryChange={(value) => {
              setExamStudentPopover(null);
              setHistoryQuery(value);
            }}
            onOpenOpenAnswerGrading={(examId) => {
              setExamStudentPopover(null);
              setOpenAnswerExamId(examId);
            }}
            onToggleExam={(examId) => {
              setHistoryExpandedTouched(true);
              if (resolvedExpandedPastExamId === examId) {
                setExamStudentPopover((popover) =>
                  popover?.examId === examId ? null : popover,
                );
                setExpandedPastExamId(null);
                return;
              }
              setExamStudentPopover(null);
              setExpandedPastExamId(examId);
            }}
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
      {openAnswerExamResolved ? (
        <TeacherClassOpenAnswerGradingDialog
          classLabel={clsLabel}
          exam={openAnswerExamResolved}
          onClose={() => setOpenAnswerExamId(null)}
        />
      ) : null}
    </section>
  );
}
