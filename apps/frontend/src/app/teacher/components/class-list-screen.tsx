"use client";

import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { store } from "@/app/lib/store";
import { useTeacher } from "../teacher-shell";

export default function ClassListScreen() {
  const router = useRouter();

  const teacher = useTeacher();
  const classes = store.getClassesForTeacher(teacher.id);

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4 font-extrabold text-[#1f2a44]">Миний ангиуд</h1>
          <p className="text-4 text-[#64748b]">Үүсгэсэн ангиуд, сурагчдын жагсаалт</p>
        </div>
      </div>

      <section className="rounded-xl border border-[#d9dee8] bg-white p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {classes.map((cls) => (
            <article
              key={cls.id}
              onClick={() => router.push("/teacher")}
              className="flex cursor-pointer flex-col gap-3 rounded-xl border border-[#e2e8f0] p-4 transition hover:border-[#4f9dff]/40 hover:bg-[#f8fafc]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-[#4f9dff]">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-4 font-extrabold text-[#1f2a44]">{cls.name}</p>
                  <p className="text-4 text-[#64748b]">{cls.studentIds.length} сурагч</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
