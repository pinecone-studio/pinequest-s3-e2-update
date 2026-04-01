"use client";

import { ArrowRight } from "lucide-react";
import { QuestionBankEntrySelect } from "./question-bank-entry-select";

type QuestionBankEntryPanelProps = {
  entryGrade: string;
  entrySubjectId: string;
  subjects: { id: string; name: string }[];
  gradeOptions: string[];
  onEnter: () => void;
  onGradeSelect: (value: string) => void;
  onSubjectSelect: (subjectId: string, name: string) => void;
};

export function QuestionBankEntryPanel({
  entryGrade,
  entrySubjectId,
  subjects,
  gradeOptions,
  onEnter,
  onGradeSelect,
  onSubjectSelect,
}: QuestionBankEntryPanelProps) {
  const totalQuestions = 9;

  return (
    <div className="space-y-[18px]">
      <section className="flex w-full items-center justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-[23px] font-bold uppercase leading-[28px] tracking-[0.1em] text-[#122459]">
            БАГШИЙН АСУУЛТЫН САН
          </h1>
          <p className="mt-[8px] text-[14px] leading-[18px] tracking-[0.1em] text-[#737373]">
            Нэг удаа бэлдээд, дахин ашигла.
          </p>
        </div>
        <div className="inline-flex h-[88px] min-w-[326px] items-center justify-center rounded-[16px] bg-[#D7ECFF] px-[28px]">
          <span className="text-[56px] font-medium leading-none text-[#122459]">
            {totalQuestions}
          </span>
          <div className="ml-[12px]">
            <p className="whitespace-nowrap text-[16px] font-medium uppercase leading-[20px] text-[#122459]">
              БҮХ АСУУЛТ
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[12px] border border-[#E5E5E5] bg-[#FAFAFA] px-[26px] py-[22px]">
        <h2 className="text-[53px] font-medium leading-[53px] text-[#323232]">
          Сонголтын хэсэг
        </h2>

        <div className="mt-[16px] flex flex-wrap items-end gap-[16px]">
          <div className="w-[243px]">
            <QuestionBankEntrySelect
              label="Хичээл"
              onSubjectSelect={onSubjectSelect}
              placeholder="Хичээл сонгох"
              subjects={subjects}
              value={entrySubjectId}
            />
          </div>
          <div className="w-[243px]">
            <QuestionBankEntrySelect
              label="Анги"
              onValueChange={onGradeSelect}
              options={gradeOptions}
              placeholder="Анги сонгох"
              value={entryGrade}
            />
          </div>
          <button
            className="inline-flex h-[50px] items-center justify-center rounded-[16px] border border-[#7DC8FF] bg-[#EDF6FF] px-[24px] text-[22px] font-medium uppercase leading-none text-[#122459] transition hover:bg-[#e3f0ff] disabled:cursor-not-allowed disabled:border-[#d1d5db] disabled:bg-[#f3f4f6] disabled:text-[#9ca3af]"
            disabled={!entrySubjectId || !entryGrade}
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
