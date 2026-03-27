"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronRight, Search, Users } from "lucide-react";
import { store } from "@/app/lib/store";
import { TEACHER_DEMO_CLASS_ID } from "@/app/lib/teacher-demo-class";
import { useTeacher } from "../teacher-shell";

export default function TeacherDashboard() {
  const router = useRouter();
  const teacher = useTeacher();
  const classes = store.getClassesForTeacherWithDemo(teacher.id);
  const [query, setQuery] = useState("");

  const filteredClasses = useMemo(() => {
    const sorted = [...classes].sort((a, b) =>
      a.name.localeCompare(b.name, "mn", { sensitivity: "base" }),
    );
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((c) => c.name.toLowerCase().includes(q));
  }, [classes, query]);

  const showSearch = classes.length > 1;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <section>
        <article className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-[0_2px_12px_rgba(31,42,68,0.06)] sm:p-8">
          <header className="mb-6 border-b border-[#eef2f6] pb-6">
            <h2 className="text-[22px] font-extrabold tracking-tight text-[#1f2a44]">
              Миний ангиуд
            </h2>
            <p className="mt-2 max-w-2xl text-4 leading-relaxed text-[#64748b]">
              Анги дээр дарж сурагчид, шалгалтын статистик руу орно.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#f6faff] px-3 py-1.5 text-3 font-semibold text-[#4a5875]">
              <span className="text-[#4f9dff]">◆</span>
              Нийт{" "}
              <span className="font-extrabold text-[#1f2a44]">
                {classes.length}
              </span>{" "}
              анги
            </p>
          </header>

          {showSearch ? (
            <div className="relative mb-6">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a96ac]"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ангийн нэрээр хайх..."
                className="w-full rounded-xl border border-[#d9dee8] bg-[#fafbfd] py-3 pl-11 pr-4 text-4 text-[#1f2a44] shadow-inner outline-none transition placeholder:text-[#94a3b8] focus:border-[#4f9dff] focus:bg-white focus:ring-4 focus:ring-[#4f9dff]/15"
                aria-label="Ангийн нэрээр хайх"
              />
            </div>
          ) : null}

          {filteredClasses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-6 py-14 text-center">
              <p className="text-4 font-semibold text-[#475569]">
                {query.trim()
                  ? "Хайлтад тохирох анги олдсонгүй."
                  : "Одоогоор танд харагдах анги алга."}
              </p>
              {query.trim() ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-4 text-4 font-semibold text-[#4f9dff] hover:underline"
                >
                  Хайлт цэвэрлэх
                </button>
              ) : null}
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {filteredClasses.map((cls) => {
                const isDemo = cls.id === TEACHER_DEMO_CLASS_ID;
                const openClass = () =>
                  router.push(`/teacher/class/${encodeURIComponent(cls.id)}`);
                return (
                  <li key={cls.id}>
                    <article
                      role="button"
                      tabIndex={0}
                      onClick={openClass}
                      onKeyDown={(e) => {
                        if (e.key !== "Enter" && e.key !== " ") return;
                        e.preventDefault();
                        openClass();
                      }}
                      className="group flex min-h-[5.5rem] cursor-pointer items-center gap-4 rounded-2xl border border-[#e8ecf2] bg-[#fafbfd] p-5 text-left shadow-sm transition hover:border-[#4f9dff]/45 hover:bg-[#f6faff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f9dff] focus-visible:ring-offset-2"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#4f9dff] transition group-hover:bg-[#4f9dff] group-hover:text-white">
                        <Users className="h-7 w-7" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-5 font-extrabold leading-snug text-[#1f2a44]">
                          {cls.name}
                        </p>
                        <p className="mt-1 text-4 leading-normal text-[#64748b]">
                          <span className="font-medium text-[#4a5875]">
                            {cls.studentIds.length} сурагч
                          </span>
                          {isDemo ? (
                            <span className="text-[#4f9dff]">
                              {" "}
                              · жишээ анги
                            </span>
                          ) : null}
                        </p>
                      </div>
                      <ChevronRight
                        className="h-6 w-6 shrink-0 text-[#b8c4d6] transition group-hover:translate-x-0.5 group-hover:text-[#4f9dff]"
                        aria-hidden
                      />
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </article>
      </section>
    </main>
  );
}
