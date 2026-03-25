import type { SortOption } from "./types";

type Props = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

const options: Array<{ value: SortOption; label: string }> = [
  { value: "most_used", label: "Хамгийн их ашигласан" },
  { value: "least_used", label: "Хамгийн бага ашигласан" },
  { value: "highest_correct_rate", label: "Хамгийн өндөр зөв хувь" },
  { value: "lowest_correct_rate", label: "Хамгийн бага зөв хувь" },
  { value: "newest", label: "Шинэ" },
  { value: "oldest", label: "Хуучин" },
];

export function SortDropdown({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[#5d6e8c]">Эрэмбэлэх:</span>
      <select
        className="h-11 rounded-xl border border-[#d6e7ff] bg-white px-3 text-sm font-medium text-[#1F2A44]"
        onChange={(event) => onChange(event.target.value as SortOption)}
        value={value}
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
