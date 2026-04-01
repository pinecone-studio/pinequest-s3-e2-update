/** @format */

export function ClassesPageSkeleton() {
  return (
    <div
      className="space-y-10 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Ангиуд ачааллаж байна"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="h-8 w-36 rounded-md bg-zinc-200" />
        <div className="h-10 w-36 rounded-lg bg-zinc-200/90" />
      </div>

      <section>
        <div className="grid gap-2 py-4 sm:grid-cols-2 lg:grid-cols-7">
          {[1, 2, 3, 4, 5, 6, 7].map((key) => (
            <div
              key={key}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="h-4 w-24 rounded bg-zinc-100" />
                <div className="h-6 w-6 rounded-md bg-zinc-100" />
              </div>
              <div className="mt-2 h-3 w-20 rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="h-6 w-56 rounded-md bg-zinc-200" />
        <div className="grid gap-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <div
              key={key}
              className="rounded-xl border border-[#d7e2f0] bg-white p-3 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="h-6 w-14 rounded bg-zinc-100" />
                <div className="h-7 w-7 rounded-md bg-zinc-100" />
              </div>
              <div className="mt-3 h-4 w-[70%] rounded bg-zinc-100" />
              <div className="mt-2 h-4 w-[90%] rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
