"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQuestionBank } from "../_hooks/use-question-bank";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_SUBJECTS } from "@/graphql/queries";
import { useRouter } from "next/navigation";

export function Entry({
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

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch">
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
                Эхлээд хичээл болон ангиа сонгоод тухайн хүрээний асуултууд руу
                нэвтэрнэ.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <EntrySelect
              label="Хичээл"
              onSubjectSelect={(subjectId, name) =>
                updateEntrySelection({ subjectId, subject: name })
              }
              placeholder="Хичээл сонгох"
              useSubjectsQuery
              value={entrySelection.subjectId}
            />
            <EntrySelect
              label="Анги"
              onValueChange={(value) => updateEntrySelection({ grade: value })}
              options={gradeOptions}
              placeholder="Анги сонгох"
              value={entrySelection.grade}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              className="inline-flex h-11 items-center justify-center self-start rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:bg-[#d1d5db]"
              disabled={!entrySelection.subjectId || !entrySelection.grade}
              onClick={() =>
                router.push(
                  `/teacher/question-bank/${encodeURIComponent(entrySelection.subjectId)}/${encodeURIComponent(entrySelection.grade)}`,
                )
              }
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
      </div>

      {toastMessage ? (
        <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-medium text-[#374151] shadow-sm">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}

type GetAllSubjectQueryData = {
  getAllSubject: { id: string; name: string }[];
};

function EntrySelect({
  label,
  value,
  onValueChange,
  onSubjectSelect,
  options = [],
  placeholder,
  useSubjectsQuery = false,
}: {
  label: string;
  value: string;
  onValueChange?: (value: string) => void;
  onSubjectSelect?: (subjectId: string, name: string) => void;
  options?: string[];
  placeholder: string;
  useSubjectsQuery?: boolean;
}) {
  const { data, loading } = useQuery<GetAllSubjectQueryData>(GET_ALL_SUBJECTS, {
    skip: !useSubjectsQuery,
  });

  const subjectItems =
    data?.getAllSubject.map((subject) => ({
      key: subject.id,
      value: subject.id,
      label: subject.name,
    })) ?? [];

  const optionItems = options.map((option) => ({
    key: option,
    value: option,
    label: option,
  }));

  const items = useSubjectsQuery ? subjectItems : optionItems;

  const handleValueChange = (next: string) => {
    if (useSubjectsQuery && onSubjectSelect) {
      const subject = data?.getAllSubject.find((s) => s.id === next);
      if (subject) {
        onSubjectSelect(subject.id, subject.name);
      }
      return;
    }
    onValueChange?.(next);
  };

  return (
    <label className="space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
        {label}
      </span>
      <Select onValueChange={handleValueChange} value={value}>
        <SelectTrigger className="h-12 rounded-xl border-[#e5e7eb] bg-[#fbfbfc] text-sm text-[#111827] focus:border-[#d1d5db] focus:ring-4 focus:ring-[#e5e7eb] focus-visible:border-[#d1d5db] focus-visible:ring-4 focus-visible:ring-[#e5e7eb]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {useSubjectsQuery && loading ? (
            <div className="px-3 py-2 text-sm text-[#6b7280]">
              Ачааллаж байна…
            </div>
          ) : null}
          {items.map((item) => (
            <SelectItem key={item.key} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
