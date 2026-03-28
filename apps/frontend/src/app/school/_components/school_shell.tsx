"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, Calculator, Cog, Home } from "lucide-react";
import { ProfileMenu } from "./profile-menu";
import type { User } from "@/app/lib/types";

const links = [
  { href: "/school", label: "Нүүр", icon: Home },
  { href: "/school/teachers", label: "Багш нар", icon: BookText },
  { href: "/school/classes", label: "Ангиуд", icon: BookText },
  { href: "/school/exams", label: "Шалгалт", icon: Calculator },
  { href: "/school/results", label: "Үр дүн", icon: Cog },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/school") return pathname === "/school";
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
    <div className="flex h-screen flex-col bg-[#f7fafc]">
      <header className="sticky top-0 z-40 border-b border-[#e3e7ee] bg-[#fdfdff]">
        <div className="mx-auto grid w-378 max-w-full grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-3 sm:px-10">
          <div className="min-w-0">
            <div className="mt-0.5 flex items-center gap-2">
              <Image
                src="/bee.png"
                alt="UPDATE logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
                priority
              />
              <h1 className="mt-1 truncate text-[20px] font-bold tracking-tight text-[#0f172a]">
                UPDATE
              </h1>
            </div>
          </div>

          <nav
            aria-label="School main navigation"
            className="justify-self-center"
          >
            <ul className="flex flex-row items-center gap-5">
              {links.map((l) => {
                const active = isActive(pathname, l.href);
                const Icon = l.icon;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`inline-flex items-center gap-2 border-b-2 px-1 py-1.5 text-[17px] font-semibold transition-colors ${
                        active
                          ? "border-[#4f9dff] text-[#4f9dff]"
                          : "border-transparent text-[#2f3c59] hover:border-[#4f9dff] hover:text-[#4f9dff]"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-[#4f9dff]" />
                      {l.label}
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
      </header>

      <main className="mx-auto flex w-[1512px] max-w-full flex-1 flex-col px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}

export const AdminShell = SchoolShell;
