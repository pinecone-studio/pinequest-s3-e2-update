/** @format */

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { createTeacher, removeTeacher } from "@/app/school/action";
import { store } from "@/app/lib/store";

const inputClass =
  "mt-1 w-full min-w-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm";

const labelClass = "block min-w-0 text-xs font-medium text-zinc-600";

export default function AdminTeachersPage() {
  const teachers = store.listTeachers();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Багш нар</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Багш нэмэх, засах, хасах. Мэргэжил, заадаг хичээлийг (жишээ нь:
          Нийгэм, Математик) заавал биш ч жагсаалтад харагдана. Хасагдсан багш
          бүх ангийн хуваарилалтас автоматаар авна.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-zinc-900">Багш нэмэх</h3>
        <form
          action={createTeacher}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:items-end"
        >
          <label className={labelClass}>
            Нэр
            <input
              name="name"
              required
              placeholder="Бүтэн нэр"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Цахим шуудан (сонголттой)
            <input
              name="email"
              type="email"
              placeholder="ner@sur.mn"
              className={inputClass}
            />
          </label>
          <label className={`${labelClass} sm:col-span-2 xl:col-span-1`}>
            Мэргэжил / хичээл
            <input
              name="specialty"
              placeholder="жишээ: Нийгэм, Математик"
              className={inputClass}
            />
          </label>
          <div className="flex items-end xl:col-span-1">
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
            >
              Нэмэх
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-4">
          <h3 className="text-sm font-semibold text-zinc-900">
            Бүх багш ({teachers.length})
          </h3>
        </div>
        <ul className="divide-y divide-zinc-100">
          {teachers.map((t) => (
            <li key={t.id} className="px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {t.name}
                    </p>
                    <Link
                      href={`/school/teachers/${t.id}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      title="Засах"
                      aria-label={`${t.name} засах`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={removeTeacher}>
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        type="submit"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50"
                        title="Устгах"
                        aria-label={`${t.name} устгах`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">{t.email || "-"}</p>
                  <p className="text-sm text-zinc-500">
                    {t.specialty?.trim() || "Мэргэжил оруулаагүй"}
                  </p>
                </div>

                <Link
                  href={`/school/teachers/${t.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Орох ангиуд харах ({store.getClassesForTeacher(t.id).length})
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
