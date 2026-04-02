/** @format */

export function ExamsPageSkeleton() {
  return (
    <div
      className="space-y-6 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Шалгалт ачааллаж байна"
    >
      <div className="w-full rounded-2xl border border-[#e2e8f0] bg-[#fcfdff] p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-[min(260px,75vw)] rounded-lg bg-[#e2e8f0]" />
            <div className="h-4 w-[min(400px,92vw)] rounded-md bg-[#e8edf5]" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-[#f1f5f9]" />
                <div className="h-9 w-9 rounded-lg bg-[#f1f5f9]" />
              </div>
              <div className="h-6 w-[min(180px,45vw)] rounded-md bg-[#e2e8f0]" />
              <div className="h-8 w-[7.5rem] rounded-lg bg-[#f1f5f9]" />
            </div>

            <div className="mt-4 grid grid-cols-7 gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map((key) => (
                <div key={key} className="h-9 rounded-xl bg-[#f1f5f9]" />
              ))}
            </div>

            <div className="mt-3 grid grid-cols-7 gap-3">
              {Array.from({ length: 35 }, (_, key) => (
                <div
                  key={key}
                  className="min-h-[118px] rounded-xl border border-[#e2e8f0] bg-white"
                >
                  <div className="p-2.5">
                    <div className="h-4 w-6 rounded bg-[#f1f5f9]" />
                    <div className="mt-2 space-y-1.5">
                      <div className="h-12 rounded-lg bg-[#f8fafc]" />
                      <div className="h-12 rounded-lg bg-[#f8fafc]/80" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
            <div className="h-8 w-full max-w-[280px] rounded-md bg-[#e2e8f0]" />
            <div className="mt-6 space-y-6">
              {[1, 2, 3, 4, 5].map((section) => (
                <div key={section}>
                  <div className="h-3 w-32 rounded bg-[#cbd5e1]" />
                  <div className="mt-2 min-h-[3rem] rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc]" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
