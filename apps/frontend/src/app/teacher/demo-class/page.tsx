/** @format */

"use client";

import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GET_CLASS_BY_TEACHER_AND_SCHOOL_ID } from "@/graphql/typeDefs/queries";
import { useTeacherDb } from "@/app/teacher/_components/teacher-db-context";

type ClassesResponse = {
  getClassByTeacherAndSchoolId: Array<{ id: string }>;
};

export default function TeacherDemoClassRedirectPage() {
  const router = useRouter();
  const { teacher: dbTeacher, loading: teacherLoading } = useTeacherDb();
  const teacherId = dbTeacher?.id ?? "";
  const schoolId = dbTeacher?.schoolId ?? "";

  const { data, loading: classesLoading } = useQuery<ClassesResponse>(
    GET_CLASS_BY_TEACHER_AND_SCHOOL_ID,
    {
      variables: { input: { teacherId, schoolId } },
      skip: !teacherId || !schoolId,
    },
  );

  useEffect(() => {
    if (teacherLoading || classesLoading) return;
    const first = data?.getClassByTeacherAndSchoolId?.[0];
    if (first?.id) {
      router.replace(`/teacher/class/${encodeURIComponent(first.id)}`);
      return;
    }
    router.replace("/teacher");
  }, [teacherLoading, classesLoading, data, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4 text-sm text-[#475569]">
      Анги руу шилжиж байна…
    </div>
  );
}
