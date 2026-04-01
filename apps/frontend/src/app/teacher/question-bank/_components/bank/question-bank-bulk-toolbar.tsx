"use client";

type QuestionBankBulkToolbarProps = {
  count: number;
  onClear: () => void;
  onSendToExam: () => void;
};

export function QuestionBankBulkToolbar({
  count,
  onSendToExam,
}: QuestionBankBulkToolbarProps) {
  return (
    <section className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-[14px]">
      <div className="inline-flex h-11 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] text-xl font-medium leading-none text-[#122459]">
        {count}
      </div>
      <button
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#29A4FF] px-2 text-l font-medium leading-none text-white transition hover:bg-[#1f97f1]"
        onClick={onSendToExam}
        type="button"
      >
        Шалгалтад нэмэх
      </button>
    </section>
  );
}
