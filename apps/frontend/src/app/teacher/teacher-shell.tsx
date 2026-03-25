"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, type ReactNode } from "react";
import {
  BookText,
  Calculator,
  Cog,
  Home,
} from "lucide-react";
import { LogoutButton } from "@/app/admin/_components/logout";
import type { User } from "@/app/lib/types";

const TeacherContext = createContext<User | null>(null);

export function useTeacher() {
  const teacher = useContext(TeacherContext);
  if (!teacher) {
    throw new Error("useTeacher must be used within <TeacherShell />");
  }
  return teacher;
}

const menuItems = [
  { href: "/teacher", label: "Нүүр хуудас", icon: Home },
  {
    href: "/teacher/exam-types",
    label: "Шалгалтын нэгдсэн сан",
    icon: BookText,
  },
  {
    href: "/teacher/score-calculation",
    label: "Шалгалтын дүн",
    icon: Calculator,
  },
  {
    href: "/teacher/exam-optimization",
    label: "Шалгалтын хяналт",
    icon: Cog,
  }
];

export default function TeacherShell({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <TeacherContext.Provider value={user}>
      <div className="min-h-screen bg-teal-50 text-[#1f2a44]">
        <header className="sticky top-0 z-40 border-b border-[#d9dee8] bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-[1400px] px-4 py-3 lg:px-6">
            <div className="flex items-center gap-8 justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-md">
                  <BookText className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-5 font-extrabold leading-tight">UPDATE</p>
                  <p className="mt-1 truncate text-3 font-medium text-[#334261]">
                    {user.name}
                  </p>
                </div>
              </div>
            <div>
              <nav className="min-w-0 flex-1 flex flex-nowrap items-center gap-3 overflow-x-auto pb-1">
                {menuItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/teacher" &&
                      pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center gap-2 rounded-full whitespace-nowrap transition ${
                        isActive
                          ? "bg-teal-600 px-4 py-1.5 text-white shadow-sm"
                          : "px-2 py-0.5 text-[#2f3c59] hover:bg-transparent hover:text-teal-700"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-white" : "text-teal-600"
                        }`}
                      />
                      <span className="text-3 font-semibold lg:text-4">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
             </div>
              <div className="flex-shrink-0">
                <LogoutButton />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-6">
          {children}
        </main>
        <div className="pb-6 text-center text-3 font-semibold text-[#606c84]">
          Сургуулийн автоматжуулалтын шийдэл
        </div>
      </div>
    </TeacherContext.Provider>
  );
}
