"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type QuestionBankEntrySelectProps = {
  label: string;
  onSubjectSelect?: (subjectId: string, name: string) => void;
  onValueChange?: (value: string) => void;
  options?: string[];
  subjects?: { id: string; name: string }[];
  placeholder: string;
  value: string;
};

export function QuestionBankEntrySelect({
  label,
  onSubjectSelect,
  onValueChange,
  options = [],
  subjects = [],
  placeholder,
  value,
}: QuestionBankEntrySelectProps) {
  const items =
    subjects.length > 0
      ? subjects.map((subject) => ({
          key: subject.id,
          value: subject.id,
          label: subject.name,
        }))
      : options.map((option) => ({
          key: option,
          value: option,
          label: option,
        }));

  const handleValueChange = (next: string) => {
    if (subjects.length > 0 && onSubjectSelect) {
      const subject = subjects.find((item) => item.id === next);
      if (subject) onSubjectSelect(subject.id, subject.name);
      return;
    }

    onValueChange?.(next);
  };

  return (
    <label className="space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
        {label}
      </span>
      <Select onValueChange={handleValueChange} value={value}>
        <SelectTrigger className="h-12 rounded-xl border-[#e5e7eb] bg-[#fbfbfc] text-sm text-[#111827] focus:border-[#d1d5db] focus:ring-4 focus:ring-[#e5e7eb] focus-visible:border-[#d1d5db] focus-visible:ring-4 focus-visible:ring-[#e5e7eb]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.key} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
