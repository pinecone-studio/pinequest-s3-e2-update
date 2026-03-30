"use client";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuestionBank } from "../_hooks/use-question-bank";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_SUBJECTS } from "@/graphql/typeDefs/queries";
import { useRouter } from "next/navigation";

type GetAllSubjectQueryData = {
  getAllSubject: { id: string; name: string }[];
};

export function QuestionBankEntry({
  initialSubjectId = "",
  initialGrade = "",
}: {
  initialSubjectId?: string;
  initialGrade?: string;
} = {}) {
  const router = useRouter();

  const { entrySelection, gradeOptions, toastMessage, updateEntrySelection } =
    useQuestionBank(
      initialSubjectId && initialGrade
        ? { initialSubjectId, initialGrade }
        : undefined,
    );

  const { data, loading } = useQuery<GetAllSubjectQueryData>(GET_ALL_SUBJECTS);

  const subjectItems =
    data?.getAllSubject.map((subject) => ({
      key: subject.id,
      value: subject.id,
      label: subject.name,
    })) ?? [];

  const gradeItems = gradeOptions.map((grade) => ({
    key: grade,
    value: grade,
    label: grade,
  }));

  const totalQuestions = 9;

  const handleSubjectChange = (next: string) => {
    const subject = data?.getAllSubject.find((s) => s.id === next);
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
        <div className="space-y-1">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1f2a44]">
            БАГШИЙН АСУУЛТЫН САН
          </p>
          <p className="text-sm text-[#737373]">
            Нэг удаа бэлдээд, дахин ашигла.
          </p>
        </div>

        <section className="rounded-2xl border border-[#e6edf8] bg-[#EDF6FF] px-6 py-5">
          <div className="flex items-center gap-6">
            <p className="text-4xl font-extrabold text-[#1f2a44]">
              {totalQuestions}
            </p>
            <div>
              <p className="text-sm font-extrabold text-[#1f2a44]">
                БҮХ АСУУЛТ
              </p>
              <p className="text-[11px] text-[#737373]">
                Шалгалтад дахин ашиглана
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#e5e7eb] bg-white px-5 py-4 sm:px-6">
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
                {loading ? (
                  <div className="px-3 py-2 text-sm text-[#6b7280]">
                    Ачааллаж байна…
                  </div>
                ) : null}
                {subjectItems.map((item) => (
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
