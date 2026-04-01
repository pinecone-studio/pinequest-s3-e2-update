/** @format */

export function TeachersPageSkeleton() {
  return (
    <div
      className="space-y-10 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Хүний нөөц ачааллаж байна"
    >
      <div className="h-8 w-48 rounded-md bg-zinc-200" />

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-zinc-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="h-5 w-40 rounded bg-zinc-200" />
          <div className="h-10 w-full max-w-md rounded-lg bg-zinc-100 lg:flex-1" />
          <div className="h-10 w-full rounded-lg bg-zinc-200/80 sm:w-40" />
        </div>

        <div className="hidden grid-cols-[84px_minmax(240px,1fr)_minmax(220px,1fr)_170px_180px_180px] items-center gap-3 border-b border-zinc-100 bg-zinc-50 px-6 py-3 lg:grid">
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <div key={key} className="h-3 rounded bg-zinc-200/80" />
          ))}
        </div>

        <ul className="divide-y divide-zinc-100">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <li key={row} className="px-4 py-4 sm:px-6">
              <div className="grid gap-3 lg:grid-cols-[84px_minmax(240px,1fr)_minmax(220px,1fr)_170px_180px_180px] lg:items-center">
                <div className="h-8 w-10 rounded-md bg-zinc-100" />
                <div className="h-5 w-[min(200px,80%)] rounded bg-zinc-100" />
                <div className="h-5 w-[min(260px,90%)] rounded bg-zinc-100" />
                <div className="h-5 w-28 rounded bg-zinc-100" />
                <div className="mx-auto h-5 w-16 rounded bg-zinc-100 lg:mx-0" />
                <div className="flex justify-end gap-2 lg:justify-end">
                  <div className="h-8 w-8 rounded-md bg-zinc-100" />
                  <div className="h-8 w-8 rounded-md bg-zinc-100" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
