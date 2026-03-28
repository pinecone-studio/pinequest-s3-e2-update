/** @format */

import Link from "next/link";
import { createClass } from "@/app/school/action";
import { store } from "@/app/lib/store";
import { teacherLineById } from "@/app/lib/format_teacher";
export default function AdminClassesPage() {
  const classList = store.listClasses();
  const teachers = store.listTeachers();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Ангиуд</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Анги үүсгэж, багш хуваарилаад, сурагчдыг удирдахын тулд ангиа нээнэ
          үү.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-zinc-900">Шинэ анги</h3>
        <form
          action={createClass}
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="block flex-1">
            <span className="text-xs font-medium text-zinc-500">
              Ангийн нэр
            </span>
            <input
              name="name"
              required
              placeholder="жишээ: 12a, 11b"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Үүсгэх
          </button>
        </form>
        {teachers.length === 0 ? (
          <p className="mt-4 text-sm text-amber-700">
            Эхлээд багш нэмээд, дараа нь ангид хуваарилна уу.
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-4">
          <h3 className="text-sm font-semibold text-zinc-900">Бүх анги</h3>
        </div>
        <ul className="divide-y divide-zinc-100">
          {classList.map((c) => {
            const count = store.listStudentsInClass(c.id).length;
            const names = c.teacherIds.map(teacherLineById);
            return (
              <li key={c.id} className="px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-zinc-900">{c.name}</p>
                    <p className="mt-1 text-sm text-zinc-600">
                      {names.length
                        ? `Багш нар: ${names.join(", ")}`
                        : "Багш хуваарилаагүй"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">{count} сурагч</p>
                  </div>
                  <Link
                    href={`/school/classes/${c.id}`}
                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    Сурагчид ба хуваарилалт →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
