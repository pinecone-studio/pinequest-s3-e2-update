"use client";

import { useRouter } from "next/navigation";
import { Calendar, Users } from "lucide-react";
import { store } from "@/app/lib/store";
import { useTeacher } from "../teacher-shell";

export default function TeacherDashboard() {
  const router = useRouter();
  const teacher = useTeacher();
  const classes = store.getClassesForTeacher(teacher.id);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      {/* Top 3 summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      </section>

      {/* Main content: Миний ангиуд + Sidebar */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
        {/* Миний ангиуд */}
        <article className="rounded-xl border border-[#d9dee8] bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-4 font-bold text-[#1f2a44]">Миний ангиуд</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {classes.map((cls) => (
              <article
                key={cls.id}
                onClick={() =>
                  router.push(`/teacher/score-calculation/angi?class=${cls.id}`)
                }
                className="flex cursor-pointer flex-col gap-3 rounded-xl border border-[#e2e8f0] p-4 transition hover:border-teal-600/40 hover:bg-[#f8fafc]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-4 font-extrabold text-[#1f2a44]">
                      {cls.name}
                    </p>
                    <p className="text-4 text-[#64748b]">
                      {cls.studentIds.length} сурагч
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        {/* Сүүлийн хийсэн ажил */}
        <article className="rounded-xl border border-[#d9dee8] bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-4 font-bold text-[#1f2a44]">Сүүлийн хийсэн ажил</h2>
          <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4">
            <p className="text-4 font-bold text-[#1f2a44]">Нийгэм — 3-р сар</p>
            <p className="text-4 text-[#64748b]">10А · Нийгэм</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 max-w-[180px] rounded-full bg-[#e2e8f0]">
                <div
                  className="h-2 rounded-full bg-teal-600"
                  style={{ width: `${(14 / 32) * 100}%` }}
                />
              </div>
              <span className="text-4 font-semibold text-[#334261]">14 хуудас</span>
            </div>
            <button
              onClick={() => router.push("/teacher/shalgalt")}
              className="mt-4 rounded-xl bg-teal-600 px-5 py-2.5 text-4 font-semibold text-white transition hover:bg-teal-700"
              type="button"
            >
              Үргэлжлүүлэх
            </button>
          </div>
        </article>

        {/* Гүйцэтгэлийн тойм sidebar - spans both rows */}
        <aside className="lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:self-start">
          <article className="sticky top-24 rounded-xl border border-[#d9dee8] bg-white p-5">
            <h2 className="mb-4 text-4 font-bold text-[#1f2a44]">Гүйцэтгэлийн тойм</h2>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-4 font-semibold text-[#1f2a44]">10А</p>
                  <p className="text-4 font-bold text-[#12b650]">82%</p>
                </div>
                <div className="h-2 w-full rounded-full bg-[#e2e8f0]">
                  <div className="h-2 w-[82%] rounded-full bg-[#12b650]" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-4 font-semibold text-[#1f2a44]">9Б</p>
                  <p className="text-4 font-bold text-[#f59e0b]">74%</p>
                </div>
                <div className="h-2 w-full rounded-full bg-[#e2e8f0]">
                  <div className="h-2 w-[74%] rounded-full bg-[#f59e0b]" />
                </div>
              </div>
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}
