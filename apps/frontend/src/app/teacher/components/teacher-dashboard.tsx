"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ChevronRight, Users } from "lucide-react";
import { store } from "@/app/lib/store";
import { useTeacher } from "../teacher-shell";

export default function TeacherDashboard() {
  const router = useRouter();
  const teacher = useTeacher();
  const classes = store.getClassesForTeacherWithDemo(teacher.id);

  const sortedClasses = useMemo(
    () =>
      [...classes].sort((a, b) =>
        a.name.localeCompare(b.name, "mn", { sensitivity: "base" }),
      ),
    [classes],
  );

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <section>
        <article className="rounded-2xl border border-[#f1e6b9] bg-white p-6 shadow-[0_2px_12px_rgba(113,84,24,0.12)] sm:p-8">
          <header className="mb-6 border-b border-[#f3e1a4] pb-6">
            <h2 className="text-[22px] font-extrabold tracking-tight text-[#3f2d12]">
              Миний ангиуд
            </h2>
            <p className="mt-2 max-w-2xl text-4 leading-relaxed text-[#7a6236]">
              Анги дээр дарж сурагчид, шалгалтын статистик руу орно.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#fff7d6] px-3 py-1.5 text-3 font-semibold text-[#6b4f1d]">
              <span className="text-[#c69b2a]">◆</span>
              Нийт{" "}
              <span className="font-extrabold text-[#3f2d12]">
                {classes.length}
              </span>{" "}
              анги
            </p>
          </header>

          {sortedClasses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#f3e1a4] bg-[#fff9e8] px-6 py-14 text-center">
              <p className="text-4 font-semibold text-[#7a6236]">
                Одоогоор танд харагдах анги алга.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {sortedClasses.map((cls) => {
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
                      className="group flex min-h-[5.5rem] cursor-pointer items-center gap-4 rounded-2xl border border-[#f1e6b9] bg-white p-5 text-left shadow-sm transition hover:border-[#f2d45c] hover:bg-[#fff7d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d45c] focus-visible:ring-offset-2"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff4bf] text-[#c69b2a] transition group-hover:bg-[#f2d45c] group-hover:text-[#5f4517]">
                        <Users className="h-7 w-7" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-5 font-extrabold leading-snug text-[#3f2d12]">
                          {cls.name}
                        </p>
                        <p className="mt-1 text-4 leading-normal text-[#7a6236]">
                          <span className="font-medium text-[#6b4f1d]">
                            {cls.studentIds.length} сурагч
                          </span>
                        </p>
                      </div>
                      <ChevronRight
                        className="h-6 w-6 shrink-0 text-[#d3b672] transition group-hover:translate-x-0.5 group-hover:text-[#c69b2a]"
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
