/** @format */

"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { removeTeacher } from "@/app/school/action";
import { store } from "@/app/lib/store";
import { AddEmployeeDialog } from "./_components/add-employee-dialog";

export default function AdminTeachersPage() {
  const [search, setSearch] = useState("");
  const teachers = store.listTeachers();
  const allClasses = store.listClasses();
  const gradeRangeRegex = /^(?:[6-9]|1[0-2])/;
  const fallbackClasses = allClasses.filter((c) => gradeRangeRegex.test(c.name));

  const pickDeterministicIndex = (seed: string, length: number) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return length === 0 ? 0 : hash % length;
  };

  const formatNameWithInitial = (fullName: string) => {
    const cleaned = fullName.trim().replace(/\s+/g, " ");
    if (!cleaned) return "-";
    const parts = cleaned.split(" ");
    if (parts.length === 1) return parts[0];
    const lastNameInitial = parts[0].charAt(0).toUpperCase();
    const firstName = parts[parts.length - 1];
    return `${lastNameInitial}.${firstName}`;
  };

  const keyword = search.trim().toLowerCase();
  const filteredTeachers =
    keyword.length === 0
      ? teachers
      : teachers.filter((t) => {
          const position = (t.position?.trim() || "Багш").toLowerCase();
          const name = t.name.toLowerCase();
          return name.includes(keyword) || position.includes(keyword);
        });

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Хүний нөөц</h2>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-zinc-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">
            Бүх ажилтан ({filteredTeachers.length})
          </h3>
          <div className="w-full lg:max-w-md lg:flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Нэр, албан тушаалаар хайх..."
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
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
          {filteredTeachers.map((t, index) => {
            const classItems = store.getClassesForTeacher(t.id);
            const position = t.position?.trim() || "Багш";
            const isTeacherPosition = position.toLowerCase().includes("багш");
            const candidateClasses =
              classItems.length > 0 ? classItems.filter((c) => gradeRangeRegex.test(c.name)) : [];
            const selectedPool = candidateClasses.length > 0 ? candidateClasses : classItems;
            const teacherPool = selectedPool.length > 0 ? selectedPool : fallbackClasses;
            const homeroomClass =
              isTeacherPosition && teacherPool.length > 0
                ? teacherPool[pickDeterministicIndex(t.id, teacherPool.length)]?.name
                : "-";

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
                      {formatNameWithInitial(t.name)}
                    </p>
                  </div>

                  <div className="min-w-0 text-sm text-zinc-600">
                    <p className="truncate">{t.email}</p>
                  </div>

                  <div className="text-sm text-zinc-700">
                    {position}
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
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
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
