/** @format */

export function ResultsPageSkeleton() {
  return (
    <div
      className="space-y-6 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Үр дүн ачааллаж байна"
    >
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="h-8 w-36 rounded-md bg-[#e8edf5]" />
        <div className="mt-2 h-4 w-[min(520px,95%)] rounded bg-[#f1f4f9]" />
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[1, 2, 3, 4].map((key) => (
              <div
                key={key}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
              >
                <div className="h-3 w-28 rounded bg-[#e3e7ee]" />
                <div className="mt-3 h-8 w-16 rounded-md bg-[#e3e7ee]" />
              </div>
            ))}
          </div>
          <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="h-5 w-52 rounded bg-[#e3e7ee]" />
            <ul className="mt-3 space-y-3">
              {[1, 2, 3, 4].map((key) => (
                <li
                  key={key}
                  className="h-12 rounded-lg border border-zinc-200 bg-white"
                />
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section>
        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-5">
          <div className="h-6 w-64 rounded-md bg-[#e8edf5]" />
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {[1, 2, 3].map((key) => (
              <div key={key} className="space-y-2">
                <div className="h-4 w-20 rounded bg-[#f1f4f9]" />
                <div className="h-10 w-full rounded-lg border border-[#eef1f6] bg-[#fafbfd]" />
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <div className="min-w-[560px] space-y-2 p-3">
                <div className="flex gap-4 border-b border-zinc-200 pb-2">
                  {[1, 2, 3, 4, 5].map((col) => (
                    <div key={col} className="h-3 flex-1 rounded bg-[#e3e7ee]" />
                  ))}
                </div>
                {[1, 2, 3, 4, 5, 6].map((row) => (
                  <div key={row} className="flex gap-4 py-2">
                    {[1, 2, 3, 4, 5].map((col) => (
                      <div
                        key={col}
                        className="h-4 flex-1 rounded bg-[#f1f4f9]"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="h-5 w-24 rounded bg-[#e3e7ee]" />
              <div className="mt-3 flex gap-4">
                <div className="h-3 w-20 rounded bg-[#e3e7ee]" />
                <div className="h-3 w-24 rounded bg-[#e3e7ee]" />
              </div>
              <div className="mt-4 flex min-h-[11rem] items-end gap-3">
                {[1, 2, 3, 4].map((key) => (
                  <div key={key} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-32 w-full items-end justify-center gap-1">
                      <div className="h-[45%] w-3 rounded-md bg-[#dbeafe]" />
                      <div className="h-[70%] w-3 rounded-md bg-[#a7f3d0]" />
                    </div>
                    <div className="h-3 w-full rounded bg-[#e3e7ee]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
