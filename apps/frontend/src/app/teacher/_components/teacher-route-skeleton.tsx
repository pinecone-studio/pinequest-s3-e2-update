export function TeacherRouteSkeleton() {
  return (
    <div
      className="w-full space-y-6 py-2 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Ачааллаж байна"
    >
      <div className="space-y-3">
        <div className="h-8 w-[min(280px,75%)] rounded-lg bg-[#e3e7ee]" />
        <div className="h-5 w-[min(400px,92%)] rounded-md bg-[#eef1f7]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((key) => (
          <div
            key={key}
            className="flex min-h-[5.5rem] gap-4 rounded-2xl border border-[#eef2f6] bg-[#f8fafc] p-5"
          >
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-[#e3e7ee]" />
            <div className="min-w-0 flex-1 space-y-2.5 pt-1">
              <div className="h-5 w-3/5 rounded bg-[#e3e7ee]" />
              <div className="h-4 w-2/5 rounded bg-[#eef1f7]" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-36 w-full rounded-2xl bg-[#eef1f7]" />
    </div>
  );
}
