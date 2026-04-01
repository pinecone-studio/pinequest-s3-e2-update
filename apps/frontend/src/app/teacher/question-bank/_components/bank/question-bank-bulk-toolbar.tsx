"use client";

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
    <section className="rounded-[12px] border border-[#d1d5db] bg-[#f3f4f6] px-5 py-4 shadow-sm">
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
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#29A4FF] px-4 text-sm font-semibold text-white transition hover:bg-[#1f97f1]"
            onClick={onSendToExam}
            type="button"
          >
            Шалгалтанд нэмэх
          </button>
        </div>
      </div>
    </section>
  );
}
