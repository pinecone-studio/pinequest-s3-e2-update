"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./profile-menu";
import type { User } from "@/app/lib/types";

const links = [
  { href: "/school", label: "Нүүр" },
  { href: "/school/teachers", label: "Багш нар" },
  { href: "/school/classes", label: "Ангиуд" },
  { href: "/school/exams", label: "Шалгалтууд" },
  { href: "/school/results", label: "Хяналт / Үр дүн" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SchoolShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-[#f7fafc]">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-row flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-8 gap-y-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                School Console
              </p>
              <h1 className="truncate text-base font-bold text-[#0f172a] sm:text-lg">
                UPDATE · Гүн Галуутай сургууль
              </h1>
            </div>

            <nav aria-label="School main navigation" className="min-w-0">
              <ul className="flex flex-row flex-wrap items-center gap-1">
                {links.map((l) => {
                  const active = isActive(pathname, l.href);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                          active
                            ? "bg-[#e9f2ff] text-[#1d4ed8]"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                        }`}
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="shrink-0">
            <ProfileMenu user={user} />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}

export const AdminShell = SchoolShell;
