/** @format */

"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";
import type { Student } from "@/app/lib/types";
import {
  GET_CLASS_BY_SCHOOL_ID,
  GET_SCHOOL_BY_CLERK_ID,
  GET_STUDENT_BY_CLASS_ID,
} from "@/graphql/typeDefs/queries";

function formatClassLabel(grade: number, section: string) {
  return `${grade}${section.trim().toUpperCase()}`;
}

export default function SchoolStudentsPage() {
  const client = useApolloClient();
  const { user, isLoaded: clerkLoaded } = useUser();
  const clerkId = user?.id ?? "";
  const [studentsByClassId, setStudentsByClassId] = useState<
    Record<string, Student[]>
  >({});

  const { data: schoolData } = useQuery<{
    getSchoolByClerkId: { id: string };
  }>(GET_SCHOOL_BY_CLERK_ID, {
    variables: { clerkId },
    skip: !clerkLoaded || !clerkId,
    fetchPolicy: "cache-and-network",
  });
  const schoolId = schoolData?.getSchoolByClerkId?.id ?? "";

  const { data: classesData } = useQuery<{
    getClassBySchoolId: { id: string; grade: number; section: string }[];
  }>(GET_CLASS_BY_SCHOOL_ID, {
    variables: { schoolId },
    skip: !schoolId,
    fetchPolicy: "cache-and-network",
  });

  const classRows = useMemo(
    () => classesData?.getClassBySchoolId ?? [],
    [classesData?.getClassBySchoolId],
  );
  const classRowsKey = useMemo(
    () =>
      classRows
        .map((c) => c.id)
        .sort()
        .join(","),
    [classRows],
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!schoolId || classRows.length === 0) {
        if (!cancelled) setStudentsByClassId({});
        return;
      }
      const entries = await Promise.all(
        classRows.map(async (c) => {
          const r = await client.query<{
            getStudentByClassId: Student[] | null;
          }>({
            query: GET_STUDENT_BY_CLASS_ID,
            variables: { classId: c.id },
            fetchPolicy: "cache-first",
          });
          const list = (r.data?.getStudentByClassId ?? []) as Student[];
          return [c.id, list] as const;
        }),
      );
      if (cancelled) return;
      setStudentsByClassId(Object.fromEntries(entries));
    })();
    return () => {
      cancelled = true;
    };
  }, [client, schoolId, classRowsKey, classRows]);

  const students = useMemo(() => {
    const classNameById = new Map(
      classRows.map((c) => [
        c.id,
        formatClassLabel(c.grade, c.section),
      ]),
    );
    const out: (Student & { className: string; fullName: string })[] = [];
    for (const c of classRows) {
      const list = studentsByClassId[c.id];
      for (const s of list ?? []) {
        out.push({
          ...s,
          className: classNameById.get(c.id) ?? "-",
          fullName: `${s.lastName} ${s.firstName}`.trim(),
        });
      }
    }
    return out.sort((a, b) => a.fullName.localeCompare(b.fullName, "mn"));
  }, [classRows, studentsByClassId]);

  if (!clerkLoaded || (!schoolId && clerkId)) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-zinc-500">Ачааллаж байна…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-3 font-bold text-[#0f172a]">Сурагчдын жагсаалт</h2>
            <p className="mt-1 text-2 text-zinc-600">Нийт сурагч: {students.length}</p>
          </div>
          <Link
            href="/school/classes?grade=10"
            className="text-2 font-medium text-blue-700 hover:text-blue-800"
          >
            Ангиуд руу очих →
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-115 text-2">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500">
                <th className="py-2">№</th>
                <th className="py-2">Овог нэр</th>
                <th className="py-2">Код</th>
                <th className="py-2">Анги</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="border-b border-zinc-100">
                  <td className="py-2 text-zinc-500">{index + 1}</td>
                  <td className="py-2 font-medium text-zinc-900">{student.fullName}</td>
                  <td className="py-2 text-zinc-600">
                    {student.studentCode?.trim() || student.studentNumber || "—"}
                  </td>
                  <td className="py-2 text-zinc-700">{student.className}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
