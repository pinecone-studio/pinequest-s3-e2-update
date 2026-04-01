"use client";

import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TeacherClassDownloadMenuProps = {
  disabled?: boolean;
  label?: string;
  onExcel: () => void;
  onPdf: () => void;
};

export function TeacherClassDownloadMenu({
  disabled,
  label = "Татах",
  onExcel,
  onPdf,
}: TeacherClassDownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#d9dee8] bg-white px-4 py-2.5 text-3 font-semibold text-[#122459] shadow-sm transition hover:border-[#7DC8FF] hover:bg-[#EDF6FF] disabled:cursor-not-allowed disabled:opacity-50 sm:text-4"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <Download className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
        {label}
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-20 mt-2 min-w-40 rounded-xl border border-[#d9dee8] bg-white p-1 shadow-md" role="menu">
          <button
            className="w-full rounded-lg px-3 py-2 text-left text-3 font-semibold text-[#122459] hover:bg-[#EDF6FF]"
            onClick={() => {
              onExcel();
              setIsOpen(false);
            }}
            role="menuitem"
            type="button"
          >
            Excel татах
          </button>
          <button
            className="w-full rounded-lg px-3 py-2 text-left text-3 font-semibold text-[#122459] hover:bg-[#EDF6FF]"
            onClick={() => {
              onPdf();
              setIsOpen(false);
            }}
            role="menuitem"
            type="button"
          >
            PDF татах
          </button>
        </div>
      ) : null}
    </div>
  );
}
