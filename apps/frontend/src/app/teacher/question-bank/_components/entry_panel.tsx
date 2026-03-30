"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { QuestionBankEntrySelect } from "./entry_select";

type QuestionBankEntryPanelProps = {
  entryGrade: string;
  entrySubjectId: string;
  gradeOptions: string[];
  onEnter: () => void;
  onGradeSelect: (value: string) => void;
  onSubjectSelect: (subjectId: string, name: string) => void;
};

export function QuestionBankEntryPanel({
  entryGrade,
  entrySubjectId,
  gradeOptions,
  onEnter,
  onGradeSelect,
  onSubjectSelect,
}: QuestionBankEntryPanelProps) {
  return (
    <section className="rounded-[28px] border border-[#e7e9ee] bg-white px-5 py-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)] sm:px-6 xl:min-w-0 xl:flex-1">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#355caa]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#111827]">
            Системийн санд нэвтрэх
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#6b7280]">
            Эхлээд хичээл болон ангиа сонгоод тухайн хүрээний асуултууд руу нэвтэрнэ.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <QuestionBankEntrySelect
          label="Хичээл"
          onSubjectSelect={onSubjectSelect}
          placeholder="Хичээл сонгох"
          useSubjectsQuery
          value={entrySubjectId}
        />
        <QuestionBankEntrySelect
          label="Анги"
          onValueChange={onGradeSelect}
          options={gradeOptions}
          placeholder="Анги сонгох"
          value={entryGrade}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          className="inline-flex h-11 items-center justify-center self-start rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:bg-[#d1d5db]"
          disabled={!entrySubjectId || !entryGrade}
          onClick={onEnter}
          type="button"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Системийн санд нэвтрэх
        </button>
        <p className="text-sm text-[#6b7280]">
          Сонгосон хичээл, ангид тохирох асуултуудыг шууд шүүж харуулна.
        </p>
      </div>
    </section>
  );
}
