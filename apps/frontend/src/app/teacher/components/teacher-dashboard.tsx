"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Calendar, Plus, CheckCircle } from "lucide-react";
import AddClassDialog from "./add-class-dialog";

const MY_CLASSES = [
  {
    id: "10A",
    name: "10А",
    subject: "Нийгэм",
    studentCount: 5,
    status: "pending" as const,
    activeExams: 1,
    pagesToGrade: 12,
  },
  {
    id: "9B",
    name: "9Б",
    subject: "Нийгэм",
    studentCount: 4,
    status: "done" as const,
  },
];

export default function TeacherDashboard() {
  const router = useRouter();
  const [addClassOpen, setAddClassOpen] = useState(false);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      {/* Top 3 summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-xl border-l-4 border-l-[#f59e0b] border border-[#d9dee8] bg-white p-4">
          <p className="text-4 font-semibold text-[#1f2a44]">18 шалгалт засах шаардлагатай</p>
          <button
            onClick={() => router.push("/teacher/shalgalt")}
            className="mt-3 rounded-xl bg-teal-600 px-4 py-2 text-4 font-semibold text-white transition hover:bg-teal-700"
            type="button"
          >
            Засах
          </button>
        </article>

        <article className="rounded-xl border border-[#d9dee8] bg-white p-4">
          <div className="space-y-2">
            <p className="text-4 font-semibold text-[#64748b]">56% шалгасан</p>
            <div className="h-2 w-full rounded-full bg-[#e2e8f0]">
              <div className="h-2 w-[56%] rounded-full bg-teal-600" />
            </div>
            <p className="text-4 text-[#64748b]">44% хуудсууд үлдсэн</p>
            <p className="text-4 font-semibold text-[#334261]">18 / 32 нийт оруулсан хуудсууд</p>
          </div>
        </article>

        <article className="rounded-xl border border-[#d9dee8] bg-white p-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-6 w-6 shrink-0 text-teal-600" />
            <div>
              <p className="text-4 font-semibold text-[#1f2a44]">
                Энэ 7 хоногт 3 сорилт шалгасан
              </p>
              <p className="mt-1 text-4 text-[#64748b]">3 шалгалт энэ 7 хоногт</p>
            </div>
          </div>
        </article>
      </section>

      {/* Main content: Миний ангиуд + Sidebar */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
        {/* Миний ангиуд */}
        <article className="rounded-xl border border-[#d9dee8] bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-4 font-bold text-[#1f2a44]">Миний ангиуд</h2>
            <button
              onClick={() => setAddClassOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-4 font-semibold text-white transition hover:bg-teal-700"
              type="button"
            >
              <Plus className="h-5 w-5" />
              Нэмэх анги
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {MY_CLASSES.map((cls) => (
                <article
                  key={cls.id}
                  onClick={() => router.push(`/teacher/angi?class=${cls.id}`)}
                  className="flex cursor-pointer flex-col gap-3 rounded-xl border border-[#e2e8f0] p-4 transition hover:border-teal-600/40 hover:bg-[#f8fafc]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-4 font-extrabold text-[#1f2a44]">{cls.name}</p>
                      <p className="text-4 text-[#64748b]">
                        {cls.subject} · {cls.studentCount} сурагч
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {cls.status === "pending" && (
                      <>
                        <div className="flex items-center gap-2 text-4">
                          <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                          <span className="text-[#334261]">
                            {cls.activeExams} идэвхтэй шалгалт
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-4">
                          <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                          <span className="text-[#334261]">
                            {cls.pagesToGrade} хуудас засах шаардлагатай
                          </span>
                        </div>
                      </>
                    )}
                    {cls.status === "done" && (
                      <div className="flex items-center gap-2 text-4 text-[#12b650]">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Ажил бүгд дууссан</span>
                      </div>
                    )}
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

      <AddClassDialog
        open={addClassOpen}
        onClose={() => setAddClassOpen(false)}
        onSubmit={(data) => {
          console.log("Анги нэмэх:", data);
          setAddClassOpen(false);
        }}
      />
    </main>
  );
}
