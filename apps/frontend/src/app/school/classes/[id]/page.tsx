/** @format */

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  assignTeachersToClass,
  deleteClass,
  removeStudent,
  updateClass,
  updateStudent,
} from "@/app/school/action";
import { getPastExamsForClass } from "@/app/lib/class-past-exams-mock";
import { store } from "@/app/lib/store";
import { ClassLinkedExamResults } from "./_components/class-linked-exam-results";
import { TeacherAssignmentPicker } from "./_components/teacher-assignment-picker";

const field =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900";

export default async function AdminClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = store.getClass(id);
  if (!c) notFound();

  const teachers = store.listTeachers();
  const roster = store.listStudentsInClass(c.id);
  const pastExams = getPastExamsForClass(c.id, roster);
  const homeroomTeacherName =
    c.teacherIds
      .map((teacherId) => teachers.find((teacher) => teacher.id === teacherId)?.name)
      .find(Boolean) ?? "-";

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
        <Link href="/school/classes" className="hover:text-blue-600">
          Ангиуд
        </Link>
        <span aria-hidden>/</span>
        <span className="text-zinc-900">{c.name}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">{c.name}</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Багш нарыг хуваарилаж, сурагчдын жагсаалтыг хөтөлнө үү.
          </p>
        </div>
        <form action={deleteClass}>
          <input type="hidden" name="id" value={c.id} />
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
          <h3 className="text-sm font-semibold text-zinc-900">Ангийн нэр</h3>
          <div className="mt-3 space-y-1 text-sm text-zinc-600">
            <p>
              <span className="font-medium text-zinc-800">{c.name}</span> даасан багш:{" "}
              <span className="text-zinc-900">{homeroomTeacherName}</span>
            </p>
            <p>
              Нийт сурагч: <span className="font-medium text-zinc-900">{roster.length}</span>
            </p>
          </div>
          <form
            action={updateClass}
            className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <input type="hidden" name="id" value={c.id} />
            <label className="block min-w-0 flex-1">
              <span className="text-xs font-medium text-zinc-500">Нэр</span>
              <input
                name="name"
                required
                defaultValue={c.name}
                className={field}
              />
            </label>
            <button
              type="submit"
              className="rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
            >
              Нэр өөрчлөх
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-900">
            Хуваарилсан багш нар
          </h3>
          {teachers.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">
              Эхлээд «Хүний нөөц» хуудаснаас багш нэмнэ үү.
            </p>
          ) : (
            <form action={assignTeachersToClass} className="mt-4 space-y-4">
              <input type="hidden" name="classId" value={c.id} />
              <TeacherAssignmentPicker
                teachers={teachers.map((t) => ({
                  id: t.id,
                  name: t.name,
                  email: t.email,
                  specialty: t.specialty,
                }))}
                initialSelectedIds={c.teacherIds}
              />
            </form>
          )}
        </section>
      </div>

      <ClassLinkedExamResults
        classId={c.id}
        classNameLabel={c.name}
        students={roster}
        fallbackPastExams={pastExams}
        updateStudentAction={updateStudent}
        removeStudentAction={removeStudent}
      />

    </div>
  );
}
