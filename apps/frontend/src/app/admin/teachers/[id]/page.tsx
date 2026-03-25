import Link from "next/link";
import { notFound } from "next/navigation";
import { store } from "@/app/lib/store";
import { TeacherExamScheduleSection } from "./_components/TeacherExamScheduleSection";
import { examSchedulesMock } from "./_mock/exam-schedules";

export default async function AdminTeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = store.getUser(id);
  if (!user || user.role !== "teacher") notFound();

  const classes = store.getClassesForTeacher(id);
  const schedules = examSchedulesMock.listByTeacher(id);
  const classOptions = classes.map((item) => item.name);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
        <Link href="/admin/teachers" className="hover:text-teal-600">
          Багш нар
        </Link>
        <span aria-hidden>/</span>
        <span className="text-zinc-900">{user.name}</span>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">{user.name}</h1>
        <p className="mt-1 text-sm text-zinc-600">{user.email}</p>
        {user.specialty?.trim() ? (
          <p className="mt-2 text-sm font-medium text-teal-700">
            Мэргэжил / хичээл: {user.specialty}
          </p>
        ) : null}
      </div>

      <TeacherExamScheduleSection
        teacherId={id}
        schedules={schedules}
        classOptions={classOptions}
      />

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">
            Орох ангиуд ({classes.length})
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Энэ багшийг эдгээр ангид хуваарилсан байна. Дэлгэрэнгүйд дарна уу.
          </p>
        </div>
        {classes.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-zinc-500">
            Одоогоор анги хуваарилаагүй. «Ангиуд» хуудаснаас хуваарилна уу.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {classes.map((c) => {
              const count = store.listStudentsInClass(c.id).length;
              return (
                <li key={c.id} className="px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <Link
                        href={`/admin/classes/${c.id}`}
                        className="font-medium text-zinc-900 hover:text-teal-600"
                      >
                        {c.name}
                      </Link>
                      <p className="mt-1 text-sm text-zinc-500">
                        {count} сурагч
                      </p>
                    </div>
                    <Link
                      href={`/admin/classes/${c.id}`}
                      className="shrink-0 text-sm font-medium text-teal-600 hover:text-teal-700"
                    >
                      Анги нээх →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
