"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type TeacherClassAddStudentDialogProps = {
  initialName: string;
  onClose: () => void;
  open: boolean;
};

export function TeacherClassAddStudentDialog({
  initialName,
  onClose,
  open,
}: TeacherClassAddStudentDialogProps) {
  const [firstName, setFirstName] = useState(initialName);
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [studentClass, setStudentClass] = useState("");

  useEffect(() => {
    if (!open) return;
    setFirstName(initialName);
    setLastName("");
    setEmail("");
    setStudentClass("");
  }, [initialName, open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/55 px-4"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="w-full max-w-[766px] rounded-[6px] border border-[#e5e7eb] bg-white px-[30px] py-[50px] shadow-[0_25px_80px_-12px_rgba(15,23,42,0.32)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative">
          <div className="mx-auto max-w-[360px] text-center">
            <h3 className="text-[20px] font-medium leading-none text-[#262626]">
              Сурагч бүртгүүлэх
            </h3>
            <p className="mt-4 text-[16px] text-[#a3a3a3]">
              Шалгалтад оролцохын тулд бүртгэл үүсгэнэ.
            </p>
          </div>
          <div className="absolute right-[86px] top-1/2 hidden -translate-y-1/2 md:block">
            <Image
              alt="UPDATE bee"
              className="h-auto w-[72px]"
              height={72}
              src="/bee-idea-bulb.png"
              width={72}
            />
          </div>
        </div>

        <div className="mt-12 grid gap-x-[60px] gap-y-[26px] md:grid-cols-2">
          <label className="block">
            <input
              className="h-12 w-full rounded-[10px] border border-[#a3a3a3] px-4 text-[16px] text-[#262626] outline-none transition placeholder:text-[#a3a3a3] focus:border-[#7DC8FF]"
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Нэр"
              type="text"
              value={firstName}
            />
          </label>

          <label className="block">
            <input
              className="h-12 w-full rounded-[10px] border border-[#a3a3a3] px-4 text-[16px] text-[#262626] outline-none transition placeholder:text-[#a3a3a3] focus:border-[#7DC8FF]"
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Овог"
              type="text"
              value={lastName}
            />
          </label>

          <label className="block">
            <input
              className="h-12 w-full rounded-[10px] border border-[#a3a3a3] px-4 text-[16px] text-[#262626] outline-none transition placeholder:text-[#a3a3a3] focus:border-[#7DC8FF]"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="И-мэйл оруулах"
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <input
              className="h-12 w-full rounded-[10px] border border-[#a3a3a3] px-4 text-[16px] text-[#262626] outline-none transition placeholder:text-[#a3a3a3] focus:border-[#7DC8FF]"
              onChange={(event) => setStudentClass(event.target.value)}
              placeholder="Анги оруулах"
              type="text"
              value={studentClass}
            />
          </label>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            className="min-w-[228px] rounded-[10px] bg-[#B8DCFF] px-6 py-3 text-[16px] font-medium text-white transition hover:bg-[#a8d3ff]"
            type="button"
          >
            Үргэлжлүүлэх
          </button>
        </div>
      </div>
    </div>
  );
}
