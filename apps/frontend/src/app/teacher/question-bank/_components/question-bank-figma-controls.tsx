"use client";

import { ChevronLeft, Circle, CirclePlus, FileUp, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuestionFilters as QuestionFiltersType } from "../types";

type QuestionBankFigmaControlsProps = {
  currentFilters: QuestionFiltersType;
  entryGrade: string;
  entrySubject: string;
  topicOptions: string[];
  onClearFilters: () => void;
  onOpenBulkImport: () => void;
  onResetSelection: () => void;
  onUpdateFilters: (partial: Partial<QuestionFiltersType>) => void;
};

export function QuestionBankFigmaControls({
  currentFilters,
  entryGrade,
  entrySubject,
  topicOptions,
  onClearFilters,
  onOpenBulkImport,
  onResetSelection,
  onUpdateFilters,
}: QuestionBankFigmaControlsProps) {
  return (
    <>
      <section className="rounded-[12px] border border-[#ececec] bg-[#f9f9f8] px-[16px] py-[12px]">
        <h2 className="text-[20px] font-medium leading-[20px] text-[#262626]">
          Сонголтын хэсэг
        </h2>
        <div className="mt-[10px] flex items-center gap-[10px]">
          <button
            className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border border-[#dfe6f2] bg-white text-[#7c8aa5] transition hover:bg-[#f7faff]"
            onClick={onResetSelection}
            type="button"
          >
            <ChevronLeft className="h-[14px] w-[14px]" />
          </button>
          <SelectedChip>{entrySubject || "Математик"}</SelectedChip>
          <SelectedChip>{entryGrade || "10-р анги"}</SelectedChip>
          <button
            className="inline-flex h-[36px] items-center gap-[6px] rounded-[10px] border border-[#e5e7eb] bg-white px-[14px] text-[11px] font-medium text-[#4b5563] transition hover:bg-[#f8fafc]"
            onClick={onOpenBulkImport}
            type="button"
          >
            <CirclePlus className="h-[12px] w-[12px]" />
            Файл нэмэх
          </button>
        </div>
      </section>

      <section className="rounded-[12px] border border-[#ececec] bg-[#f9f9f8] px-[16px] py-[12px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-medium leading-[20px] text-[#434343]">
            Хайлтын хэсэг
          </h2>
          <button
            className="text-[16px] font-medium leading-120% text-[#122459] transition hover:text-[#264a90]"
            onClick={onClearFilters}
            type="button"
          >
            Шүүлтүүр цэвэрлэх
          </button>
        </div>

        <div className="mt-[12px] flex items-center gap-[12px]">
          <CompactFilterSelect
            onValueChange={(value) => onUpdateFilters({ topic: value })}
            options={topicOptions}
            placeholder="Сэдэв сонголт"
            value={currentFilters.topic}
          />
          <CompactFilterSelect
            onValueChange={(value) =>
              onUpdateFilters({
                difficulty: value as QuestionFiltersType["difficulty"],
              })
            }
            options={["easy", "medium", "hard"]}
            placeholder="Түвшин сонголт"
            renderLabel={(value) =>
              value === "easy"
                ? "Хялбар"
                : value === "medium"
                  ? "Дунд"
                  : "Хэцүү"
            }
            value={currentFilters.difficulty}
          />
          <CompactFilterSelect
            onValueChange={(value) =>
              onUpdateFilters({
                questionType: value as QuestionFiltersType["questionType"],
              })
            }
            options={["multiple_choice", "long_answer", "file_upload"]}
            placeholder="Төрөл сонголт"
            renderLabel={(value) =>
              value === "multiple_choice"
                ? "Сонгох асуулт"
                : value === "long_answer"
                  ? "Задгай"
                  : "Файл"
            }
            value={currentFilters.questionType}
          />
        </div>

        <label className="relative mt-[10px] block">
          <Search className="pointer-events-none absolute left-[12px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#b8c0cc]" />
          <input
            className="h-[38px] w-full rounded-[10px] border border-[#ececec] bg-white pl-[36px] pr-[12px] text-[11px] text-[#475569] outline-none placeholder:text-[#b7bec9]"
            onChange={(event) =>
              onUpdateFilters({ search: event.target.value })
            }
            placeholder="Гарчиг, Асуулт, Түлхүүр үг эсвэл хичээлээр хайх"
            value={currentFilters.search}
          />
        </label>
      </section>
    </>
  );
}

function SelectedChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex h-[36px] items-center rounded-[10px] border border-[#93c5fd] bg-[#eff6ff] px-[14px] text-[11px] font-medium text-[#355caa]">
      {children}
    </div>
  );
}

function CompactFilterSelect({
  value,
  onValueChange,
  options,
  placeholder,
  renderLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder: string;
  renderLabel?: (value: string) => string;
}) {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="h-[36px] w-[142px] rounded-[10px] border-[#ececec] bg-white px-[12px] text-[11px] text-[#96a0b0] shadow-none focus:ring-0 focus-visible:ring-0 [&>span]:overflow-visible [&>span]:text-clip [&>span]:whitespace-nowrap">
        <SelectValue placeholder={placeholder}>
          {value !== "all" && value
            ? renderLabel
              ? renderLabel(value)
              : value
            : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {renderLabel ? renderLabel(option) : option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
