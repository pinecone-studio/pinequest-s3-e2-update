"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MonitorExamCardItem } from "../_lib/monitoring";

export function MonitorGroupSelectionSection({
  exam,
  onBack,
  onOpenGroup,
}: {
  exam: MonitorExamCardItem;
  onBack: () => void;
  onOpenGroup: (classId: string) => void;
}) {
  return (
    <section className="space-y-6">
      <div className="rounded-[12px] border border-[#d4d4d8] bg-[#FAFAFA] px-8 py-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[20px] font-bold leading-[1.2] text-[#1f2a44]">
              Бүлэг сонгох
            </h2>
            <p className="mt-1 text-3 text-[#737373]">
              {exam.title} шалгалтын хяналтад орохын өмнө шалгалт авч буй бүлгээ
              сонгоно уу.
            </p>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-full border border-[#d7e2f1] bg-white px-4 py-2 text-3 font-semibold text-[#365077] transition hover:border-[#aac8f8] hover:text-[#1f6feb]"
            onClick={onBack}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Буцах
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-[8px] bg-[#d7ebff] px-4 py-1.5 text-[12px] font-medium text-[#355389]">
            {exam.subject}
          </span>
          <span className="rounded-[8px] bg-[#d7ebff] px-4 py-1.5 text-[12px] font-medium text-[#355389]">
            {exam.questionCount} асуулт
          </span>
          <span className="rounded-[8px] bg-[#d7ebff] px-4 py-1.5 text-[12px] font-medium text-[#355389]">
            {exam.totalPoints} оноо
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {exam.classOptions.map((group) => (
            <button
              className="w-full rounded-[20px] border border-[#d9dee8] bg-white p-5 text-left shadow-sm transition hover:border-[#aac8f8] hover:bg-[#f8fbff]"
              key={group.id}
              onClick={() => onOpenGroup(group.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[24px] font-semibold text-[#1f2a44]">
                    {group.label}
                  </p>
                  <p className="mt-2 text-[14px] text-[#66789f]">
                    Шалгалт авч буй бүлэг
                  </p>
                  <p className="mt-3 text-[14px] text-[#737373]">
                    Дараад одоогийн хяналтын дэлгэрэнгүй хэсэг рүү орно.
                  </p>
                </div>
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e1e7f0] bg-white">
                  <ArrowRight className="h-5 w-5 text-[#a0aabc]" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
