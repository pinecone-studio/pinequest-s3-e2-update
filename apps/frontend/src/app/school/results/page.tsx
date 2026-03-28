import {
  classPerformance,
  schoolExams,
  teacherPerformance,
} from "@/app/school/_mock/school-data";

export default function SchoolResultsPage() {
  const completedCount = schoolExams.filter((x) => x.stage === "completed").length;
  const gradingCount = schoolExams.filter((x) => x.stage === "grading").length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0f172a]">Хяналт / Үр дүн</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Багшийн оруулсан явц, дүн, үнэлгээний статусыг school түвшинд нэгтгэнэ.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Дууссан шалгалт</p>
            <p className="mt-2 text-2xl font-bold">{completedCount}</p>
          </article>
          <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Шалгаж буй</p>
            <p className="mt-2 text-2xl font-bold">{gradingCount}</p>
          </article>
          <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Дундаж тэнцэлт</p>
            <p className="mt-2 text-2xl font-bold">83%</p>
          </article>
          <article className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-xs uppercase tracking-wide text-red-600">Эрсдэл</p>
            <p className="mt-2 text-2xl font-bold text-red-700">2 анги</p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0f172a]">Анги түвшний дүн шинжилгээ</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="py-2">Анги</th>
                  <th className="py-2">Дундаж</th>
                  <th className="py-2">Тэнцэлт</th>
                  <th className="py-2">Сул хичээл</th>
                </tr>
              </thead>
              <tbody>
                {classPerformance.map((row) => (
                  <tr key={row.className} className="border-b border-zinc-100">
                    <td className="py-2 font-medium">{row.className}</td>
                    <td className="py-2">{row.averageScore}%</td>
                    <td className="py-2">{row.passRate}%</td>
                    <td className="py-2 text-amber-700">{row.weakSubject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0f172a]">Багш түвшний хяналт</h3>
          <ul className="mt-4 space-y-3">
            {teacherPerformance.map((row) => (
              <li key={row.teacherName} className="rounded-lg border border-zinc-200 p-3">
                <p className="font-medium text-zinc-900">{row.teacherName}</p>
                <p className="mt-1 text-sm text-zinc-600">
                  Сарын шалгалт: {row.examsThisMonth} · Дундаж дүн: {row.avgScore}%
                </p>
                <p className={`mt-1 text-sm ${row.gradingDelayHours > 8 ? "text-red-700" : "text-emerald-700"}`}>
                  Үнэлгээ хоцролт: {row.gradingDelayHours} цаг
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
