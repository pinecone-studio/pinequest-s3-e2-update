"use client";

import { useClerk } from "@clerk/nextjs";
import {
  Building2,
  Camera,
  GraduationCap,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { User } from "@/app/lib/types";

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
        className="inline-flex h-[42px] w-[40px] items-center justify-center rounded-[12px] bg-[#7DC8FF] p-[8px] text-[#0f172a] transition hover:bg-[#68b8f8]"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <UserIcon className="h-8 w-8" />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[362px] max-w-[calc(100vw-1rem)] rounded-[14px] border border-[#d7e6f7] bg-[#EDF6FF] px-[38px] pt-[16px] pb-[16px] shadow-xl">
          <p className="text-center text-[12px] font-medium text-[#182b66]">
            {user.email || "profile@update.mn"}
          </p>

          <div className="mt-4 flex justify-center">
            <div className="relative">
              <div className="flex h-22 w-22 items-center justify-center rounded-full border-4 border-[#1d7ff2] bg-white text-[#1d7ff2]">
                <UserIcon className="h-10 w-10" />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#eaf4ff] bg-white text-[#1b3170]"
                aria-label="Зураг солих"
                title="Зураг солих"
              >
                <Camera className=" h-3 w-3" />
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-[16px] font-bold tracking-wide text-[#182b66]">
            Сайн байна уу, Багшаа
          </p>

          <div className="mt-5 w-[286px] space-y-[8px]">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-[10px] rounded-[8px] border border-[#0081FF] bg-transparent px-[20px] py-[8px] text-[16px] font-medium text-[#182b66]"
            >
              Сургууль
            </button>
            <div className="grid grid-cols-2 gap-[8px]">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-[10px] rounded-[8px] border border-[#0081FF] px-[20px] py-[8px] text-[14px] font-medium text-[#182b66]"
              >
                Багш
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-[10px] rounded-[8px] border border-[#0081FF] px-[20px] py-[8px] text-[14px] font-medium text-[#182b66]"
              >
                Сурагч
              </button>
            </div>
            <button
              className="inline-flex w-full items-center justify-center gap-[10px] rounded-[8px] border border-[#e55656] bg-[#f8ecf1] px-[20px] py-[8px] text-[14px] font-semibold text-[#d92f2f] transition hover:bg-[#f7e2ea]"
              type="button"
              onClick={() => {
                setOpen(false);
                signOut({ redirectUrl: "/" });
              }}
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
