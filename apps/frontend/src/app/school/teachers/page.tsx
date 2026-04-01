/** @format */

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { removeTeacher } from "@/app/school/action";
import { store } from "@/app/lib/store";
import { AddEmployeeDialog } from "./_components/add-employee-dialog";

export default function AdminTeachersPage() {
  const teachers = store.listTeachers();
  const allClasses = store.listClasses();
  const gradeRangeRegex = /^(?:[6-9]|1[0-2])/;
  const homeroomCandidates = allClasses.filter((c) => gradeRangeRegex.test(c.name));
  const fallbackPool = homeroomCandidates.length > 0 ? homeroomCandidates : allClasses;

  const pickDeterministicIndex = (seed: string, length: number) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return length === 0 ? 0 : hash % length;
  };

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
        <div className="hidden grid-cols-[84px_minmax(240px,1fr)_minmax(220px,1fr)_170px_180px_180px] items-center gap-3 border-b border-zinc-100 bg-zinc-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 lg:grid">
          <div>№</div>
          <div>Овог нэр</div>
          <div>И-мэйл</div>
          <div>Албан тушаал</div>
          <div className="text-center">Даасан анги</div>
          <div className="text-right">Үйлдэл</div>
        </div>

        <ul className="divide-y divide-zinc-100">
          {teachers.map((t, index) => {
            const classItems = store.getClassesForTeacher(t.id);
            const fallbackClass =
              fallbackPool.length > 0
                ? fallbackPool[index % fallbackPool.length]?.name
                : "10А";
            const candidateClasses =
              classItems.length > 0
                ? classItems.filter((c) => gradeRangeRegex.test(c.name))
                : [];
            const selectedPool = candidateClasses.length > 0 ? candidateClasses : classItems;
            const homeroomClass =
              selectedPool.length > 0
                ? selectedPool[pickDeterministicIndex(t.id, selectedPool.length)]?.name
                : fallbackClass;

            return (
              <li key={t.id} className="px-4 py-4 sm:px-6">
                <div className="grid gap-3 lg:grid-cols-[84px_minmax(240px,1fr)_minmax(220px,1fr)_170px_180px_180px] lg:items-center">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-2">
                      {index + 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {t.name}
                    </p>
                  </div>

                  <div className="min-w-0 text-sm text-zinc-600">
                    <p className="truncate">{t.email}</p>
                  </div>

                  <div className="text-sm text-zinc-700">
                    {t.position?.trim() || "Багш"}
                  </div>

                  <div className="text-center text-sm text-zinc-700">{homeroomClass}</div>

                  <div className="flex items-center gap-2 lg:justify-end">
                    <Link
                      href={`/school/teachers/${t.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      title="Засах"
                      aria-label={`${t.name} засах`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={removeTeacher}>
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        type="submit"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50"
                        title="Устгах"
                        aria-label={`${t.name} устгах`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
