export function QuestionBankSkeleton() {
  return (
    <div
      className="bg-white pb-12 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Ачааллаж байна"
    >
      <div className="mx-auto max-w-[1184px] space-y-5 px-6 pt-[28px]">
        <section className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="h-7 w-[min(340px,90%)] rounded-md bg-[#e3e7ee]" />
            <div className="h-4 w-[min(260px,80%)] rounded bg-[#eef1f7]" />
          </div>
          <div className="h-[76px] min-w-[220px] shrink-0 rounded-[16px] bg-[#e3e7ee] sm:h-[88px] sm:min-w-[320px]" />
        </section>

        <section className="rounded-2xl border border-[#e5e7eb] bg-[#FAFAFA] px-5 py-4 sm:px-6">
          <div className="h-4 w-40 rounded bg-[#e3e7ee]" />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="h-10 w-[150px] rounded-2xl bg-[#e3e7ee]" />
            <div className="h-10 w-[130px] rounded-2xl bg-[#e3e7ee]" />
            <div className="h-10 w-[min(200px,40vw)] rounded-2xl bg-[#eef1f7]" />
          </div>
        </section>
      </div>
    </div>
  );
}
