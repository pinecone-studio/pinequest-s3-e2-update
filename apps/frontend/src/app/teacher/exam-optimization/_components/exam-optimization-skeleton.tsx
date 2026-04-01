export function ExamOptimizationSkeleton() {
  return (
    <section
      className="w-full overflow-x-hidden px-6 py-8 animate-pulse sm:px-10 sm:py-10"
      role="status"
      aria-busy="true"
      aria-label="Ачааллаж байна"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-[12px] border border-[#d4d4d8] bg-[#FAFAFA] px-8 py-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="h-6 w-[min(280px,80%)] rounded bg-[#e3e7ee]" />
              <div className="h-4 w-[min(400px,95%)] rounded bg-[#eef1f7]" />
            </div>
            <div className="h-9 w-28 shrink-0 rounded-2xl bg-[#e3e7ee]" />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {[1, 2, 3, 4].map((key) => (
              <div
                key={key}
                className="rounded-[12px] border border-[#d4d4d8] bg-[#f5f5f5] p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="h-7 w-28 rounded-[8px] bg-[#e3e7ee]" />
                  <div className="h-5 w-32 rounded bg-[#eef1f7]" />
                </div>
                <div className="mt-5 h-5 w-[min(90%,320px)] rounded bg-[#e3e7ee]" />
                <div className="mt-3 h-4 w-3/4 rounded bg-[#eef1f7]" />
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="h-8 w-28 rounded-[8px] bg-[#e3e7ee]" />
                  <div className="h-8 w-24 rounded-[8px] bg-[#e3e7ee]" />
                  <div className="h-8 w-20 rounded-[8px] bg-[#eef1f7]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
