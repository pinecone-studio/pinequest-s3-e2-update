/** @format */

export function ExamsPageSkeleton() {
  return (
    <div
      className="space-y-6 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Шалгалт ачааллаж байна"
    >
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div className="rounded-3xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="h-5 w-[min(280px,90%)] rounded-md bg-[#e8edf5]" />
            <div className="h-5 w-32 rounded bg-[#eef2f8]" />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3">
            {[1, 2, 3, 4].map((key) => (
              <div
                key={key}
                className="rounded-2xl border border-[#e3ebf5] bg-white p-4"
              >
                <div className="h-4 w-40 rounded bg-[#f1f4f9]" />
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="h-2 w-24 rounded-full bg-[#e3e7ee]" />
                  <div className="h-7 w-10 rounded bg-[#e3e7ee]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="h-6 w-48 rounded-md bg-[#e8edf5]" />
            <div className="flex gap-2">
              <div className="h-9 w-9 rounded-lg bg-[#eef2f8]" />
              <div className="h-9 w-9 rounded-lg bg-[#eef2f8]" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((key) => (
              <div key={key} className="h-6 rounded bg-[#f4f6fa]" />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }, (_, key) => (
              <div
                key={key}
                className="aspect-square rounded-lg border border-[#eef1f6] bg-[#fafbfd]"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="h-5 w-48 rounded-md bg-[#e8edf5]" />
            <div className="h-4 w-[min(420px,95%)] rounded bg-[#f1f4f9]" />
          </div>
          <div className="h-8 w-28 rounded-full bg-[#eef2f8]" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="h-10 w-full max-w-md rounded-lg border border-[#eef1f6] bg-[#fafbfd]" />
          <div className="h-10 w-24 rounded-lg bg-[#e8edf5]" />
        </div>
        <div className="mt-5 overflow-x-auto">
          <div className="min-w-[1120px] space-y-3">
            <div className="flex gap-4 border-b border-[#e5edf6] pb-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((key) => (
                <div key={key} className="h-3 flex-1 rounded bg-[#e3e7ee]" />
              ))}
            </div>
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="flex gap-4 py-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                  <div
                    key={col}
                    className="h-4 flex-1 rounded bg-[#f1f4f9]"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
