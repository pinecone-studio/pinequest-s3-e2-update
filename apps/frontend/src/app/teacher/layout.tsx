"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BookText,
  Calculator,
  Cog,
  Database,
  Home,
  MonitorCheck,
  Users,
} from "lucide-react";

const menuItems = [
  { href: "/teacher", label: "Нүүр хуудас", icon: Home },
  {
    href: "/teacher/exam-types",
    label: "Шалгалтын олон төрлийн асуулт",
    icon: BookText,
  },
  {
    href: "/teacher/score-calculation",
    label: "Шалгалтын дүн тооцоолох",
    icon: Calculator,
  },
  {
    href: "/teacher/exam-optimization",
    label: "Шалгалтын зохион байгуулалтын оновчлол",
    icon: Cog,
  },
  {
    href: "/teacher/content-management",
    label: "Асуултын сан ба контентийн менежмент",
    icon: Database,
  },
  {
    href: "/teacher/multi-user",
    label: "Олон хэрэглэгчтэй орчны шийдэл",
    icon: Users,
  },
  {
    href: "/teacher/progress-monitor",
    label: "Шалгалтын явцын хяналт",
    icon: MonitorCheck,
  },
];

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-teal-50 text-[#1f2a44]">
      <div className="flex min-h-screen">
        <aside className="flex w-[320px] shrink-0 flex-col border-r border-[#d9dee8] bg-white">
          <div className="border-b border-[#e5eaf2] p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-md">
                <BookText className="h-8 w-8" />
              </div>
              <div>
                <p className="text-6 font-extrabold leading-tight">UPDATE</p>
                <p className="text-3 text-[#6b7289]">Боловсролын платформ</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1 p-4">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/teacher" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-full px-4 py-3 transition ${
                    isActive
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-[#2f3c59] hover:bg-[#f1f5fb]"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? "text-white" : "text-teal-600"}`}
                  />
                  <span className=" font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-2">
            <div className="rounded-full bg-[#f3f5f8] px-1 py-2 text-center text-3 font-semibold text-[#606c84]">
              Сургуулийн автоматжуулалтын шийдэл
            </div>
          </div>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
