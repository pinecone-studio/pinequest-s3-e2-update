import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none ring-blue-200 transition focus:ring-2"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Гарчиг, агуулга, сэдвээр хайх..."
        value={value}
      />
    </div>
  );
}
