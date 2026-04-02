"use client";

import { ArrowRight } from "lucide-react";
import { type MonitorExamCardItem } from "../_lib/monitoring";

export function MonitorExamCard({
  exam,
  onOpen,
}: {
  exam: MonitorExamCardItem;
  isActive: boolean;
  onOpen: () => void;
}) {
  const classSummary =
    exam.classLabels.length > 1 ? "олон" : exam.classLabel;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-[12px] border border-[#d4d4d8] bg-[#f5f5f5] p-6 text-left transition hover:border-[#b9c0ca]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-[8px] bg-[#d7ebff] px-5 py-1 text-[12px] font-medium text-[#355389]">
          {exam.savedAtLabel}
        </span>
        <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#737373]">
          Дэлгэрэнгүй харах
          <ArrowRight className="h-5 w-5" />
        </span>
      </div>

      <h3 className="mt-5 text-[16px] font-semibold leading-[1.3] text-[#2d2d2d]">
        {exam.title}
      </h3>
      <p className="mt-3 text-[14px] leading-[1.4] text-[#737373]">
        {exam.topic?.trim()
          ? exam.topic
          : [exam.subject, exam.grade].filter(Boolean).join(" · ") || "—"}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="rounded-[8px] bg-[#d7ebff] px-4 py-1.5 text-[12px] font-medium text-[#355389]">
          Анги: {classSummary}
        </span>
        <span className="rounded-[8px] bg-[#d7ebff] px-4 py-1.5 text-[12px] font-medium text-[#355389]">
          {exam.questionCount} асуулт
        </span>
        <span className="rounded-[8px] bg-[#d7ebff] px-4 py-1.5 text-[12px] font-medium text-[#355389]">
          {exam.totalPoints} оноо
        </span>
      </div>
    </button>
  );
}
