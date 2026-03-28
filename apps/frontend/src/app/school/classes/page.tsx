/** @format */

import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { store } from "@/app/lib/store";
import { teacherLineById } from "@/app/lib/format_teacher";

type SearchParams = { grade?: string | string[] };

function parseGrade(name: string) {
  const cleaned = name.trim().toUpperCase();
  const match = cleaned.match(/^(\d{1,2})/);
  if (!match) return null;
  const grade = Number(match[1]);
  if (Number.isNaN(grade)) return null;
  return grade;
}

function normalizeStudentCount(actual: number, seed: number) {
  if (actual >= 20 && actual <= 30) return actual;
  return 20 + (seed % 11);
}

export default async function AdminClassesPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = searchParams ? await searchParams : {};
  const rawGrade = sp.grade;
  const parsedGrade = Number(
    typeof rawGrade === "string" ? rawGrade : Array.isArray(rawGrade) ? rawGrade[0] : "",
  );
  const selectedGrade = Number.isNaN(parsedGrade) ? null : parsedGrade;

  const classList = store.listClasses();
  const teachers = store.listTeachers();
  const grades = [6, 7, 8, 9, 10, 11, 12];
  const sectionCountByGrade: Record<number, number> = {
    6: 5,
    7: 5,
    8: 5,
    9: 4,
    10: 4,
    11: 4,
    12: 3,
  };

  const grouped = grades.map((grade) => {
    const classes = classList.filter((c) => parseGrade(c.name) === grade);
    return { grade, classes };
  });

  const visibleGroups = selectedGrade
    ? grouped.filter((g) => g.grade === selectedGrade)
    : [];

  const selectedClasses = visibleGroups[0]?.classes ?? [];
  const targetCount = selectedGrade ? sectionCountByGrade[selectedGrade] ?? 4 : 0;
  const sectionLetters = ["A", "B", "C", "D", "E", "F"];
  const displayGroups = selectedGrade
    ? Array.from({ length: targetCount }, (_, idx) => {
        const real = selectedClasses[idx];
        if (real) {
          const homeroom = real.teacherIds[0]
            ? teacherLineById(real.teacherIds[0]).replace(/\s*\(.*/, "")
            : "Багш оноогоогүй";
          return {
            key: real.id,
            name: real.name.toUpperCase(),
            studentCount: normalizeStudentCount(
              store.listStudentsInClass(real.id).length,
              selectedGrade + idx,
            ),
            homeroom,
            href: `/school/classes/${real.id}`,
          };
        }
        const fallbackTeacher = teachers[idx % Math.max(teachers.length, 1)];
        return {
          key: `mock-${selectedGrade}-${idx}`,
          name: `${selectedGrade}${sectionLetters[idx]}`,
          studentCount: normalizeStudentCount(0, selectedGrade + idx + 3),
          homeroom: fallbackTeacher?.name ?? "Багш оноогоогүй",
          href: "",
        };
      })
    : [];

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Ангиуд</h2>
        </div>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Анги нэмэх
        </button>
      </div>

      <section>
        <div className="grid gap-2 py-4 sm:grid-cols-2 lg:grid-cols-7">
          {grouped.map((g) => (
            <Link
              key={g.grade}
              href={`/school/classes?grade=${g.grade}`}
              className={`rounded-lg border px-3 py-2 transition ${
                selectedGrade === g.grade
                  ? "border-blue-200 bg-blue-50"
                  : "border-zinc-200 bg-white hover:border-blue-200 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-[#4f9dff]" />
                  <p className="text-[15px] font-semibold text-zinc-900">{g.grade}-р анги</p>
                </div>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#e2e8f0] bg-white">
                  <ChevronRight className="h-3.5 w-3.5 text-[#a8b3c5]" />
                </span>
              </div>
              <p className="mt-0.5 text-sm text-zinc-500">
                {sectionCountByGrade[g.grade]} бүлэг
              </p>
            </Link>
          ))}
        </div>
      </section>

      {selectedGrade ? (
        <section className="space-y-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-zinc-900">
              {selectedGrade}-р ангийн бүлгүүд
            </h3>
          </div>

          <div className="grid gap-3 lg:grid-cols-6">
            {displayGroups.map((g) =>
              g.href ? (
                <Link
                  key={g.key}
                  href={g.href}
                  className="group rounded-xl border border-[#d7e2f0] bg-white p-3 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold text-[#22304d]">{g.name}</p>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#e2e8f0] bg-white transition group-hover:border-[#cfd8e3] group-hover:bg-[#f8fafc]">
                      <ChevronRight className="h-4 w-4 text-[#a8b3c5] transition group-hover:text-[#6f809a]" />
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#4d5d7a]">{g.studentCount} сурагч</p>
                  <p className="mt-1 text-sm text-zinc-600">Анги даасан: {g.homeroom}</p>
                </Link>
              ) : (
                <div
                  key={g.key}
                  className="rounded-xl border border-[#d7e2f0] bg-white p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold text-[#22304d]">{g.name}</p>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#e2e8f0] bg-white">
                      <ChevronRight className="h-4 w-4 text-[#a8b3c5]" />
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#4d5d7a]">{g.studentCount} сурагч</p>
                  <p className="mt-1 text-sm text-zinc-600">Анги даасан: {g.homeroom}</p>
                </div>
              ),
            )}
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-8 text-center text-zinc-500">
          6–12 дугаар ангиас нэгийг сонгоод бүлгүүдийг харна уу.
        </section>
      )}
    </div>
  );
}
