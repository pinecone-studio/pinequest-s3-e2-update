"use client";

type QuestionHeaderProps = {
  systemCount: number;
};

export function QuestionHeader({ systemCount }: QuestionHeaderProps) {
  return (
    <section className="h-full w-full rounded-[28px] border border-[#e7e9ee] bg-white px-6 py-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:px-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#e8ebf0] bg-[#fbfbfc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b7280]">
          System Bank
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#111827] sm:text-[2.2rem]">
            Системийн сан
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[#6b7280] sm:text-base">
            Манай системийг ашиглаж буй бүх багшид нээлттэй {systemCount} асуулт
          </p>
        </div>
      </div>
    </section>
  );
}
