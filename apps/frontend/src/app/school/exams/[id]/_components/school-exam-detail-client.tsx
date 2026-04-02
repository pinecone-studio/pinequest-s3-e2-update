/** @format */

"use client";

import { useUser } from "@clerk/nextjs";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  GET_ALL_SUBJECTS,
  GET_CLASS_BY_SCHOOL_ID,
  GET_EXAM_BY_ID,
  GET_SCHOOL_BY_CLERK_ID,
  GET_STUDENT_BY_CLASS_ID,
  GET_STUDENT_EXAM_RESULTS_BY_EXAM_ID,
  GET_TEACHERS_BY_SCHOOL_ID,
} from "@/graphql/typeDefs/queries";
import type { BackendExamRow } from "../../_lib/school-exam-map";
import { mapGqlExamToExamDetail } from "../_lib/map-exam-gql-to-detail";
import { ExamAlerts } from "./ExamAlerts";
import { ExamDetailHeader } from "./ExamDetailHeader";
import { ExamGradingStatus } from "./ExamGradingStatus";
import { ExamInfoCard } from "./ExamInfoCard";
import { ExamParticipationSummary } from "./ExamParticipationSummary";
import { ExamQuestionBreakdown } from "./ExamQuestionBreakdown";

export function SchoolExamDetailClient({ examId }: { examId: string }) {
  const client = useApolloClient();
  const { user, isLoaded } = useUser();
  const clerkId = user?.id ?? "";
  const [rosterStudentCount, setRosterStudentCount] = useState(0);

  const { data: schoolData } = useQuery<{
    getSchoolByClerkId: { id: string };
  }>(GET_SCHOOL_BY_CLERK_ID, {
    variables: { clerkId },
    skip: !isLoaded || !clerkId,
  });
  const schoolId = schoolData?.getSchoolByClerkId?.id ?? "";

  const {
    data: examData,
    loading: examLoading,
    error: examError,
  } = useQuery<{ getExamById: BackendExamRow | null }>(GET_EXAM_BY_ID, {
    variables: { examId },
    skip: !isLoaded || !clerkId,
    fetchPolicy: "network-only",
  });

  const backendExam = examData?.getExamById;
  const allowedClassIdsRef = backendExam?.allowedClassIds;
  const allowedIdsKey = useMemo(
    () =>
      allowedClassIdsRef?.length
        ? [...allowedClassIdsRef].sort().join(",")
        : "",
    [allowedClassIdsRef],
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const ids = backendExam?.allowedClassIds ?? [];
      if (!backendExam || ids.length === 0) {
        if (!cancelled) setRosterStudentCount(0);
        return;
      }
      const results = await Promise.all(
        ids.map((classId) =>
          client.query({
            query: GET_STUDENT_BY_CLASS_ID,
            variables: { classId },
            fetchPolicy: "cache-first",
          }),
        ),
      );
      if (cancelled) return;
      const sum = results.reduce(
        (s, r) => s + (r.data?.getStudentByClassId?.length ?? 0),
        0,
      );
      setRosterStudentCount(sum);
    })();
    return () => {
      cancelled = true;
    };
  }, [client, backendExam, allowedIdsKey]);

  const { data: resultsData } = useQuery<{
    getStudentExamResultsByExamId: {
      studentId: string;
      actualScore: number | null;
      totalScore: number | null;
      status: string | null;
    }[];
  }>(GET_STUDENT_EXAM_RESULTS_BY_EXAM_ID, {
    variables: { examId },
    skip: !backendExam,
    fetchPolicy: "network-only",
  });

  const { data: classesData } = useQuery<{
    getClassBySchoolId: { id: string; grade: number; section: string }[];
  }>(GET_CLASS_BY_SCHOOL_ID, {
    variables: { schoolId },
    skip: !schoolId,
  });

  const { data: teachersData } = useQuery<{
    getTeachersBySchoolId: {
      id: string;
      firstName: string;
      lastName: string;
    }[];
  }>(GET_TEACHERS_BY_SCHOOL_ID, {
    variables: { schoolId },
    skip: !schoolId,
  });

  const { data: subjectsData } = useQuery<{
    getAllSubject: { id: string; name: string }[];
  }>(GET_ALL_SUBJECTS);

  const examDetail = useMemo(() => {
    if (!backendExam) return null;
    const subjectName =
      (subjectsData?.getAllSubject ?? []).find(
        (s) => s.id === backendExam.subjectId,
      )?.name ??
      backendExam.subjectId ??
      "Хичээл";
    const classById = new Map(
      (classesData?.getClassBySchoolId ?? []).map((c) => [c.id, c]),
    );
    const teacherById = new Map(
      (teachersData?.getTeachersBySchoolId ?? []).map((t) => [
        t.id,
        { id: t.id, firstName: t.firstName, lastName: t.lastName },
      ]),
    );
    return mapGqlExamToExamDetail(
      backendExam,
      subjectName,
      classById,
      teacherById,
      resultsData?.getStudentExamResultsByExamId ?? [],
      rosterStudentCount,
    );
  }, [
    backendExam,
    subjectsData?.getAllSubject,
    classesData?.getClassBySchoolId,
    teachersData?.getTeachersBySchoolId,
    resultsData?.getStudentExamResultsByExamId,
    rosterStudentCount,
  ]);

  if (!isLoaded || !clerkId || examLoading) {
    return (
      <div className="rounded-2xl border border-[#dbe5f0] bg-white p-6 text-[#61708a]">
        Ачааллаж байна…
      </div>
    );
  }

  if (examError || examData?.getExamById === null || !examDetail) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ExamDetailHeader exam={examDetail} />
      <ExamInfoCard exam={examDetail} />
      <ExamParticipationSummary exam={examDetail} />
      <ExamQuestionBreakdown exam={examDetail} />
      <ExamGradingStatus exam={examDetail} />
      <ExamAlerts notes={examDetail.notes} />
    </div>
  );
}
