"use client";

import { Check } from "lucide-react";

type QuestionBankPublishSuccessDialogProps = {
  onClose: () => void;
  open: boolean;
};

export function QuestionBankPublishSuccessDialog({
  onClose,
  open,
}: QuestionBankPublishSuccessDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#111827]/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-lg border border-[#E5E5E5] bg-[#EDF6FF] p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-[4px] border-[#0BBF63] text-[#0BBF63]">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#111827]">
          Шалгалт амжилттай нийтлэгдлээ
        </h3>
        <p className="mt-1.5 text-base text-[#8B8B8B]">
          Та одоо шалгалтаа хянах боломжтой.
        </p>
        <button
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#29A4FF] px-5 text-sm font-semibold text-white transition hover:bg-[#1f97f1]"
          onClick={onClose}
          type="button"
        >
          Хаах
        </button>
      </div>
    </div>
  );
}
