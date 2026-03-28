"use client";

type QuestionHeaderProps = {
  globalCount: number;
  schoolCount: number;
  isSchoolTab: boolean;
};

export function QuestionHeader({
  globalCount,
  schoolCount,
  isSchoolTab,
}: QuestionHeaderProps) {
  const activeMetric = isSchoolTab
    ? {
        label: "Сургуулийн сан",
        value: schoolCount,
        hint: "Засварлах боломжтой асуултууд",
      }
    : {
        label: "Улсын сан",
        value: globalCount,
        hint: "Баталгаажсан асуултууд",
      };

  return (
    <section className="max-w-[980px] rounded-[28px] border border-[#e7e9ee] bg-white px-6 py-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e8ebf0] bg-[#fbfbfc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b7280]">
            Question Bank
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#111827] sm:text-[2.2rem]">
              Асуултын сан
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[#6b7280] sm:text-base">
              Асуултуудыг удирдах, шалгалтанд ашиглах
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <MetricCard
          hint={activeMetric.hint}
          label={activeMetric.label}
          value={activeMetric.value}
        />
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="min-w-[260px] max-w-[320px] rounded-2xl border border-[#eceef2] bg-[#fcfcfd] px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
        {label}
      </p>
      <p className="mt-2 text-[1.75rem] font-semibold tracking-[-0.03em] text-[#111827]">
        {value}
      </p>
      <p className="mt-1 text-sm text-[#6b7280]">{hint}</p>
    </div>
  );
}
