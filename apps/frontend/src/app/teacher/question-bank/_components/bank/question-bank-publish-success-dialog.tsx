"use client";

import { CheckCircle2 } from "lucide-react";

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
      <div className="w-full max-w-md rounded-[28px] border border-[#ebeef3] bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#111827]">
          Амжилттай нийтэллээ
        </h3>
        <button
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#29A4FF] px-5 text-sm font-semibold text-white transition hover:bg-[#1f97f1]"
          onClick={onClose}
          type="button"
        >
          Ойлголоо
        </button>
      </div>
    </div>
  );
}
