/** @format */

export function TeacherExamSkeleton() {
  return (
    <div
      className="space-y-6 p-2 pb-8 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Шалгалтын хуудас ачааллаж байна"
    >
      <section className="p-5">
        <div className="h-5 w-[min(220px,70vw)] rounded bg-[#cfd8eb]" />
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="h-10 min-w-0 flex-[2] rounded-xl bg-[#e3e7ee]" />
          <div className="h-10 min-w-[100px] flex-1 rounded-xl bg-[#e8edf5]" />
          <div className="h-10 w-[120px] rounded-xl bg-[#eef1f7]" />
          <div className="h-10 min-w-[140px] flex-[1.5] rounded-xl bg-[#e3e7ee]" />
          <div className="h-10 min-w-[140px] flex-[1.5] rounded-xl bg-[#eef1f7]" />
          <div className="h-10 w-[100px] shrink-0 rounded-xl bg-[#e8edf5]" />
        </div>
        <div className="mt-4 h-24 w-full rounded-xl border border-[#e5e5e5] bg-[#f4f6fa]" />
      </section>

      <div className="grid gap-6">
        <section className="mx-5 rounded-[12px] border border-[#d7e6fb] bg-[#EDF6FF] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 pb-4">
            <div className="space-y-2">
              <div className="h-5 w-[min(200px,55vw)] rounded bg-[#b8cfe8]/90" />
              <div className="h-4 w-[min(160px,45vw)] rounded bg-[#c9dcf0]/90" />
            </div>
            <div className="space-y-2 text-right">
              <div className="ml-auto h-6 w-24 rounded bg-[#b8cfe8]/90" />
              <div className="ml-auto h-4 w-20 rounded bg-[#c9dcf0]/80" />
            </div>
          </div>
          <div className="h-[7.5rem] rounded-[12px] border border-dashed border-[#a8bfd9] bg-white/40" />
        </section>

        <section className="mx-5 rounded-xl border border-[#d7e6fb] bg-[#EDF6FF] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 pb-4">
            <div className="h-4 w-[min(200px,60vw)] rounded bg-[#b8cfe8]/90" />
            <div className="h-6 w-24 rounded bg-[#b8cfe8]/90" />
          </div>
          <CardPlaceholder />
          <div className="mt-4">
            <CardPlaceholder />
          </div>
        </section>
      </div>
    </div>
  );
}

function CardPlaceholder() {
  return (
    <div className="rounded-xl border border-[#a7adb8]/40 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-8 rounded-md bg-[#e3e7ee]" />
        <div className="h-6 w-16 rounded-md bg-[#eef1f7]" />
        <div className="h-6 w-20 rounded-md bg-[#e8edf5]" />
      </div>
      <div className="mt-5 h-6 w-[min(90%,420px)] rounded bg-[#e3e7ee]" />
      <div className="mt-3 h-4 w-full max-w-md rounded bg-[#f0f3f8]" />
      <div className="mt-2 h-4 w-[min(70%,300px)] rounded bg-[#f4f6fa]" />
    </div>
  );
}
