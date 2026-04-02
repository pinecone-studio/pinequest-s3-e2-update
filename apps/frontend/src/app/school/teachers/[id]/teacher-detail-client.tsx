/** @format */

"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import type { BackendExamRow } from "@/app/school/exams/_lib/school-exam-map";
import {
  GET_ALL_SUBJECTS,
  GET_CLASS_BY_SCHOOL_ID,
  GET_EXAM_BY_SCHOOL_ID,
  GET_SCHOOL_BY_CLERK_ID,
  GET_STUDENT_BY_CLASS_ID,
  GET_TEACHERS_BY_SCHOOL_ID,
} from "@/graphql/typeDefs/queries";
import { examsForTeacherToSchedules } from "./_lib/exams-to-teacher-schedules";
import { TeacherExamScheduleReadOnly } from "./_components/TeacherExamScheduleReadOnly";

function formatClassLabel(grade: number, section: string) {
  return `${grade}${section.trim().toUpperCase()}`;
}

export function TeacherDetailClient({ teacherId }: { teacherId: string }) {
  const { user, isLoaded } = useUser();
  const clerkId = user?.id ?? "";

  const { data: schoolData } = useQuery<{
    getSchoolByClerkId: { id: string };
  }>(GET_SCHOOL_BY_CLERK_ID, {
    variables: { clerkId },
    skip: !isLoaded || !clerkId,
  });
  const schoolId = schoolData?.getSchoolByClerkId?.id ?? "";

  const { data: teachersData } = useQuery<{
    getTeachersBySchoolId: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      classIds: string[];
    }[];
  }>(GET_TEACHERS_BY_SCHOOL_ID, {
    variables: { schoolId },
    skip: !schoolId,
  });

  const { data: classesData } = useQuery<{
    getClassBySchoolId: { id: string; grade: number; section: string }[];
  }>(GET_CLASS_BY_SCHOOL_ID, {
    variables: { schoolId },
    skip: !schoolId,
  });

  const { data: examsData } = useQuery<{ getExamBySchoolId: BackendExamRow[] }>(
    GET_EXAM_BY_SCHOOL_ID,
    {
      variables: { schoolId },
      skip: !schoolId,
    },
  );

  const { data: subjectsData } = useQuery<{
    getAllSubject: { id: string; name: string }[];
  }>(GET_ALL_SUBJECTS);

  const teacher = useMemo(
    () => teachersData?.getTeachersBySchoolId?.find((t) => t.id === teacherId),
    [teachersData?.getTeachersBySchoolId, teacherId],
  );

  const classById = useMemo(
    () => new Map((classesData?.getClassBySchoolId ?? []).map((c) => [c.id, c])),
    [classesData?.getClassBySchoolId],
  );

  const subjectNameById = useMemo(
    () => new Map((subjectsData?.getAllSubject ?? []).map((s) => [s.id, s.name])),
    [subjectsData?.getAllSubject],
  );

  const schedules = useMemo(
    () =>
      examsForTeacherToSchedules(
        examsData?.getExamBySchoolId ?? [],
        teacherId,
        subjectNameById,
        classById,
      ),
    [
      examsData?.getExamBySchoolId,
      teacherId,
      subjectNameById,
      classById,
    ],
  );

  const assignedClasses = useMemo(() => {
    if (!teacher) return [];
    return (teacher.classIds ?? [])
      .map((cid) => classById.get(cid))
      .filter(Boolean)
      .map((c) => ({
        id: c!.id,
        name: formatClassLabel(c!.grade, c!.section),
      }));
  }, [teacher, classById]);

  if (!isLoaded || !schoolId) {
    return <p className="text-sm text-zinc-500">Ачааллаж байна…</p>;
  }

  if (!teacher) {
    return (
      <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
        Багш олдсонгүй.
      </p>
    );
  }

  const displayName = `${teacher.lastName} ${teacher.firstName}`.trim() || teacher.email;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
        <Link href="/school/teachers" className="hover:text-blue-600">
          Хүний нөөц
        </Link>
        <span aria-hidden>/</span>
        <span className="text-zinc-900">{displayName}</span>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">{displayName}</h1>
        <p className="mt-1 text-sm text-zinc-600">{teacher.email}</p>
        <p className="mt-1 text-sm text-zinc-600">Албан тушаал: {teacher.role || "—"}</p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Шалгалтын хуваарь (D1)</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Товлолт `exam` хүснэгтээс уншаад харуулна. Засварлах нь багшийн шалгалтын
            урсгал ашиглана.
          </p>
        </div>
        <TeacherExamScheduleReadOnly schedules={schedules} />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">
            Орох ангиуд ({assignedClasses.length})
          </h2>
        </div>
        {assignedClasses.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-zinc-500">
            Одоогоор анги хуваарилаагүй. «Ангиуд» хуудаснаас хуваарилна уу.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {assignedClasses.map((c) => (
              <li key={c.id} className="px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Link
                      href={`/school/classes/${c.id}`}
                      className="font-medium text-zinc-900 hover:text-blue-600"
                    >
                      {c.name}
                    </Link>
                    <p className="mt-1 text-sm text-zinc-500">
                      <ClassStudentCount classId={c.id} /> сурагч
                    </p>
                  </div>
                  <Link
                    href={`/school/classes/${c.id}`}
                    className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Анги нээх →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/** One `useQuery` per class — Apollo Client v4 `@apollo/client/react` does not export `useQueries`. */
function ClassStudentCount({ classId }: { classId: string }) {
  const { data } = useQuery<{
    getStudentByClassId: unknown[] | null;
  }>(GET_STUDENT_BY_CLASS_ID, {
    variables: { classId },
    fetchPolicy: "cache-first",
  });
  return <>{data?.getStudentByClassId?.length ?? 0}</>;
}
