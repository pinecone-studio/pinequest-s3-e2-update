"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, CheckCircle } from "lucide-react";
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

export default function ClassListScreen() {
  const router = useRouter();
  const [addClassOpen, setAddClassOpen] = useState(false);

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4 font-extrabold text-[#1f2a44]">Миний ангиуд</h1>
          <p className="text-4 text-[#64748b]">Үүсгэсэн ангиуд, сурагчдын жагсаалт</p>
        </div>
        <button
          onClick={() => setAddClassOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-4 font-semibold text-white transition hover:bg-teal-700"
          type="button"
        >
          <Plus className="h-5 w-5" />
          Анги нэмэх
        </button>
      </div>

      <section className="rounded-xl border border-[#d9dee8] bg-white p-5">
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
                      <span className="text-[#334261]">{cls.activeExams} идэвхтэй шалгалт</span>
                    </div>
                    <div className="flex items-center gap-2 text-4">
                      <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                      <span className="text-[#334261]">{cls.pagesToGrade} хуудас засах шаардлагатай</span>
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
