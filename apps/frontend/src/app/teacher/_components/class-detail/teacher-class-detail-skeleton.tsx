/** @format */

export function TeacherClassDetailSkeleton() {
  return (
    <section
      className="px-4 py-6 sm:px-10 sm:py-10"
      role="status"
      aria-busy="true"
      aria-label="Ангийн хуудас ачааллаж байна"
    >
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="rounded-2xl bg-white p-4 sm:p-6">
          <div className="h-5 w-48 rounded bg-[#e3e7ee] sm:h-6" />
          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row">
            <div className="h-12 w-12 shrink-0 rounded-xl border border-[#e3e7ee] bg-[#EDF6FF]" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-8 w-[min(200px,55vw)] rounded bg-[#e3e7ee]" />
              <div className="h-4 w-full max-w-[420px] rounded bg-[#eef1f7]" />
              <div className="h-4 w-full max-w-[360px] rounded bg-[#f4f6fa]" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 rounded-2xl bg-[#EDF6FF] p-2 sm:gap-6">
          <div className="h-[52px] flex-1 rounded-xl bg-[#cfe4ff]/60 sm:min-w-[200px] sm:flex-none" />
          <div className="h-[52px] flex-1 rounded-xl bg-[#d9e8f8]/80 sm:min-w-[200px] sm:flex-none" />
        </div>

        <div className="rounded-2xl bg-white p-5 sm:p-8">
          <div className="mx-auto flex max-w-[930px] flex-wrap justify-between gap-3">
            <div className="space-y-2">
              <div className="h-7 w-36 rounded bg-[#e3e7ee]" />
              <div className="h-4 w-[min(320px,85vw)] rounded bg-[#eef1f7]" />
            </div>
            <div className="h-10 w-36 rounded-xl border border-[#e5e7eb] bg-[#f8fafc]" />
          </div>

          <div className="mx-auto mt-5 max-w-[930px] rounded-xl px-2 py-6 sm:px-4">
            <div className="mx-auto mb-3 h-[2px] w-full rounded bg-[#e5e7eb]" />
            <div className="mx-auto h-5 w-56 rounded bg-[#eef1f7]" />
          </div>

          <div className="mt-6 grid justify-items-center gap-y-4 md:justify-center md:[grid-template-columns:repeat(2,455px)] md:gap-x-[20px]">
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <div
                key={key}
                className="flex h-[86px] w-full max-w-[455px] items-center justify-between gap-4 rounded-[12px] border border-[#e5e7eb] bg-[#fafbfc] px-4 py-4 sm:px-5 md:w-[455px]"
              >
                <div className="flex flex-1 items-center gap-4">
                  <div className="h-5 w-8 rounded bg-[#e3e7ee]" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-5 w-[min(180px,55vw)] rounded bg-[#e3e7ee]" />
                    <div className="h-4 w-[min(100px,40vw)] rounded bg-[#eef1f7]" />
                  </div>
                </div>
                <div className="h-8 w-8 shrink-0 rounded-lg bg-[#eef1f7]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
