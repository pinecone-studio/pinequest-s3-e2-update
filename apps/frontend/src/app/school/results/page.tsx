"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  classPerformance,
  schoolExams,
  teacherPerformance,
} from "@/app/school/_mock/school-data";

export default function SchoolResultsPage() {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
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
  const subjects = useMemo(
    () => Array.from(new Set(classPerformance.map((row) => row.weakSubject))),
    []
  );
  const grades = useMemo(
    () =>
      Array.from(
        new Set(
          classPerformance
            .map((row) => row.className.match(/\d+/)?.[0])
            .filter((grade): grade is string => Boolean(grade))
        )
      ).sort((a, b) => Number(a) - Number(b)),
    []
  );
  const filteredClassPerformance = useMemo(() => {
    return classPerformance.filter((row) => {
      const grade = row.className.match(/\d+/)?.[0] ?? "";
      const subjectMatch = selectedSubject === "all" || row.weakSubject === selectedSubject;
      const gradeMatch = selectedGrade === "all" || grade === selectedGrade;
      return subjectMatch && gradeMatch;
    });
  }, [selectedGrade, selectedSubject]);

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

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0f172a]">Дүн шинжилгээ</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-600" htmlFor="subject-filter">
                Хичээл сонгох
              </label>
              <select
                id="subject-filter"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm"
              >
                <option value="all">Бүх хичээл</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-600" htmlFor="grade-filter">
                Анги (түвшин) сонгох
              </label>
              <select
                id="grade-filter"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm"
              >
                <option value="all">Бүх анги</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}-р анги
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="py-2">№</th>
                  <th className="py-2">Анги</th>
                  <th className="py-2">Дундаж</th>
                  <th className="py-2">Тэнцэлт</th>
                  <th className="py-2">Хичээл</th>
                </tr>
              </thead>
              <tbody>
                {filteredClassPerformance.map((row, index) => (
                  <tr key={row.className} className="border-b border-zinc-100">
                    <td className="py-2 text-zinc-500">{index + 1}</td>
                    <td className="py-2 font-medium">{row.className}</td>
                    <td className="py-2">{row.averageScore}%</td>
                    <td className="py-2">{row.passRate}%</td>
                    <td className="py-2 text-amber-700">{row.weakSubject}</td>
                  </tr>
                ))}
                {filteredClassPerformance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-sm text-zinc-500">
                      Сонгосон нөхцөлд харгалзах дүн байхгүй байна.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-xl border border-zinc-200 p-4">
            <p className="text-sm font-semibold text-zinc-900">График харах</p>
            <div className="mt-3 space-y-3">
              {filteredClassPerformance.map((row) => (
                <div key={`chart-${row.className}`} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-600">
                    <span className="font-medium text-zinc-700">{row.className}</span>
                    <span>
                      Дундаж {row.averageScore}% · Тэнцэлт {row.passRate}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full bg-blue-500" style={{ width: `${row.averageScore}%` }} />
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full bg-emerald-500" style={{ width: `${row.passRate}%` }} />
                  </div>
                </div>
              ))}
              {filteredClassPerformance.length === 0 ? (
                <p className="text-sm text-zinc-500">График харуулах өгөгдөл алга.</p>
              ) : null}
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0f172a]">Багш түвшний хяналт</h3>
          <ul className="mt-4 space-y-3">
            {teacherPerformance.map((row) => (
              <li key={row.teacherName} className="rounded-lg border border-zinc-200 p-3">
                <p className="font-medium text-zinc-900">{row.teacherName}</p>
                <p className="mt-1 text-sm text-zinc-600">
                  Улирлын шалгалт: {row.examsThisMonth} · Дундаж дүн: {row.avgScore}%
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
