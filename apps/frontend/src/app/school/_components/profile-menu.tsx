"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut, Mail, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { User } from "@/app/lib/types";

function roleLabel(role: User["role"]) {
  return role === "school_admin" ? "Сургуулийн админ" : "Багш";
}

/** Header profile dropdown — same pattern as `teacher/teacher-shell` */
export function ProfileMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
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

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        aria-expanded={open}
        aria-label="Хэрэглэгчийн цэс"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c8d6ea] bg-white text-[#8a96ac] transition hover:border-[#4f9dff] hover:text-[#4f9dff]"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <UserIcon className="h-5 w-5" />
      </button>

      {open ? (
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
                <p className="mt-1 text-2 text-[#8b97ad]">{roleLabel(user.role)}</p>
              </div>
            </div>
          </div>

          <div className="p-3">
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
