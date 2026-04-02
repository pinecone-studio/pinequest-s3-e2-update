/** @format */

import { auth } from "@clerk/nextjs/server";
import { print } from "graphql";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Pencil } from "lucide-react";
import { authSignInHref } from "@/app/lib/auth-redirect";
import { buildPastExamRowsFromApi } from "@/app/lib/class-past-exams-from-api";
import type { Student } from "@/app/lib/types";
import {
  assignTeachersToClass,
  deleteClass,
  removeStudent,
  updateStudent,
} from "@/app/school/action";
import { schoolGraphql } from "@/app/school/_lib/school-graphql-server";
import {
  GET_ALL_SUBJECTS,
  GET_CLASS_BY_SCHOOL_ID,
  GET_EXAM_BY_SCHOOL_ID,
  GET_EXAMS_BY_IDS,
  GET_SCHOOL_BY_CLERK_ID,
  GET_STUDENT_BY_CLASS_ID,
  GET_STUDENT_EXAM_RESULTS_BY_CLASS_ID,
  GET_TEACHERS_BY_SCHOOL_ID,
} from "@/graphql/typeDefs/queries";
import { ClassLinkedExamResults } from "./_components/class-linked-exam-results";
import { TeacherAssignmentPicker } from "./_components/teacher-assignment-picker";

type ClassRow = {
  id: string;
  schoolId: string;
  grade: number;
  section: string;
  sectionTeacherId: string;
};

type TeacherRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  classIds: string[];
};

function homeroomLabel(sectionTeacherId: string, teacherById: Map<string, TeacherRow>): string {
  const t = teacherById.get(sectionTeacherId);
  if (!t) return "-";
  const l = t.lastName.trim();
  const f = t.firstName.trim();
  if (!l && !f) return "-";
  if (!l) return f;
  if (!f) return l;
  return `${l.charAt(0).toUpperCase()}.${f}`;
}

function teacherDisplayName(t: TeacherRow) {
  const n = `${t.lastName} ${t.firstName}`.trim();
  return n || t.email;
}

export default async function AdminClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect(authSignInHref("/school"));

  const { id } = await params;

  const schoolQ = await schoolGraphql<{
    getSchoolByClerkId: { id: string };
  }>(print(GET_SCHOOL_BY_CLERK_ID), { clerkId: userId });
  const schoolId = schoolQ.getSchoolByClerkId.id;

  const classesQ = await schoolGraphql<{ getClassBySchoolId: ClassRow[] | null }>(
    print(GET_CLASS_BY_SCHOOL_ID),
    { schoolId },
  );
  const klass = (classesQ.getClassBySchoolId ?? []).find((c) => c.id === id);
  if (!klass) notFound();

  const [teachersQ, studentsQ, resultsQ, subjectsQ, examsQ] = await Promise.all([
    schoolGraphql<{ getTeachersBySchoolId: TeacherRow[] }>(
      print(GET_TEACHERS_BY_SCHOOL_ID),
      { schoolId },
    ),
    schoolGraphql<{ getStudentByClassId: Student[] }>(print(GET_STUDENT_BY_CLASS_ID), {
      classId: id,
    }),
    schoolGraphql<{
      getStudentExamResultsByClassId: {
        id: string;
        examId: string;
        studentId: string;
        totalScore: number | null;
        actualScore: number | null;
        status: string | null;
      }[];
    }>(print(GET_STUDENT_EXAM_RESULTS_BY_CLASS_ID), { classId: id }),
    schoolGraphql<{ getAllSubject: { id: string; name: string }[] }>(
      print(GET_ALL_SUBJECTS),
      {},
    ),
    schoolGraphql<{
      getExamBySchoolId: { id: string; allowedClassIds: string[] }[];
    }>(print(GET_EXAM_BY_SCHOOL_ID), { schoolId }),
  ]);

  const teachers = teachersQ.getTeachersBySchoolId ?? [];
  const teacherById = new Map(teachers.map((t) => [t.id, t]));
  const roster = studentsQ.getStudentByClassId ?? [];
  const results = resultsQ.getStudentExamResultsByClassId ?? [];

  const examsForClass = (examsQ.getExamBySchoolId ?? []).filter((e) =>
    (e.allowedClassIds ?? []).includes(id),
  );
  const examIds = [
    ...new Set([
      ...results.map((r) => r.examId),
      ...examsForClass.map((e) => e.id),
    ]),
  ];

  const examsByIdsQ = examIds.length
    ? await schoolGraphql<{
        getExamsByIds: {
          id: string;
          subjectId: string;
          title: string | null;
          date: string | null;
          score: number | null;
          grade: number;
        }[];
      }>(print(GET_EXAMS_BY_IDS), { ids: examIds })
    : { getExamsByIds: [] };

  const subjectNameById = new Map(
    (subjectsQ.getAllSubject ?? []).map((s) => [s.id, s.name]),
  );

  const pastExams = buildPastExamRowsFromApi(
    id,
    roster,
    results,
    examsByIdsQ.getExamsByIds ?? [],
    subjectNameById,
  );

  const classDisplay = `${klass.grade}${klass.section.trim().toUpperCase()}`;
  const homeroomTeacherName = homeroomLabel(klass.sectionTeacherId, teacherById);

  const assignedTeacherIds = teachers.filter((t) => (t.classIds ?? []).includes(id)).map((t) => t.id);

  const gradeLabel = String(klass.grade);
  const groupLabel = klass.section.trim().toUpperCase() || "-";

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
        <Link href="/school/classes" className="hover:text-blue-600">
          Ангиуд
        </Link>
        <span aria-hidden>/</span>
        <span className="text-zinc-900">{classDisplay}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">{classDisplay}</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Багш нарыг хуваарилаж, сурагчдын жагсаалтыг хөтөлнө үү.
          </p>
        </div>
        <form action={deleteClass}>
          <input type="hidden" name="id" value={klass.id} />
          <button
            type="submit"
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Анги устгах
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-zinc-900">Ангийн мэдээлэл</h3>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              title="Засах"
              aria-label="Ангийн мэдээлэл засах"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 space-y-2 text-sm text-zinc-600">
            <p>
              Анги: <span className="font-medium text-zinc-900">{gradeLabel}</span>
            </p>
            <p>
              Бүлэг: <span className="font-medium text-zinc-900">{groupLabel}</span>
            </p>
            <p>
              Анги даасан багш:{" "}
              <span className="text-zinc-900">{homeroomTeacherName}</span>
            </p>
            <p>
              Нийт сурагч:{" "}
              <span className="font-medium text-zinc-900">{roster.length}</span>
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-900">Хуваарилсан багш нар</h3>
          {teachers.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">
              Эхлээд «Хүний нөөц» хуудаснаас багш нэмнэ үү.
            </p>
          ) : (
            <form action={assignTeachersToClass} className="mt-4 space-y-4">
              <input type="hidden" name="classId" value={klass.id} />
              <TeacherAssignmentPicker
                teachers={teachers.map((t) => ({
                  id: t.id,
                  name: teacherDisplayName(t),
                  email: t.email,
                  specialty: t.role,
                }))}
                initialSelectedIds={assignedTeacherIds}
              />
            </form>
          )}
        </section>
      </div>
      <ClassLinkedExamResults
        classId={klass.id}
        classNameLabel={classDisplay}
        students={roster}
        fallbackPastExams={pastExams}
        updateStudentAction={updateStudent}
        removeStudentAction={removeStudent}
      />
    </div>
  );
}
