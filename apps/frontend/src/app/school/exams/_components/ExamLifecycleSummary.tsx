import { CalendarPlus2 } from "lucide-react";
import { examStatusMeta } from "../_mock/school-exams";
import type { ExamStatus } from "../_types/exam";

type ExamLifecycleSummaryProps = {
  summary: Array<{
    status: ExamStatus;
    label: string;
    count: number;
  }>;
  onCreateSchedule?: () => void;
};

export function ExamLifecycleSummary({
  summary,
  onCreateSchedule,
}: ExamLifecycleSummaryProps) {
  return (
    <section className="rounded-3xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3 font-semibold text-[#0f172a]">
            Шалгалтын зохион байгуулалтын хуваарь
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <p className="text-2 font-medium text-[#46608a]">
            Нийт шалгалт: {summary.reduce((acc, item) => acc + item.count, 0)}
          </p>
          <button
            type="button"
            onClick={onCreateSchedule}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
          >
            <CalendarPlus2 className="h-4 w-4" />
            Шалгалтын хуваарь гаргах
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summary.map((item) => (
          <article
            key={item.status}
            className={`rounded-2xl border border-[#e3ebf5] bg-gradient-to-br ${examStatusMeta[item.status].cardTintClassName} p-4`}
          >
            <p className="text-2 font-medium text-[#6b7a92]">{item.label}</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-6 font-bold leading-none text-[#0f172a]">
                {item.count}
              </p>
              <div
                className={`h-2 w-14 rounded-full ${examStatusMeta[item.status].badgeClassName}`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
