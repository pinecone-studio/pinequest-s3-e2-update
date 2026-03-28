import { groupExamStages, schoolExams } from "@/app/school/_mock/school-data";

const stageLabel: Record<string, string> = {
  draft: "Ноорог",
  scheduled: "Товлогдсон",
  ongoing: "Явагдаж буй",
  grading: "Шалгаж буй",
  completed: "Дууссан",
};

const stageBadge: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700",
  scheduled: "bg-blue-100 text-blue-700",
  ongoing: "bg-emerald-100 text-emerald-700",
  grading: "bg-amber-100 text-amber-700",
  completed: "bg-indigo-100 text-indigo-700",
};

export default function SchoolExamsPage() {
  const grouped = groupExamStages(schoolExams);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0f172a]">Шалгалтын удирдлага</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Lifecycle: Ноорог → Товлогдсон → Явагдаж буй → Шалгаж буй → Дууссан.
          Давхцлын эрсдэлийг эрт илрүүлж, алдаа багатай удирдана.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          {(Object.keys(grouped) as Array<keyof typeof grouped>).map((k) => (
            <article key={k} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-zinc-500">{stageLabel[k]}</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900">{grouped[k].length}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-medium text-zinc-700">Шүүлтүүр:</span>
          <button className="rounded-md border border-zinc-300 px-3 py-1.5 hover:bg-zinc-50">Анги</button>
          <button className="rounded-md border border-zinc-300 px-3 py-1.5 hover:bg-zinc-50">Багш</button>
          <button className="rounded-md border border-zinc-300 px-3 py-1.5 hover:bg-zinc-50">Хичээл</button>
          <button className="rounded-md border border-zinc-300 px-3 py-1.5 hover:bg-zinc-50">Огноо</button>
          <button className="rounded-md border border-zinc-300 px-3 py-1.5 hover:bg-zinc-50">Төлөв</button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500">
                <th className="py-2">Шалгалт</th>
                <th className="py-2">Анги</th>
                <th className="py-2">Багш</th>
                <th className="py-2">Хугацаа</th>
                <th className="py-2">Явц</th>
                <th className="py-2">Төлөв</th>
                <th className="py-2">Эрсдэл</th>
              </tr>
            </thead>
            <tbody>
              {schoolExams.map((exam) => {
                const progress =
                  exam.studentCount > 0
                    ? Math.round((exam.submittedCount / exam.studentCount) * 100)
                    : 0;
                return (
                  <tr key={exam.id} className="border-b border-zinc-100 align-top">
                    <td className="py-3">
                      <p className="font-medium text-zinc-900">{exam.title}</p>
                      <p className="text-xs text-zinc-500">{exam.subject}</p>
                    </td>
                    <td className="py-3">{exam.className}</td>
                    <td className="py-3">{exam.teacherName}</td>
                    <td className="py-3 text-xs text-zinc-600">
                      {exam.startAt}
                      <br />
                      {exam.endAt}
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-zinc-800">{progress}%</p>
                      <p className="text-xs text-zinc-500">
                        {exam.submittedCount}/{exam.studentCount}
                      </p>
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${stageBadge[exam.stage]}`}>
                        {stageLabel[exam.stage]}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-amber-700">
                      {exam.issues?.length ? exam.issues[0] : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
