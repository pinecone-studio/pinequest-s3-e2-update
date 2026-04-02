/** @format */

export function TeacherExamSkeleton() {
  return (
    <div
      className="animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Шалгалтын хуудас ачааллаж байна"
    >
      {/* Mirrors ExamSettingsForm */}
      <section className="p-4 sm:p-5">
        <div className="h-5 w-[min(260px,75vw)] rounded bg-[#cfd8eb] sm:h-6" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-4 lg:gap-y-4">
          <div className="h-10 rounded-xl bg-[#e3e7ee] sm:col-span-2 lg:col-span-4" />
          <div className="h-10 rounded-xl bg-[#e8edf5] lg:col-span-2" />
          <div className="h-10 rounded-xl bg-[#eef1f7] sm:col-span-2 lg:col-span-2" />
          <div className="h-10 rounded-xl bg-[#e3e7ee] sm:col-span-2 lg:col-span-2" />
          <div className="h-10 rounded-xl bg-[#e8edf5] sm:col-span-2 lg:col-span-2" />
        </div>
        <div className="mt-4 rounded-xl border border-[#e5e5e5] bg-[#F5F5F5] p-3 sm:p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 h-4 w-4 shrink-0 rounded border border-[#d1d5db] bg-white" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-5 w-[min(280px,75vw)] rounded bg-[#dce3ee]" />
              <div className="h-4 w-full max-w-md rounded bg-[#e8edf5]" />
              <div className="h-4 w-full max-w-sm rounded bg-[#eef1f7]" />
            </div>
          </div>
        </div>
      </section>

      {/* Mirrors ExamOutlineSection + SavedExamsSection (page grid gap-6) */}
      <div className="grid gap-6">
        <section className="mx-3 rounded-[12px] border border-[#d7e6fb] bg-[#EDF6FF] p-4 shadow-sm sm:mx-4 sm:p-5 md:mx-5">
          <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="space-y-2">
              <div className="h-5 w-[min(200px,55vw)] rounded bg-[#b8cfe8]/90" />
              <div className="h-4 w-[min(160px,45vw)] rounded bg-[#c9dcf0]/90" />
            </div>
            <div className="shrink-0 space-y-2 sm:text-right">
              <div className="h-6 w-24 rounded bg-[#b8cfe8]/90 sm:ml-auto" />
              <div className="h-4 w-20 rounded bg-[#c9dcf0]/80 sm:ml-auto" />
            </div>
          </div>
          <div className="h-[7.5rem] rounded-[12px] border border-dashed border-[#a8bfd9] bg-white/50" />
        </section>

        <section className="mx-3 rounded-xl border border-[#d7e6fb] bg-[#EDF6FF] p-4 shadow-sm sm:mx-4 sm:p-5 md:mx-5">
          <div className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="h-4 w-[min(220px,60vw)] rounded bg-[#b8cfe8]/90" />
            <div className="h-6 w-20 rounded bg-[#b8cfe8]/90 sm:ml-auto" />
          </div>
          <div className="mt-5 grid gap-4">
            <SavedExamCardSkeleton />
            <SavedExamCardSkeleton />
          </div>
        </section>
      </div>
    </div>
  );
}

function SavedExamCardSkeleton() {
  return (
    <div className="rounded-3xl border border-[#d8e2f0] bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-5 w-[min(100%,320px)] rounded-lg bg-[#e3e7ee]" />
          <div className="h-4 w-[min(90%,280px)] rounded-lg bg-[#eef1f7]" />
        </div>
        <div className="flex shrink-0 justify-end gap-2 sm:justify-start">
          <div className="h-11 w-11 rounded-2xl border border-[#e3e7ee] bg-[#f8fafc]" />
          <div className="h-11 w-11 rounded-2xl border border-[#e3e7ee] bg-[#f8fafc]" />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 rounded-md bg-[#eef1f7]" />
          <div className="h-6 w-20 rounded-md bg-[#e8edf5]" />
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-2">
          <div className="h-10 flex-1 rounded-2xl bg-[#f4f6fa] sm:w-28 sm:flex-none" />
          <div className="h-10 flex-1 rounded-2xl bg-[#e8edf5] sm:w-32 sm:flex-none" />
          <div className="h-10 flex-1 rounded-2xl bg-[#dbeafe] sm:w-36 sm:flex-none" />
        </div>
      </div>
    </div>
  );
}
