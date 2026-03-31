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
import { Menu, X } from "lucide-react";
import { ProfileMenu } from "@/app/school/_components/profile-menu";
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!mobileNavRef.current) return;
      if (!mobileNavRef.current.contains(event.target as Node)) {
        setMobileNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <TeacherContext.Provider value={user}>
      <div className="flex min-h-screen flex-col bg-[#f7fafc] text-[#1f2a44]">
        <header className="sticky top-0 z-40 h-[70px] border-b border-[#e3e7ee] bg-[#fdfdff]">
          <div className="mx-auto h-full w-full max-w-[94.5rem] px-4 lg:px-10">
            {/* Mobile: compact bar + slide-down nav */}
            <div
              className="relative flex h-full items-center lg:hidden"
              ref={mobileNavRef}
            >
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#cfe8ff] bg-gradient-to-br from-[#eef7ff] via-white to-[#f5f9ff] px-3 py-2.5 shadow-[0_4px_24px_rgba(29,111,235,0.08)]">
                <Link
                  href="/teacher"
                  className="flex min-w-0 items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[#7DC8FF] focus-visible:ring-offset-2 rounded-xl"
                  aria-label="Нүүр хуудас — багшийн самбар"
                >
                  <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
                    <Image
                      alt="Зөгий лого"
                      className="object-contain"
                      fill
                      priority
                      src="/bee.png"
                    />
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5a7aa3]">
                      Багшийн хэсэг
                    </p>
                    <p className="truncate text-4 font-extrabold leading-tight text-[#1f2a44]">
                      UPDATE
                    </p>
                  </div>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    aria-expanded={mobileNavOpen}
                    aria-label={mobileNavOpen ? "Цэс хаах" : "Үндсэн цэс нээх"}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#b8d9f5] bg-white/90 text-[#1f2a44] shadow-sm transition active:scale-[0.98] hover:bg-[#EDF6FF]"
                    onClick={() => setMobileNavOpen((v) => !v)}
                  >
                    {mobileNavOpen ? (
                      <X className="h-6 w-6" strokeWidth={2} />
                    ) : (
                      <Menu className="h-6 w-6" strokeWidth={2} />
                    )}
                  </button>
                  <ProfileMenu user={user} variant="appBar" />
                </div>
              </div>

              {mobileNavOpen ? (
                <nav
                  aria-label="Багшийн навигаци"
                  className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[min(70vh,24rem)] overflow-y-auto rounded-2xl border border-[#d9dee8] bg-white p-2 shadow-xl"
                >
                  <ul className="flex flex-col gap-1">
                    {menuItems.map((item) => {
                      const isActive =
                        isMenuItemActive(pathname, item.href) ||
                        item.activePrefixes?.some((prefix) =>
                          isMenuItemActive(pathname, prefix),
                        );
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            className={`block rounded-xl px-4 py-3.5 text-3 font-semibold transition ${
                              isActive
                                ? "bg-[#EDF6FF] text-[#1f2a44] ring-1 ring-[#7DC8FF]/40"
                                : "text-[#1f2a44] hover:bg-[#f4f8fc]"
                            }`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              ) : null}
            </div>

            <div className="hidden h-[70px] items-center justify-between lg:flex">
							<div className="min-w-0">
								<Link
									href="/teacher"
									className="flex items-center gap-[10px] rounded-[20px] px-[14px] py-[6px] outline-none focus-visible:ring-2 focus-visible:ring-[#7DC8FF] focus-visible:ring-offset-2"
									aria-label="Багшийн нүүр рүү очих"
								>
									<Image
										src="/bee.png"
										alt="UPDATE logo"
										width={44}
                    height={44}
                    className="h-10 w-10 object-contain"
                    priority
                  />
									<h1 className="text-[22px] mt-2 font-extrabold leading-[100%] tracking-tight text-[#1d1f24]">
										UPDATE
									</h1>
								</Link>
							</div>

              <nav
                aria-label="Багшийн навигаци"
                className="justify-self-center"
              >
                <ul className="flex flex-row items-center gap-[50px]">
                  {menuItems.map((item) => {
                    const isActive =
                      isMenuItemActive(pathname, item.href) ||
                      item.activePrefixes?.some((prefix) =>
                        isMenuItemActive(pathname, prefix),
                      );
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`inline-flex h-[35px] items-center rounded-[6px] px-[6px] py-[6px] text-[17px] font-semibold text-[#262626] transition-colors gap-15 ${
                            isActive
                              ? "border border-[#d2cccc]"
                              : "border border-transparent hover:border-[#d2cccc]"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="justify-self-end">
                <ProfileMenu user={user} />
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
