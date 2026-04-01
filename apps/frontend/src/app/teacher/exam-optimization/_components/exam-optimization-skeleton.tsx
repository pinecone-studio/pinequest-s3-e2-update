/** @format */

export function ExamOptimizationSkeleton() {
  return (
    <section
      className="w-full overflow-x-hidden px-6 py-8 sm:px-10 sm:py-10"
      role="status"
      aria-busy="true"
      aria-label="Шалгалтын хяналт ачааллаж байна"
    >
      <div className="mx-auto max-w-6xl animate-pulse space-y-10">
        <div className="rounded-xl border border-[#d4d4d8] bg-[#FAFAFA] px-8 py-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="h-6 w-[min(280px,85vw)] rounded bg-[#e3e7ee]" />
              <div className="h-4 w-[min(420px,95vw)] rounded bg-[#eef1f7]" />
            </div>
            <div className="h-9 w-32 rounded-2xl border border-[#404040]/20 bg-white" />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {[1, 2, 3, 4].map((key) => (
              <div
                key={key}
                className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-5 w-[80%] rounded bg-[#e3e7ee]" />
                    <div className="h-4 w-[55%] rounded bg-[#eef1f7]" />
                  </div>
                  <div className="h-8 w-20 shrink-0 rounded-lg bg-[#eef1f7]" />
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-8 flex-1 rounded-lg bg-[#f4f6fa]" />
                  <div className="h-8 w-24 rounded-lg bg-[#e8edf5]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
