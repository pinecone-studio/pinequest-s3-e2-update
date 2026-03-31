"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./profile-menu";
import type { User } from "@/app/lib/types";

const links = [
  { href: "/school", label: "Нүүр" },
  { href: "/school/teachers", label: "Хүний нөөц" },
  { href: "/school/classes", label: "Ангиуд" },
  { href: "/school/exams", label: "Шалгалт" },
  { href: "/school/results", label: "Үр дүн" },
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
        <div className="mx-auto flex h-[70px] w-[1512px] max-w-full items-center justify-between px-[52px]">
          <div className="min-w-0">
            <div className="flex h-14 w-43 items-center gap-[6px] rounded-[20px] pt-[4px] pr-[16px] pb-[8px] pl-[14px]">
              <Image
                src="/bee.png"
                alt="UPDATE logo"
                width={44}
                height={44}
                className="h-10 w-10 object-contain"
                priority
              />
              <h1 className="mt-2 h-6 w-23 text-[22px] font-semibold leading-[100%] tracking-[0px] text-[#171717]">
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
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`inline-flex h-[35px] items-center rounded-[6px]  px-[12px] py-[6px] text-[17px] font-semibold transition-colors ${
                        active
                          ? "border-[#d2cccc] border"
                          : "border-[#d2cccc] hover:border"
                      }`}
                    >
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
