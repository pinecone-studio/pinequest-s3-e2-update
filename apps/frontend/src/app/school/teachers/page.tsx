/** @format */

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { removeTeacher } from "@/app/school/action";
import { store } from "@/app/lib/store";
import { AddEmployeeDialog } from "./_components/add-employee-dialog";

export default function AdminTeachersPage() {
  const teachers = store.listTeachers();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Хүний нөөц</h2>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4">
          <h3 className="text-sm font-semibold text-zinc-900">
            Бүх ажилтан ({teachers.length})
          </h3>
          <AddEmployeeDialog />
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
                  <p className="mt-1 text-sm text-zinc-500">
                    {t.specialty?.trim() || "-"}
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
