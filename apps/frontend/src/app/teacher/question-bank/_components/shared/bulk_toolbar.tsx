"use client";

import { CheckCircle2 } from "lucide-react";

type QuestionBankBulkToolbarProps = {
  count: number;
  onClear: () => void;
  onSendToExam: () => void;
};

export function QuestionBankBulkToolbar({
  count,
  onClear,
  onSendToExam,
}: QuestionBankBulkToolbarProps) {
  if (count <= 0) return null;

  return (
    <section className="rounded-3xl border border-[#d8e2f0] bg-[#f8fbff] px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#183153]">{count} асуулт сонгогдлоо</p>
          <p className="text-sm text-[#6b7280]">
            Сонгосон асуултуудаа нэг дор шалгалт руу нэмэх боломжтой.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dbe4f0] bg-white px-4 text-sm font-medium text-[#355caa] transition hover:border-[#bfd2f6] hover:bg-[#f8fbff]"
            onClick={onClear}
            type="button"
          >
            Сонголт цэвэрлэх
          </button>
          <button
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
            onClick={onSendToExam}
            type="button"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Сонгосон асуултуудыг шалгалтанд нэмэх
          </button>
        </div>
      </div>
    </section>
  );
}
