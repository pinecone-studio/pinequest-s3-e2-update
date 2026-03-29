"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  QUESTION_DIFFICULTIES,
  QUESTION_TYPES,
  type QuestionFilters,
} from "../_lib/types";
import { DIFFICULTY_LABELS, QUESTION_TYPE_LABELS } from "../_lib/utils";

type QuestionFiltersProps = {
  filters: QuestionFilters;
  subjectOptions: string[];
  gradeOptions: string[];
  topicOptions: string[];
  onChange: (partial: Partial<QuestionFilters>) => void;
  onClear: () => void;
  embedded?: boolean;
};

export function QuestionFilters({
  filters,
  subjectOptions,
  gradeOptions,
  topicOptions,
  onChange,
  onClear,
  embedded = false,
}: QuestionFiltersProps) {
  const content = (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
            Системийн сан
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#111827]">
            Хурдан хайлт ба шүүлтүүр
          </h2>
        </div>
        <button
          className="text-sm font-medium text-[#6b7280] transition hover:text-[#111827]"
          onClick={onClear}
          type="button"
        >
          Шүүлтүүр цэвэрлэх
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <FilterSelect
          label="Анги"
          options={[
            { value: "all", label: "Бүх анги" },
            ...gradeOptions.map((grade) => ({ value: grade, label: grade })),
          ]}
          onValueChange={(value) => onChange({ grade: value })}
          value={filters.grade}
        />
        <FilterSelect
          label="Хичээл"
          options={[
            { value: "all", label: "Бүх хичээл" },
            ...subjectOptions.map((subject) => ({ value: subject, label: subject })),
          ]}
          onValueChange={(value) => onChange({ subject: value })}
          value={filters.subject}
        />
        <FilterSelect
          label="Сэдэв"
          options={[
            { value: "all", label: "Бүх сэдэв" },
            ...topicOptions.map((topic) => ({ value: topic, label: topic })),
          ]}
          onValueChange={(value) => onChange({ topic: value })}
          value={filters.topic}
        />
        <FilterSelect
          label="Түвшин"
          options={[
            { value: "all", label: "Бүх түвшин" },
            ...QUESTION_DIFFICULTIES.map((difficulty) => ({
              value: difficulty,
              label: DIFFICULTY_LABELS[difficulty],
            })),
          ]}
          onValueChange={(value) =>
            onChange({ difficulty: value as QuestionFilters["difficulty"] })
          }
          value={filters.difficulty}
        />
        <FilterSelect
          label="Төрөл"
          options={[
            { value: "all", label: "Бүх төрөл" },
            ...QUESTION_TYPES.map((type) => ({
              value: type,
              label: QUESTION_TYPE_LABELS[type],
            })),
          ]}
          onValueChange={(value) =>
            onChange({ questionType: value as QuestionFilters["questionType"] })
          }
          value={filters.questionType}
        />
      </div>
    </div>
  );

  if (embedded) {
    return <div className="space-y-5">{content}</div>;
  }

  return (
    <section className="rounded-[28px] border border-[#e3e8ef] bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)] sm:p-6">
      {content}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
        {label}
      </span>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="h-11 rounded-xl border-[#e5e7eb] bg-[#fbfbfc] text-sm text-[#111827] focus:border-[#d1d5db] focus:ring-4 focus:ring-[#e5e7eb] focus-visible:border-[#d1d5db] focus-visible:ring-4 focus-visible:ring-[#e5e7eb]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
