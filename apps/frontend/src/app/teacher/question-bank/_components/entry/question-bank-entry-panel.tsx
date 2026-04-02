/** @format */

"use client";

import { ArrowRight } from "lucide-react";
import { QuestionBankEntrySelect } from "./question-bank-entry-select";

type QuestionBankEntryPanelProps = {
  entryGrade: string;
  entrySubjectId: string;
  totalQuestions: number;
  subjects: { id: string; name: string }[];
  subjectsLoading?: boolean;
  gradeOptions: string[];
  onEnter: () => void;
  onGradeSelect: (value: string) => void;
  onSubjectSelect: (subjectId: string, name: string) => void;
};

export function QuestionBankEntryPanel({
  entryGrade,
  entrySubjectId,
  totalQuestions,
  subjects,
  subjectsLoading = false,
  gradeOptions,
  onEnter,
  onGradeSelect,
  onSubjectSelect,
}: QuestionBankEntryPanelProps) {
  return (
    <div className="hidden space-y-[18px]">
      <section className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h1 className="text-[17px] font-bold uppercase leading-snug tracking-[0.08em] text-[#122459] sm:text-[23px] sm:leading-[28px] sm:tracking-[0.1em]">
            БАГШИЙН АСУУЛТЫН САН
          </h1>
          <p className="mt-2 text-[13px] leading-[18px] tracking-[0.06em] text-[#737373] sm:mt-[8px] sm:text-[14px] sm:tracking-[0.1em]">
            Нэг удаа бэлдээд, дахин ашигла.
          </p>
        </div>
      </section>

      <section className="rounded-[12px] border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-5 sm:px-[26px] sm:py-[22px]">
        <h2 className="text-[28px] font-medium leading-tight text-[#323232] sm:text-[40px] sm:leading-none md:text-[53px] md:leading-[53px]">
          Сонголтын хэсэг
        </h2>

        <div className="mt-4 flex flex-col items-stretch gap-4 sm:mt-[16px] sm:flex-row sm:flex-wrap sm:items-end sm:gap-[16px]">
          <div className="w-full sm:w-[243px]">
            <QuestionBankEntrySelect
              isOptionsLoading={subjectsLoading}
              label="Хичээл"
              onSubjectSelect={onSubjectSelect}
              placeholder="Хичээл сонгох"
              subjects={subjects}
              value={entrySubjectId}
            />
          </div>
          <div className="w-full sm:w-[243px]">
            <QuestionBankEntrySelect
              label="Анги"
              onValueChange={onGradeSelect}
              options={gradeOptions}
              placeholder="Анги сонгох"
              value={entryGrade}
            />
          </div>
          <button
            className="inline-flex h-[48px] w-full items-center justify-center rounded-[16px] border border-[#7DC8FF] bg-[#EDF6FF] px-4 text-[15px] font-medium uppercase leading-none text-[#122459] transition hover:bg-[#e3f0ff] disabled:cursor-not-allowed disabled:border-[#d1d5db] disabled:bg-[#f3f4f6] disabled:text-[#9ca3af] sm:h-[50px] sm:w-auto sm:px-[24px] sm:text-[18px] md:text-[22px]"
            disabled={subjectsLoading || !entrySubjectId || !entryGrade}
            onClick={onEnter}
            type="button"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            АСУУЛТ САНД НЭВТРЭХ
          </button>
        </div>
      </section>
    </div>
  );
}
