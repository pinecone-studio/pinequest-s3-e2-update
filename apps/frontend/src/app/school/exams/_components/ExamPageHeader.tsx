import { CalendarPlus2, Sparkles } from "lucide-react";

export function ExamPageHeader() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#dbe5f0] bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_55%,#eef6ff_100%)] p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8e6ff] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f5da8]">
            <Sparkles className="h-3.5 w-3.5" />
            Exam Module Overview
          </div>
          <h1 className="mt-4 text-4 font-bold text-[#0f172a] md:text-5">
            Шалгалтын удирдлага
          </h1>
          <p className="mt-2 max-w-2xl text-2 text-[#5b6b84]">
            Шалгалтын lifecycle, хуваарь, явц, шалгалтын эрсдэлийг нэг дороос
            хянах удирдлагын хэсэг.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d4ed8] px-4 py-3 text-2 font-semibold text-white shadow-[0_12px_24px_rgba(29,78,216,0.22)] transition hover:bg-[#1b43bd]"
        >
          <CalendarPlus2 className="h-4 w-4" />
          Шалгалт нэмэх
        </button>
      </div>
    </section>
  );
}
