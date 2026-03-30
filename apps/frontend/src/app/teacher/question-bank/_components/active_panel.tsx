"use client";

import { ChevronsRightLeft, FileUp, Sparkles } from "lucide-react";
import type { QuestionFilters as QuestionFiltersType } from "../types";
import { QuestionFilters } from "./question-filters";

type QuestionBankActivePanelProps = {
  currentFilters: QuestionFiltersType;
  entryGrade: string;
  entrySubject: string;
  gradeOptions: string[];
  onChangeFilters: (partial: Partial<QuestionFiltersType>) => void;
  onClearFilters: () => void;
  onCreateQuestion: () => void;
  onOpenBulkImport: () => void;
  onResetSelection: () => void;
  selectedScopeCount: number | null;
  subjectOptions: string[];
  topicOptions: string[];
};

export function QuestionBankActivePanel({
  currentFilters,
  entryGrade,
  entrySubject,
  gradeOptions,
  onChangeFilters,
  onClearFilters,
  onCreateQuestion,
  onOpenBulkImport,
  onResetSelection,
  selectedScopeCount,
  subjectOptions,
  topicOptions,
}: QuestionBankActivePanelProps) {
  return (
    <section className="rounded-[28px] border border-[#e7e9ee] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)] sm:px-6 xl:min-w-0 xl:flex-1">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#355caa]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#111827]">
              Системийн сан
            </h2>
            <p className="text-sm leading-6 text-[#6b7280]">
              Одоогийн орчин: {entrySubject} • {entryGrade}
              {selectedScopeCount !== null ? ` • ${selectedScopeCount} асуулт` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#dbe4f0] bg-white px-4 text-sm font-medium text-[#355caa] transition hover:border-[#bfd2f6] hover:bg-[#f8fbff]"
            onClick={onResetSelection}
            type="button"
          >
            <ChevronsRightLeft className="mr-2 h-4 w-4" />
            Сонголт солих
          </button>
          <button
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#dbe4f0] bg-white px-4 text-sm font-medium text-[#355caa] transition hover:border-[#bfd2f6] hover:bg-[#f8fbff]"
            onClick={onOpenBulkImport}
            type="button"
          >
            <FileUp className="mr-2 h-4 w-4" />
            Bulk import
          </button>
          <button
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] active:translate-y-px"
            onClick={onCreateQuestion}
            type="button"
          >
            + Асуулт нэмэх
          </button>
        </div>

        <div className="border-t border-[#edf1f5] pt-6">
          <QuestionFilters
            embedded
            filters={currentFilters}
            gradeOptions={gradeOptions}
            onChange={onChangeFilters}
            onClear={onClearFilters}
            subjectOptions={subjectOptions}
            topicOptions={topicOptions}
          />
        </div>
      </div>
    </section>
  );
}
