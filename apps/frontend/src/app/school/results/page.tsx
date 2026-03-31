"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  classPerformance,
  schoolExams,
} from "@/app/school/_mock/school-data";

export default function SchoolResultsPage() {
  const [selectedQuarterOverview, setSelectedQuarterOverview] = useState("all");
  const [selectedClassOverview, setSelectedClassOverview] = useState("all");
  const [selectedSubjectOverview, setSelectedSubjectOverview] = useState("all");
  const [selectedSummary, setSelectedSummary] = useState<
    "completed" | "grading" | "pass" | "attention"
    | null
  >(null);
  const completedCount = schoolExams.filter((x) => x.stage === "completed").length;
  const gradingCount = schoolExams.filter((x) => x.stage === "grading").length;
  const averagePassRate = Math.round(
    classPerformance.reduce((sum, row) => sum + row.passRate, 0) / classPerformance.length
  );
  const attentionClasses = [...classPerformance]
    .sort((a, b) => a.passRate - b.passRate)
    .slice(0, 2);
  const classSubjectMeta = useMemo(() => {
    const map = new Map<string, { teacherName: string; date: string }>();
    for (const exam of schoolExams) {
      const key = `${exam.className}__${exam.subject}`;
      if (!map.has(key)) {
        map.set(key, { teacherName: exam.teacherName, date: exam.startAt });
      }
    }
    return map;
  }, []);
  const quarterOf = (startAt: string) => {
    const month = Number(startAt.slice(5, 7));
    if (Number.isNaN(month) || month < 1 || month > 12) return "Q1";
    if (month <= 3) return "Q1";
    if (month <= 6) return "Q2";
    if (month <= 9) return "Q3";
    return "Q4";
  };
  const quarterFilteredExams = useMemo(() => {
    if (selectedQuarterOverview === "all") return schoolExams;
    return schoolExams.filter((exam) => quarterOf(exam.startAt) === selectedQuarterOverview);
  }, [selectedQuarterOverview]);
  const classOptionsOverview = useMemo(
    () =>
      Array.from(new Set(quarterFilteredExams.map((exam) => exam.className))).sort((a, b) =>
        a.localeCompare(b, "mn")
      ),
    [quarterFilteredExams]
  );
  const subjectOptionsOverview = useMemo(
    () =>
      Array.from(new Set(quarterFilteredExams.map((exam) => exam.subject))).sort((a, b) =>
        a.localeCompare(b, "mn")
      ),
    [quarterFilteredExams]
  );
  const aggregatedByClassSubjectOverview = useMemo(() => {
    const map = new Map<
      string,
      {
        className: string;
        subject: string;
        totalScorePercent: number;
        highestScorePercent: number;
        examCount: number;
      }
    >();

    quarterFilteredExams.forEach((exam) => {
      const key = `${exam.className}__${exam.subject}`;
      const current = map.get(key);
      const scorePercent =
        exam.studentCount > 0
          ? Math.round((exam.submittedCount / exam.studentCount) * 100)
          : 0;

      if (!current) {
        map.set(key, {
          className: exam.className,
          subject: exam.subject,
          totalScorePercent: scorePercent,
          highestScorePercent: scorePercent,
          examCount: 1,
        });
        return;
      }

      current.totalScorePercent += scorePercent;
      current.highestScorePercent = Math.max(current.highestScorePercent, scorePercent);
      current.examCount += 1;
    });

    return Array.from(map.values())
      .map((row) => ({
        className: row.className,
        subject: row.subject,
        averagePercent: Math.round(row.totalScorePercent / row.examCount),
        highestScorePercent: row.highestScorePercent,
      }))
      .filter((row) => selectedClassOverview === "all" || row.className === selectedClassOverview)
      .filter((row) => selectedSubjectOverview === "all" || row.subject === selectedSubjectOverview)
      .sort((a, b) => {
        if (a.className !== b.className) return a.className.localeCompare(b.className, "mn");
        return a.subject.localeCompare(b.subject, "mn");
      });
  }, [quarterFilteredExams, selectedClassOverview, selectedSubjectOverview]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0f172a]">Үр дүн</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Багшийн оруулсан явц, дүн, үнэлгээний статусыг school түвшинд нэгтгэнэ.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <button
            type="button"
            onClick={() => setSelectedSummary("completed")}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition hover:bg-zinc-100"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Дууссан шалгалт</p>
              <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">{completedCount}</p>
          </button>
          <button
            type="button"
            onClick={() => setSelectedSummary("grading")}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition hover:bg-zinc-100"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Шалгаж буй</p>
              <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">{gradingCount}</p>
          </button>
          <button
            type="button"
            onClick={() => setSelectedSummary("pass")}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition hover:bg-zinc-100"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Дундаж тэнцэлт</p>
              <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">{averagePassRate}%</p>
          </button>
          <button
            type="button"
            onClick={() => setSelectedSummary("attention")}
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-left transition hover:bg-red-100"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-red-600">Анхаарах</p>
              <ArrowUpRight className="h-4 w-4 text-red-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-red-700">{attentionClasses.length} анги</p>
          </button>
        </div>

      </section>

      {selectedSummary ? (
        <div
          className="fixed inset-0 z-50 bg-[#0f172a]/30 backdrop-blur-sm"
          onClick={() => setSelectedSummary(null)}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-zinc-900">
                    {selectedSummary === "completed" ? "Дууссан шалгалтын дэлгэрэнгүй" : null}
                    {selectedSummary === "grading" ? "Шалгаж буй шалгалтын дэлгэрэнгүй" : null}
                    {selectedSummary === "pass" ? "Дундаж тэнцэлтийн дэлгэрэнгүй" : null}
                    {selectedSummary === "attention" ? "Анхаарах ангийн дэлгэрэнгүй" : null}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSummary(null)}
                  className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                  aria-label="Хаах"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-3 max-h-[65vh] overflow-y-auto pr-1">
                {selectedSummary === "completed" ? (
                  <ul className="space-y-2 text-sm text-zinc-700">
                    {schoolExams
                      .filter((exam) => exam.stage === "completed")
                      .map((exam) => (
                        <li key={exam.id} className="rounded-md border border-zinc-200 bg-white px-3 py-2">
                          <p className="font-medium text-zinc-900">
                            {exam.className} · {exam.subject} · {exam.title}
                          </p>
                          <p className="mt-1 text-zinc-600">
                            Огноо: {exam.startAt} · Багш: {exam.teacherName}
                          </p>
                        </li>
                      ))}
                  </ul>
                ) : null}
                {selectedSummary === "grading" ? (
                  <ul className="space-y-2 text-sm text-zinc-700">
                    {schoolExams
                      .filter((exam) => exam.stage === "grading")
                      .map((exam) => (
                        <li key={exam.id} className="rounded-md border border-zinc-200 bg-white px-3 py-2">
                          <p className="font-medium text-zinc-900">
                            {exam.className} · {exam.subject} · {exam.title}
                          </p>
                          <p className="mt-1 text-zinc-600">
                            Огноо: {exam.startAt} · Багш: {exam.teacherName}
                          </p>
                        </li>
                      ))}
                  </ul>
                ) : null}
                {selectedSummary === "pass" ? (
                  <ul className="space-y-2 text-sm text-zinc-700">
                    {classPerformance.map((row) => {
                      const meta = classSubjectMeta.get(`${row.className}__${row.weakSubject}`);
                      return (
                        <li key={row.className} className="rounded-md border border-zinc-200 bg-white px-3 py-2">
                          <p className="font-medium text-zinc-900">
                            {row.className} · Тэнцэлт {row.passRate}% · Дундаж {row.averageScore}%
                          </p>
                          <p className="mt-1 text-zinc-600">
                            Огноо: {meta?.date ?? "-"} · Багш: {meta?.teacherName ?? "-"}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                {selectedSummary === "attention" ? (
                  <ul className="space-y-2 text-sm text-zinc-700">
                    {attentionClasses.map((row) => {
                      const meta = classSubjectMeta.get(`${row.className}__${row.weakSubject}`);
                      return (
                        <li key={row.className} className="rounded-md border border-red-200 bg-white px-3 py-2">
                          <p className="font-medium text-zinc-900">
                            {row.className} · Тэнцэлт {row.passRate}% · Анхаарах хичээл: {row.weakSubject}
                          </p>
                          <p className="mt-1 text-zinc-600">
                            Огноо: {meta?.date ?? "-"} · Багш: {meta?.teacherName ?? "-"}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedSummary(null)}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Хаах
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section>
        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0f172a]">Гүйцэтгэлийн тойм (анги)</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <label className="block text-sm font-medium text-zinc-600">
              Улирал
              <select
                value={selectedQuarterOverview}
                onChange={(e) => setSelectedQuarterOverview(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
              >
                <option value="all">Бүх улирал</option>
                <option value="Q1">I улирал</option>
                <option value="Q2">II улирал</option>
                <option value="Q3">III улирал</option>
                <option value="Q4">IV улирал</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-zinc-600">
              Анги
              <select
                value={selectedClassOverview}
                onChange={(e) => setSelectedClassOverview(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
              >
                <option value="all">Бүх анги</option>
                {classOptionsOverview.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-zinc-600">
              Хичээл
              <select
                value={selectedSubjectOverview}
                onChange={(e) => setSelectedSubjectOverview(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
              >
                <option value="all">Бүх хичээл</option>
                {subjectOptionsOverview.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-2 pl-3">№</th>
                    <th className="py-2">Анги</th>
                    <th className="py-2">Хичээл</th>
                    <th className="py-2">Дундаж</th>
                    <th className="py-2 pr-3 text-center">Тэнцэлт</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedByClassSubjectOverview.map((row, index) => (
                    <tr key={`${row.className}-${row.subject}`} className="border-b border-zinc-100">
                      <td className="py-2 pl-3 text-zinc-500">{index + 1}</td>
                      <td className="py-2 font-medium text-zinc-900">{row.className}</td>
                      <td className="py-2 text-amber-700">{row.subject}</td>
                      <td className="py-2">{row.averagePercent}%</td>
                      <td className="py-2 pr-3 text-center">{row.highestScorePercent}%</td>
                    </tr>
                  ))}
                  {aggregatedByClassSubjectOverview.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-5 text-center text-zinc-500">
                        Сонгосон шүүлтүүрт тохирох шалгалт алга.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="font-medium text-zinc-800">График</p>
              <div className="mt-3 space-y-3">
                {aggregatedByClassSubjectOverview.map((row) => (
                  <div key={`bar-${row.className}-${row.subject}`}>
                    <div className="mb-1 flex items-center justify-between text-sm text-zinc-600">
                      <span>
                        {row.className} · {row.subject}
                      </span>
                      <span>
                        Дундаж {row.averagePercent}% · Тэнцэлт {row.highestScorePercent}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-200">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${row.averagePercent}%` }} />
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-zinc-200">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{ width: `${row.highestScorePercent}%` }}
                      />
                    </div>
                  </div>
                ))}
                {aggregatedByClassSubjectOverview.length === 0 ? (
                  <p className="text-sm text-zinc-500">График харуулах өгөгдөл алга.</p>
                ) : null}
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
