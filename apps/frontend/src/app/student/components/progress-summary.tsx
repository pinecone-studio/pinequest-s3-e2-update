type ProgressSummaryProps = {
  current: number;
  total: number;
  answeredCount: number;
};

export function ProgressSummary({
  current,
  total,
  answeredCount,
}: ProgressSummaryProps) {
  const progressPercent = Math.round((answeredCount / total) * 100);

  return (
    <section className="rounded-2xl border border-[#dbe3f0] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-4 font-semibold text-[#2e3f63]">
          Явц: {current}/{total} асуулт
        </p>
        <p className="text-3 text-[#5f7090]">
          Явц: {answeredCount}/{total} хариулсан
        </p>
      </div>
      <div className="mt-3 h-2.5 rounded-full bg-[#e8eef8]">
        <div
          className="h-2.5 rounded-full bg-[#3b82f6] transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </section>
  );
}
