/** @format */

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addStudent,
  assignTeachersToClass,
  deleteClass,
  removeStudent,
  updateClass,
  updateStudent,
} from "@/app/school/action";
import { store } from "@/app/lib/store";

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
  const allClasses = store.listClasses();

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
              Эхлээд «Багш нар» хуудаснаас багш нэмнэ үү.
            </p>
          ) : (
            <form action={assignTeachersToClass} className="mt-4 space-y-4">
              <input type="hidden" name="classId" value={c.id} />
              <ul className="space-y-2">
                {teachers.map((t) => (
                  <li key={t.id}>
                    <label className="flex cursor-pointer flex-wrap items-center gap-3 rounded-lg border border-transparent px-2 py-1 hover:bg-zinc-50">
                      <input
                        type="checkbox"
                        name="teacherIds"
                        value={t.id}
                        defaultChecked={c.teacherIds.includes(t.id)}
                        className="size-4 rounded border-zinc-300"
                      />
                      <span className="text-sm text-zinc-800">
                        {t.name}
                        {t.specialty?.trim() ? (
                          <span className="ml-1.5 font-normal text-blue-700">
                            ({t.specialty})
                          </span>
                        ) : null}
                      </span>
                      <span className="text-xs text-zinc-500">{t.email}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Хуваарилалт хадгалах
              </button>
            </form>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-zinc-900">Сурагч нэмэх</h3>
        <form
          action={addStudent}
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <input type="hidden" name="classId" value={c.id} />
          <label className="block sm:col-span-2">
            <span className="text-xs font-medium text-zinc-500">
              Сурагчийн дугаар
            </span>
            <input
              name="studentNumber"
              required
              placeholder="жишээ: СУ-2001"
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-500">Нэр</span>
            <input name="firstName" required className={field} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-500">Овог</span>
            <input name="lastName" required className={field} />
          </label>
          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Ангид нэмэх
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-4">
          <h3 className="text-sm font-semibold text-zinc-900">
            Сурагчид ({roster.length})
          </h3>
        </div>
        {roster.length === 0 ? (
          <p className="px-6 py-8 text-sm text-zinc-500">
            Одоогоор сурагч алга.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {roster.map((s) => (
              <li key={s.id} className="px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                  <form
                    action={updateStudent}
                    className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
                  >
                    <input type="hidden" name="id" value={s.id} />
                    <label className="block">
                      <span className="text-xs font-medium text-zinc-500">
                        Сурагчийн дугаар
                      </span>
                      <input
                        name="studentNumber"
                        defaultValue={s.studentNumber}
                        className={field}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-zinc-500">
                        Нэр
                      </span>
                      <input
                        name="firstName"
                        defaultValue={s.firstName}
                        className={field}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-zinc-500">
                        Овог
                      </span>
                      <input
                        name="lastName"
                        defaultValue={s.lastName}
                        className={field}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-zinc-500">
                        Анги
                      </span>
                      <select
                        name="classId"
                        defaultValue={s.classId}
                        className={field}
                      >
                        {allClasses.map((cl) => (
                          <option key={cl.id} value={cl.id}>
                            {cl.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="sm:col-span-2 lg:col-span-4">
                      <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Сурагч хадгалах
                      </button>
                    </div>
                  </form>
                  <form action={removeStudent} className="shrink-0">
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="classId" value={c.id} />
                    <button
                      type="submit"
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Хасах
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
