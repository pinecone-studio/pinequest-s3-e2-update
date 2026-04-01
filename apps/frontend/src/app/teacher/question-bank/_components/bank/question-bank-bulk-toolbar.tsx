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
    <section className="grid grid-cols-[70px_minmax(0,1fr)] items-center gap-[10px]">
      <div className="inline-flex h-[52px] items-center justify-center rounded-[12px] border border-[#E5E5E5] bg-[#FAFAFA] text-[18px] font-medium leading-none text-[#122459]">
        {count}
      </div>
      <button
        className="inline-flex h-[52px] items-center justify-center rounded-[12px] bg-[#339EF0] px-2 text-[16px] font-medium leading-none text-white transition hover:bg-[#1f97f1]"
        onClick={onSendToExam}
        type="button"
      >
        Шалгалтад нэмэх
      </button>
    </section>
  );
}
