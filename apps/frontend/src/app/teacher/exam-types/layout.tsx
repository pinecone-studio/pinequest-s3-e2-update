"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ExamFlowProvider } from "./shared/store";

const navItems = [
  { href: "/teacher/exam-types/question-bank", label: "1. Асуултын сан" },
  { href: "/teacher/exam-types/exam-builder", label: "2. Шалгалт үүсгэгч" },
  { href: "/teacher/exam-types/student-exam", label: "3. Сурагчийн шалгалт" },
  { href: "/teacher/exam-types/results", label: "4. Үр дүн" },
];

export default function ExamTypesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ExamFlowProvider>
      <section className="px-6 py-7 lg:px-8">
        <div className="mx-auto max-w-[1500px] space-y-4">
          <div className="rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-7 font-extrabold text-[#1f2a44]">
                  Шалгалтын Олон Төрлийн Асуулт
                </h1>
                <p className="text-3 text-[#5c6f91]">
                  End-to-End Exam System MVP демо урсгал
                </p>
              </div>
              <Link
                className="rounded-xl border border-[#d9e6fb] bg-[#f5f9ff] px-3 py-2 text-3 font-semibold text-[#335c96]"
                href="/teacher/exam-types"
              >
                Нүүр тойм
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-4">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    className={`rounded-xl border px-3 py-2 text-3 font-semibold transition ${
                      active
                        ? "border-[#4f9dff] bg-[#4f9dff] text-white"
                        : "border-[#d9e6fb] bg-[#f7fbff] text-[#334f7b] hover:bg-[#eef6ff]"
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {children}
        </div>
      </section>
    </ExamFlowProvider>
  );
}
