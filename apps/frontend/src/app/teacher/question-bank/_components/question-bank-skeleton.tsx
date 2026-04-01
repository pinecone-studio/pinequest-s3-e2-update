/** @format */

export function QuestionBankSkeleton() {
  return (
    <div
      className="animate-pulse bg-white pb-12"
      role="status"
      aria-busy="true"
      aria-label="Асуултын сан ачааллаж байна"
    >
      <div className="mx-auto max-w-[1184px] space-y-5 px-6 pt-[28px]">
        <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start">
          <div className="space-y-2.5">
            <div className="h-7 w-[min(320px,90vw)] rounded-md bg-[#e3e7ee]" />
            <div className="h-4 w-[min(280px,80vw)] rounded bg-[#eef1f7]" />
          </div>
          <div className="flex h-[76px] min-w-[220px] items-center gap-4 rounded-2xl bg-[#D7ECFF]/90 px-8 sm:min-w-[320px]">
            <div className="h-12 w-16 rounded-lg bg-[#b8d4f0]/80" />
            <div className="h-5 w-24 rounded bg-[#b8d4f0]/70" />
          </div>
        </section>

        <section className="rounded-2xl border border-[#e5e7eb] bg-[#FAFAFA] px-5 py-4 sm:px-6">
          <div className="h-4 w-36 rounded bg-[#e3e7ee]" />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="h-10 w-[150px] rounded-2xl bg-white ring-1 ring-[#e5e7eb]" />
            <div className="h-10 w-[100px] rounded-2xl bg-white ring-1 ring-[#e5e7eb]" />
            <div className="h-10 w-[120px] rounded-2xl bg-[#e3e7ee]/80" />
          </div>
        </section>

        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-12 w-full max-w-md rounded-2xl bg-[#eef1f7]" />
          <div className="h-12 w-full max-w-[200px] rounded-2xl bg-[#122459]/10" />
        </section>
      </div>
    </div>
  );
}
