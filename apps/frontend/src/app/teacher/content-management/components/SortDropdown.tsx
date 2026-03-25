import type { SortOption } from "../types";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "most_used", label: "Их ашиглагдсан" },
  { value: "least_used", label: "Бага ашиглагдсан" },
  { value: "highest_correct_rate", label: "Зөв хариулалтын хувь өндөр" },
  { value: "lowest_correct_rate", label: "Зөв хариулалтын хувь бага" },
  { value: "newest", label: "Сүүлд ашиглагдсан" },
  { value: "oldest", label: "Эрт ашиглагдсан" },
];

type SortDropdownProps = {
  value: SortOption;
  onChange: (sortBy: SortOption) => void;
};

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <select
      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none ring-blue-200 transition focus:ring-2"
      onChange={(event) => onChange(event.target.value as SortOption)}
      value={value}
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
