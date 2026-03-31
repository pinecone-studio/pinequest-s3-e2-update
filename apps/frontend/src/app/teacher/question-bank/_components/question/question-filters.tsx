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
  type QuestionFilters as QuestionFiltersType,
} from "../../_lib/types";
import { DIFFICULTY_LABELS } from "../../_lib/utils";

type QuestionFiltersProps = {
  filters: QuestionFiltersType;
  subjectOptions: string[];
  gradeOptions: string[];
  topicOptions: string[];
  onChange: (partial: Partial<QuestionFiltersType>) => void;
  onClear: () => void;
  embedded?: boolean;
};

export function QuestionFilters({
  filters,
  topicOptions,
  onChange,
  onClear,
  embedded = false,
}: QuestionFiltersProps) {
  const containerClassName = embedded
    ? "space-y-5"
    : "rounded-[28px] border border-[#e3e8ef] bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)] sm:p-6";

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
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-[#6b7280] transition hover:text-[#111827]"
        >
          Шүүлтүүр цэвэрлэх
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
            Сэдэв
          </span>
          <Select
            value={filters.topic}
            onValueChange={(value) => onChange({ topic: value })}
          >
            <SelectTrigger className="h-11 rounded-xl border-[#e5e7eb] bg-[#fbfbfc] text-sm text-[#111827] focus:border-[#d1d5db] focus:ring-4 focus:ring-[#e5e7eb] focus-visible:border-[#d1d5db] focus-visible:ring-4 focus-visible:ring-[#e5e7eb]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүх сэдэв</SelectItem>
              {topicOptions.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
            Түвшин
          </span>
          <Select
            value={filters.difficulty}
            onValueChange={(value) =>
              onChange({
                difficulty: value as QuestionFiltersType["difficulty"],
              })
            }
          >
            <SelectTrigger className="h-11 rounded-xl border-[#e5e7eb] bg-[#fbfbfc] text-sm text-[#111827] focus:border-[#d1d5db] focus:ring-4 focus:ring-[#e5e7eb] focus-visible:border-[#d1d5db] focus-visible:ring-4 focus-visible:ring-[#e5e7eb]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүх түвшин</SelectItem>
              {QUESTION_DIFFICULTIES.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {DIFFICULTY_LABELS[difficulty]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
            Төрөл
          </span>
          <Select
            value={filters.questionType}
            onValueChange={(value) =>
              onChange({
                questionType: value as QuestionFiltersType["questionType"],
              })
            }
          >
            <SelectTrigger className="h-11 rounded-xl border-[#e5e7eb] bg-[#fbfbfc] text-sm text-[#111827] focus:border-[#d1d5db] focus:ring-4 focus:ring-[#e5e7eb] focus-visible:border-[#d1d5db] focus-visible:ring-4 focus-visible:ring-[#e5e7eb]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүх төрөл</SelectItem>
              <SelectItem value="multiple_choice">Сонгох</SelectItem>
              <SelectItem value="long_answer">Задгай</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>
    </div>
  );

  if (embedded) {
    return <div className={containerClassName}>{content}</div>;
  }

  return <section className={containerClassName}>{content}</section>;
}
