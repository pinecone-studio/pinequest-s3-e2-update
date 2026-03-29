"use client";

import { Search } from "lucide-react";

export function QuestionSearchBar({
  value,
  onChange,
  placeholder = "Асуулт, сэдэв, түлхүүр үгээр хайх",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
      <input
        className="h-12 w-full rounded-xl border border-[#e5e7eb] bg-[#fbfbfc] pl-11 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#cbd5e1] focus:bg-white focus:ring-4 focus:ring-[#e5e7eb]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}
