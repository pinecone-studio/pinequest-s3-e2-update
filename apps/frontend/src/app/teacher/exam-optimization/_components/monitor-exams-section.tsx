"use client";

import { MonitorExamCard } from "./monitor-exam-card";
import type { MonitorExamCardItem } from "../_lib/monitoring";

export function MonitorExamsSection({
  activeExamId,
  exams,
  onClearSelection,
  onOpenExam,
  totalExamCount,
}: {
  activeExamId: string | null;
  exams: MonitorExamCardItem[];
  onClearSelection: () => void;
  onOpenExam: (exam: MonitorExamCardItem) => void;
  totalExamCount: number;
}) {
  const isFiltered = Boolean(activeExamId);

  return (
    <section className="rounded-[12px] border border-[#d4d4d8] bg-[#FAFAFA] px-8 py-8 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[20px] font-bold leading-[1.2] text-[#1f2a44]">
            {isFiltered ? "Сонгосон шалгалт" : "Багшийн шалгалтууд"}
          </h2>
          <p className="mt-1 text-3 text-[#737373]">
            {isFiltered
              ? "Шалгалтын төлөв, ангийн сонголт, эхлүүлэх үйлдэл доор нэгтгэгдэн харагдана."
              : "Хяналт руу ороход энэ багшийн бүх шалгалт card хэлбэрээр харагдана."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isFiltered ? (
            <button
              type="button"
              onClick={onClearSelection}
              className="rounded-full border border-[#d7e2f1] bg-white px-4 py-2 text-3 font-semibold text-[#365077] transition hover:border-[#aac8f8] hover:text-[#1f6feb]"
            >
              Бүгдийг харах
            </button>
          ) : null}
          <span className="rounded-2xl border border-[#404040] bg-white px-4 py-1 text-[13px] font-medium text-[#2d2d2d]">
            {isFiltered ? "1 сонгогдсон" : `${totalExamCount} шалгалт`}
          </span>
        </div>
      </div>

			{isFiltered ? null : (
				<div className="mt-6 grid gap-4 lg:grid-cols-2">
					{exams.map((exam) => (
						<MonitorExamCard
							exam={exam}
              isActive={activeExamId === exam.id}
              key={exam.id}
              onOpen={() => onOpenExam(exam)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
