import Link from "next/link";
import { store } from "@/app/lib/store";
export default function AdminDashboardPage() {
  const teachers = store.listTeachers();
  const classList = store.listClasses();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">
          Удирдлагын самбар
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Товч харагдац. Багш, сурагчдын жагсаалт болон дэлгэрэнгүйг тухайн
          хуудаснаас нээнэ үү.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-6">
        <section className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-medium text-zinc-900">
              Багш нар
            </h3>
            <Link
              href="/admin/teachers"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Удирдах →
            </Link>
          </div>
          {teachers.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">Одоогоор багш бүртгэгдээгүй.</p>
          ) : (
            <ul className="mt-4 divide-y divide-zinc-100">
              {teachers.map((t) => (
                <li key={t.id} className="first:pt-0 last:pb-0">
                  <Link
                    href={`/admin/teachers/${t.id}`}
                    className="-mx-2 flex flex-row items-center justify-between gap-4 rounded-lg px-2 py-3 transition hover:bg-zinc-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="font-medium text-zinc-900">
                          {t.name}
                        </span>
                        {t.specialty?.trim() ? (
                          <>
                            <span
                              className="text-zinc-400"
                              aria-hidden
                            >
                              ·
                            </span>
                            <span className="text-sm text-teal-700">
                              {t.specialty}
                            </span>
                          </>
                        ) : null}
                      </div>
                      <span className="mt-1 block text-xs text-zinc-400">
                        Дарж орох ангиуд харах
                      </span>
                    </div>
                    <span className="shrink-0 text-sm text-zinc-500">{t.email}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-medium text-zinc-900">
              Ангиуд
            </h3>
            <Link
              href="/admin/classes"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Удирдах →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-zinc-100">
            {classList.map((c) => {
              const studentCount = c.studentIds.length;
              const teacherCount = c.teacherIds.length;
              return (
                <li key={c.id}>
                  <Link
                    href={`/admin/classes/${c.id}`}
                    className="-mx-2 flex flex-row items-center justify-between gap-4 rounded-lg px-2 py-4 transition hover:bg-zinc-50"
                  >
                    <div className="flex min-w-0 flex-1 flex-row flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-semibold text-zinc-900">
                        {c.name}
                      </span>
                      <span className="text-sm text-zinc-500">
                        {teacherCount > 0
                          ? `${teacherCount} багш`
                          : "Багш хуваарилаагүй"}
                        {" · "}
                        {studentCount} сурагч
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-teal-600">
                      Дэлгэрэнгүй →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
