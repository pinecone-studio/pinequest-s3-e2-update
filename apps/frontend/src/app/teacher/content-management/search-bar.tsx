import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8fae]" />
      <input
        className="h-11 w-full rounded-xl border border-[#d6e7ff] bg-[#F6FAFF] pl-9 pr-4 text-sm text-[#1F2A44] outline-none transition placeholder:text-[#7d8fae] focus:border-[#4F9DFF] focus:ring-2 focus:ring-[#4F9DFF]/25"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Гарчиг, агуулга, сэдвээр хайх..."
        value={value}
      />
    </label>
  );
}
