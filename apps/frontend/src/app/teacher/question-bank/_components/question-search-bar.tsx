"use client";

import { Search } from "lucide-react";

export function QuestionSearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8aa5]" />
      <input
        className="h-12 w-full rounded-2xl border border-[#d3deef] bg-white pl-11 pr-4 text-sm text-[#183153] outline-none transition focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Гарчиг, асуулт, түлхүүр үг эсвэл хичээлээр хайх"
        value={value}
      />
    </label>
  );
}
