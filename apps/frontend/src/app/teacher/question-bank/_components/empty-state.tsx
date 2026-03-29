"use client";

import { cn } from "@/lib/utils";
import type { QuestionBankTab } from "../_lib/types";

export function EmptyState({
  tab,
}: {
  onCreateQuestion: () => void;
  tab: QuestionBankTab;
}) {
  const isGlobal = tab === "global";

  return (
    <div
      className={cn(
        "rounded-[28px] border border-dashed bg-white px-6 py-14 text-center shadow-[0_18px_42px_rgba(15,23,42,0.04)]",
        isGlobal ? "border-[#d9e2ef]" : "border-[#ecdcc8]",
      )}
    >
      <div className="mx-auto flex max-w-md flex-col items-center">
        <div className="relative mb-6 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-4xl bg-[radial-gradient(circle_at_top,#f5f7fb,transparent_68%)]" />
          <div className="absolute left-3 top-6 h-16 w-16 rounded-[22px] border border-[#e5e7eb] bg-white shadow-sm" />
          <div className="absolute right-2 top-2 h-16 w-16 rounded-[22px] border border-[#e8ebf0] bg-[#fafafa] shadow-sm" />
          <div className="absolute bottom-5 right-6 h-3 w-10 rounded-full bg-[#e5e7eb]" />
          <div className="absolute bottom-10 right-6 h-3 w-14 rounded-full bg-[#f0f2f5]" />
        </div>

        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#111827]">
          Асуулт алга байна
        </h3>
      </div>
    </div>
  );
}
