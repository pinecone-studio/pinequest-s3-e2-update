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
  QUESTION_SORT_OPTIONS,
  QUESTION_STATUSES,
  QUESTION_TYPES,
  type QuestionFilters,
} from "../_lib/types";
import {
  DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
  STATUS_LABELS,
} from "../_lib/utils";
import { QuestionSearchBar } from "./question-search-bar";

type QuestionFiltersProps = {
  filters: QuestionFilters;
  subjectOptions: string[];
  gradeOptions: string[];
  subtopicOptions: string[];
  onChange: (partial: Partial<QuestionFilters>) => void;
  onClear: () => void;
};

export function QuestionFilters({
  filters,
  subjectOptions,
  gradeOptions,
  subtopicOptions,
  onChange,
  onClear,
}: QuestionFiltersProps) {
  return (
    <section className="rounded-[24px] border border-[#d8e2f0] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#183153]">
              Хайлтын хэсэг
            </h2>
          </div>
          <button
            className="text-sm font-semibold text-[#3d6fc5] transition hover:text-[#1f4f9e]"
            onClick={onClear}
            type="button"
          >
            Шүүлтүүр цэвэрлэх
          </button>
        </div>

        <QuestionSearchBar
          value={filters.search}
          onChange={(value) => onChange({ search: value })}
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          <FilterSelect
            label="Асуултын төрөл"
            value={filters.questionType}
            onValueChange={(value) =>
              onChange({
                questionType: value as QuestionFilters["questionType"],
              })
            }
            options={[
              { value: "all", label: "Бүх төрөл" },
              ...QUESTION_TYPES.map((type) => ({
                value: type,
                label: QUESTION_TYPE_LABELS[type],
              })),
            ]}
          />
          <FilterSelect
            label="Түвшин"
            value={filters.difficulty}
            onValueChange={(value) =>
              onChange({ difficulty: value as QuestionFilters["difficulty"] })
            }
            options={[
              { value: "all", label: "Бүх түвшин" },
              ...QUESTION_DIFFICULTIES.map((difficulty) => ({
                value: difficulty,
                label: DIFFICULTY_LABELS[difficulty],
              })),
            ]}
          />
          <FilterSelect
            label="Хичээл"
            value={filters.subject}
            onValueChange={(value) =>
              onChange({ subject: value, subtopic: "all" })
            }
            options={[
              { value: "all", label: "Бүх хичээл" },
              ...subjectOptions.map((subject) => ({
                value: subject,
                label: subject,
              })),
            ]}
          />
          <FilterSelect
            label="Анги"
            value={filters.grade}
            onValueChange={(value) => onChange({ grade: value })}
            options={[
              { value: "all", label: "Бүх анги" },
              ...gradeOptions.map((grade) => ({ value: grade, label: grade })),
            ]}
          />
          <FilterSelect
            disabled={filters.subject === "all" || subtopicOptions.length === 0}
            label="Дэд сэдэв"
            value={filters.subtopic}
            onValueChange={(value) => onChange({ subtopic: value })}
            options={[
              { value: "all", label: "Бүх дэд сэдэв" },
              ...subtopicOptions.map((subtopic) => ({
                value: subtopic,
                label: subtopic,
              })),
            ]}
          />
          <FilterSelect
            label="Төлөв"
            value={filters.status}
            onValueChange={(value) =>
              onChange({ status: value as QuestionFilters["status"] })
            }
            options={[
              { value: "all", label: "Бүх төлөв" },
              ...QUESTION_STATUSES.map((status) => ({
                value: status,
                label: STATUS_LABELS[status],
              })),
            ]}
          />
          <FilterSelect
            label="Эрэмбэлэх"
            value={filters.sortBy}
            onValueChange={(value) =>
              onChange({ sortBy: value as QuestionFilters["sortBy"] })
            }
            options={QUESTION_SORT_OPTIONS.map((sort) => ({
              value: sort,
              label:
                sort === "most_used"
                  ? "Хамгийн их ашигласан"
                  : sort === "newest"
                    ? "Шинэ эхэндээ"
                    : "Хуучин эхэндээ",
            }))}
          />
        </div>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#70809b]">
        {label}
      </span>
      <Select disabled={disabled} onValueChange={onValueChange} value={value}>
        <SelectTrigger className="h-12 rounded-2xl border-[#d3deef] focus:border-[#4f9dff] focus:ring-4 focus:ring-[#4f9dff]/10 focus-visible:border-[#4f9dff] focus-visible:ring-4 focus-visible:ring-[#4f9dff]/10">
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
