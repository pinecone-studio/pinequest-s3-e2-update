/** @format */

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LogOut, Mail, User as UserIcon } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import type { User } from "@/app/lib/types";

const TeacherContext = createContext<User | null>(null);

export function useTeacher() {
  const teacher = useContext(TeacherContext);
  if (!teacher) {
    throw new Error("useTeacher must be used within <TeacherShell />");
  }
  return teacher;
}

type MenuItem = {
  href: string;
  label: string;
  activePrefixes?: string[];
};

const menuItems: MenuItem[] = [
  {
    href: "/teacher",
    label: "Нүүр хуудас",
    activePrefixes: ["/teacher/class", "/teacher/demo-class"],
  },
  {
    href: "/teacher/question-bank",
    label: "Асуултын сан",
  },
  {
    href: "/teacher/exam",
    label: "Шалгалт",
    activePrefixes: ["/teacher/exam", "/teacher/exam-management"],
  },
  {
    href: "/teacher/exam-optimization",
    label: "Хяналт",
  },
];

function isMenuItemActive(pathname: string, href: string) {
  if (href === "/teacher") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function TeacherShell({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <TeacherContext.Provider value={user}>
      <div className="min-h-screen bg-white text-[#1f2a44]">
        <header className="sticky top-0 z-40 border-b border-[#d9dee8] bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-378 px-4 py-3 lg:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <Link
                  href="/teacher"
                  className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-full outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#7DC8FF] focus-visible:ring-offset-2"
                  aria-label="Нүүр хуудас — багшийн самбар"
                >
                  <Image
                    alt="Зөгий лого"
                    className="object-contain rotate-[12deg]"
                    fill
                    priority
                    src="/bee.png"
                  />
                </Link>
                <div className="min-w-0">
                  <p className="text-5 font-extrabold leading-none tracking-tight">
                    UPDATE
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-auto">
                <nav className="min-w-0 flex w-full flex-nowrap items-center gap-3 overflow-x-auto pb-1 lg:gap-5">
                  {menuItems.map((item) => {
                    const isActive =
                      isMenuItemActive(pathname, item.href) ||
                      item.activePrefixes?.some((prefix) =>
                        isMenuItemActive(pathname, prefix),
                      );
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-1.5 text-3 font-semibold transition-colors lg:px-3.5 ${
                          isActive
                            ? "border-[#d9dee8] bg-[#EDF6FF] text-black"
                            : "border-transparent text-black hover:border-[#d9dee8] hover:bg-[#EDF6FF]"
                        }`}
                      >
                        <span className="text-3 font-semibold lg:text-4">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="relative shrink-0" ref={menuRef}>
                <button
                  aria-expanded={isMenuOpen}
                  aria-label="Хэрэглэгчийн цэс"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#7DC8FF] bg-[#7DC8FF] text-black transition hover:border-[#7DC8FF] hover:text-black"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  type="button"
                >
                  <UserIcon className="h-5 w-5" />
                </button>

                {isMenuOpen ? (
                  <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-[#d9dee8] bg-white shadow-lg">
                    <div className="border-b border-[#e6edf8] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c8d6ea] bg-[#f6faff] text-[#9aa7bd]">
                          <UserIcon className="h-7 w-7" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-4 font-bold text-[#1f2a44]">
                            {user.name}
                          </p>
                          <p className="mt-1 flex min-w-0 items-center gap-1 text-2 text-[#6b7891]">
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="block min-w-0 flex-1 truncate">
                              {user.email || "И-мэйл бүртгэгдээгүй"}
                            </span>
                          </p>
                          <p className="mt-1 text-2 text-[#8b97ad]">Багш</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="mb-2 grid gap-2">
                        <Link
                          className="inline-flex w-full items-center justify-between rounded-xl border border-[#d9e4f1] bg-white px-3 py-2 text-2 font-semibold text-[#314365] transition hover:border-[#9fbef5] hover:text-[#1f6feb]"
                          href="/student"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Сурагчийн хэсэг
                          <span className="text-[#8fa3bf]">/student</span>
                        </Link>
                        <Link
                          className="inline-flex w-full items-center justify-between rounded-xl border border-[#d9e4f1] bg-white px-3 py-2 text-2 font-semibold text-[#314365] transition hover:border-[#9fbef5] hover:text-[#1f6feb]"
                          href="/teacher"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Багшийн хэсэг
                          <span className="text-[#8fa3bf]">/teacher</span>
                        </Link>
                      </div>
                      <button
                        className="inline-flex w-full items-center gap-2 rounded-xl border border-[#ff6b6b]/50 bg-[#ff6b6b]/10 px-3 py-2 text-2 font-semibold text-[#d84e4e] transition hover:bg-[#ff6b6b]/20"
                        type="button"
                        onClick={() => signOut({ redirectUrl: "/" })}
                      >
                        <LogOut className="h-4 w-4" />
                        Гарах
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-378 px-4 py-4 sm:py-6 lg:px-6">
          {children}
        </main>
      </div>
    </TeacherContext.Provider>
  );
}
