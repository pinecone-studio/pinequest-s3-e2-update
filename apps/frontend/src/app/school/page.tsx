import Link from "next/link";
import {
  aiSuggestions,
  classPerformance,
  pendingActions,
  recentActivities,
  schoolSummary,
} from "@/app/school/_mock/school-data";

const summaryCards = [
  { label: "Нийт багш", value: schoolSummary.totalTeachers },
  { label: "Нийт анги", value: schoolSummary.totalClasses },
  { label: "Идэвхтэй сурагч", value: schoolSummary.activeStudents },
  { label: "Энэ 7 хоногийн шалгалт", value: schoolSummary.examsThisWeek },
  { label: "Явагдаж буй шалгалт", value: schoolSummary.ongoingExams },
  { label: "Үнэлгээ хүлээгдэж буй", value: schoolSummary.gradingPending },
];

export default function SchoolDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0f172a]">Сургуулийн самбар</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Шалгалтын төлөв, эрсдэл, гүйцэтгэлийг нэг дэлгэцнээс хянах school-level
              харагдац.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            ⚠ Давхцлын сануулга: {schoolSummary.conflictAlerts}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-xl border border-[#e6edf5] bg-[#f8fbff] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-[#0f172a]">{card.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#0f172a]">Хүлээгдэж буй ажил</h3>
            <Link href="/school/exams" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              Шалгалт руу очих →
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {pendingActions.map((item) => (
              <li key={item.id} className="rounded-lg border border-zinc-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{item.title}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.severity === "high"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.severity === "high" ? "Яаралтай" : "Дунд"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  Хариуцагч: {item.owner} · Хугацаа: {item.due}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#0f172a]">Сүүлийн үйл ажиллагаа</h3>
            <Link href="/school/results" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              Үр дүн харах →
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {recentActivities.map((line) => (
              <li key={line} className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                {line}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0f172a]">Гүйцэтгэлийн тойм (анги)</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[460px] text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="py-2">Анги</th>
                  <th className="py-2">Дундаж</th>
                  <th className="py-2">Тэнцэлт</th>
                  <th className="py-2">Эрсдэлтэй хичээл</th>
                </tr>
              </thead>
              <tbody>
                {classPerformance.map((row) => (
                  <tr key={row.className} className="border-b border-zinc-100">
                    <td className="py-2 font-medium text-zinc-900">{row.className}</td>
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
          <h3 className="text-lg font-semibold text-[#0f172a]">AI санал (практик)</h3>
          <ul className="mt-4 space-y-3">
            {aiSuggestions.map((item) => (
              <li key={item.id} className="rounded-lg border border-zinc-200 p-3">
                <p className="font-medium text-zinc-900">{item.title}</p>
                <p className="mt-1 text-sm text-zinc-600">{item.problem}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Хэрэглэгч: {item.user} · Үе шат: {item.stage}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
