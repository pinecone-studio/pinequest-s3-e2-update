"use client";

import { useQuery } from "@apollo/client/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GET_ALL_SUBJECTS } from "@/graphql/queries";

type GetAllSubjectQueryData = {
  getAllSubject: { id: string; name: string }[];
};

type QuestionBankEntrySelectProps = {
  label: string;
  onSubjectSelect?: (subjectId: string, name: string) => void;
  onValueChange?: (value: string) => void;
  options?: string[];
  placeholder: string;
  useSubjectsQuery?: boolean;
  value: string;
};

export function QuestionBankEntrySelect({
  label,
  onSubjectSelect,
  onValueChange,
  options = [],
  placeholder,
  useSubjectsQuery = false,
  value,
}: QuestionBankEntrySelectProps) {
  const { data, loading } = useQuery<GetAllSubjectQueryData>(GET_ALL_SUBJECTS, {
    skip: !useSubjectsQuery,
  });

  const items = useSubjectsQuery
    ? (data?.getAllSubject ?? []).map((subject) => ({
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
    if (useSubjectsQuery && onSubjectSelect) {
      const subject = data?.getAllSubject.find((item) => item.id === next);
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
          {useSubjectsQuery && loading ? (
            <div className="px-3 py-2 text-sm text-[#6b7280]">Ачааллаж байна…</div>
          ) : null}
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
