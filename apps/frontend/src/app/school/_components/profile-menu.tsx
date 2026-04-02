/** @format */

"use client";

import { useClerk } from "@clerk/nextjs";
import { Camera, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { User } from "@/app/lib/types";

function roleLabel(role: User["role"]) {
  return role === "school_admin" ? "Сургуулийн админ" : "Багш";
}

/** Header profile dropdown — same pattern as `teacher/teacher-shell` */
export function ProfileMenu({
  user,
  variant = "default",
}: {
  user: User;
  /** Mobile app bar — багшийн shell-тай ижил дөрвөлжин товч */
  variant?: "default" | "appBar" | "onDark";
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const { signOut } = useClerk();

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const triggerClass =
    variant === "appBar"
      ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#7DC8FF] bg-[#7DC8FF] text-black shadow-sm transition active:scale-[0.98] hover:opacity-95 sm:h-11 sm:w-11"
      : variant === "onDark"
        ? "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white transition hover:bg-white/20 hover:border-white/50"
        : "inline-flex h-[42px] w-[40px] items-center justify-center rounded-[12px] border border-blue-300 p-[8px] text-[#0f172a] transition hover:bg-[#68b8f8]";
  const roleButtonClass = (isActive: boolean) =>
    `inline-flex items-center justify-center gap-[10px] rounded-[8px] border border-[#0081FF] px-[20px] py-[8px] font-medium text-[#182b66] transition ${
      isActive ? "bg-[#29A4FF] text-white" : "bg-white"
    }`;
  const isSchool = pathname === "/school" || pathname.startsWith("/school/");
  const isTeacher = pathname === "/teacher" || pathname.startsWith("/teacher/");
  const isStudent = pathname.startsWith("/student/");

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        aria-expanded={open}
        aria-label="Хэрэглэгчийн цэс"
        className={triggerClass}
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <UserIcon className="h-5 w-5" />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[362px] max-w-[calc(100vw-1rem)] rounded-[14px] border border-[#d7e6f7] bg-[#EDF6FF] px-[38px] pt-[12px] pb-[12px] shadow-xl">
          <p className="text-center text-[13px] font-medium text-[#182b66]">
            {user.email || "profile@update.mn"}
          </p>

          <div className="mt-4 flex justify-center">
            <div className="relative">
              <div className="flex h-22 w-22 items-center justify-center rounded-full border-1 border-[#1d7ff2] bg-white text-[#1d7ff2]">
                <UserIcon className="h-10 w-10" />
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[18px] font-bold tracking-wide text-[#182b66]">
            Сайн байна уу, Багшаа
          </p>

          <div className="mt-3 w-[286px] space-y-[8px] text-[#122459]">
            <Link
              href="/school"
              onClick={() => setOpen(false)}
              className={`${roleButtonClass(isSchool)} w-full text-[16px]`}
            >
              Сургууль
            </Link>
            <div className="grid grid-cols-2 gap-[8px]">
              <Link
                href="/teacher"
                onClick={() => setOpen(false)}
                className={`${roleButtonClass(isTeacher)} text-[15px]`}
              >
                Багш
              </Link>
              <Link
                href="/"
                title="Шалгалтын холбоосоор /student/шалгалтын-ID хуудас руу ороорой"
                onClick={() => setOpen(false)}
                className={`${roleButtonClass(isStudent)} text-[15px]`}
              >
                Сурагч
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
  );
}
