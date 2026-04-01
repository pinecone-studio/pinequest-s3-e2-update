"use client";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuestionBank } from "../../_hooks/use-question-bank";
import { useRouter } from "next/navigation";

export function QuestionBankEntry({
  initialSubjectId = "",
  initialGrade = "",
}: {
  initialSubjectId?: string;
  initialGrade?: string;
} = {}) {
  const router = useRouter();

  const {
    entrySelection,
    gradeOptions,
    summary,
    subjectItems,
    toastMessage,
    updateEntrySelection,
  } =
    useQuestionBank(
      initialSubjectId && initialGrade
        ? { initialSubjectId, initialGrade }
        : undefined,
    );

  const subjectSelectItems = subjectItems.map((subject) => ({
    key: subject.id,
    value: subject.id,
    label: subject.name,
  }));

  const gradeItems = gradeOptions.map((grade) => ({
    key: grade,
    value: grade,
    label: grade,
  }));

  const totalQuestions = summary.selectedScopeCount;

  const handleSubjectChange = (next: string) => {
    const subject = subjectItems.find((s) => s.id === next);
    if (subject) {
      updateEntrySelection({
        subjectId: subject.id,
        subject: subject.name,
      });
    }
  };

  const handleGradeChange = (next: string) => {
    updateEntrySelection({ grade: next });
  };

  return (
    <div className="bg-white pb-12">
      <div className="mx-auto max-w-[1184px] space-y-5 px-6 pt-[28px]">
        <section className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[23px] font-bold uppercase leading-[28px] tracking-[0.1em] text-[#122459]">
              БАГШИЙН АСУУЛТЫН САН
            </p>
            <p className="text-[14px] leading-[18px] tracking-[0.1em] text-[#737373]">
              Нэг удаа бэлдээд, дахин ашигла.
            </p>
          </div>

          <div className="inline-flex h-[88px] min-w-[320px] items-center justify-center gap-4 rounded-[16px] bg-[#D7ECFF] px-8 sm:h-[76px] sm:min-w-[220px] sm:px-4">
            <p className="text-[56px] font-medium leading-none text-[#122459] sm:text-[44px]">
              {totalQuestions}
            </p>
            <p className="whitespace-nowrap text-[16px] font-medium uppercase leading-[20px] tracking-[0.08em] text-[#122459] sm:text-[16px] sm:tracking-[0.06em]">
              БҮХ АСУУЛТ
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#e5e7eb] bg-[#FAFAFA] px-5 py-4 sm:px-6">
          <p className="text-sm font-semibold text-[#1f2a44]">
            Сонголтын хэсэг
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Select
              onValueChange={handleSubjectChange}
              value={entrySelection.subjectId}
            >
              <SelectTrigger className="h-10 w-[150px] rounded-2xl border-[#e5e7eb] bg-white text-xs text-[#111827] focus:border-[#9fbef5] focus:ring-2 focus:ring-[#9fbef5]/30">
                <SelectValue placeholder="Хичээл сонгох" />
              </SelectTrigger>
              <SelectContent>
                {subjectSelectItems.map((item) => (
                  <SelectItem key={item.key} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={handleGradeChange}
              value={entrySelection.grade}
            >
              <SelectTrigger className="h-10 w-[130px] rounded-2xl border-[#e5e7eb] bg-white text-xs text-[#111827] focus:border-[#9fbef5] focus:ring-2 focus:ring-[#9fbef5]/30">
                <SelectValue placeholder="Анги сонгох" />
              </SelectTrigger>
              <SelectContent>
                {gradeItems.map((item) => (
                  <SelectItem key={item.key} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              className="inline-flex h-10 items-center justify-center rounded-2xl border border-[#9fbef5] bg-[#EDF6FF] px-4 text-xs font-semibold text-[#1f2a44] transition hover:border-[#7aa8f0] hover:bg-[#e3f0ff] disabled:cursor-not-allowed disabled:border-[#d1d5db] disabled:bg-[#f3f4f6] disabled:text-[#9ca3af]"
              disabled={!entrySelection.subjectId || !entrySelection.grade}
              onClick={() =>
                router.push(
                  `/teacher/question-bank/${encodeURIComponent(entrySelection.subjectId)}/${encodeURIComponent(entrySelection.grade)}`,
                )
              }
              type="button"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              АСУУЛТ САНД НЭВТРЭХ
            </button>
          </div>
        </section>

        {toastMessage ? (
          <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-medium text-[#374151] shadow-sm">
            {toastMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
}
