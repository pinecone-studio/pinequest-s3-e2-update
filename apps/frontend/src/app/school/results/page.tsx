"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  recentActivities,
  schoolExams,
} from "@/app/school/_mock/school-data";

type CalendarScheduleItem = {
  id: string;
  examTitle: string;
  className: string;
  location: string;
  examDate: string;
  startTime: string;
  endTime: string;
  notes: string;
};

const CALENDAR_STORAGE_KEY = "pinequest.schoolExamSchedule.v1";

function extractGradeValue(className: string) {
  const match = className.match(/\d+/);
  return match ? match[0] : className;
}

function readCalendarSchedules() {
  if (typeof window === "undefined") return [] as CalendarScheduleItem[];
  try {
    const raw = window.localStorage.getItem(CALENDAR_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CalendarScheduleItem[]) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.examTitle === "string" &&
        typeof item.className === "string" &&
        typeof item.examDate === "string" &&
        typeof item.startTime === "string" &&
        typeof item.endTime === "string",
    );
  } catch {
    return [];
  }
}

function getCalendarStatus(item: CalendarScheduleItem, now = new Date()) {
  const note = item.notes.toLowerCase();
  if (note.includes("ноорог") || note.includes("draft")) return "draft" as const;
  if (note.includes("шалгаж") || note.includes("grading")) return "grading" as const;
  const start = new Date(`${item.examDate}T${item.startTime}:00`);
  const end = new Date(`${item.examDate}T${item.endTime}:00`);
  if (now < start) return "scheduled" as const;
  if (now >= start && now <= end) return "ongoing" as const;
  return "completed" as const;
}

function formatLocation(location: string) {
  const value = location.trim();
  if (!value) return "Тодорхойгүй";
  if (value.toLowerCase().includes("тоот")) return value;
  return `${value} тоот`;
}

export default function SchoolResultsPage() {
  const [calendarSchedules, setCalendarSchedules] = useState<CalendarScheduleItem[]>([]);
  const [selectedQuarterOverview, setSelectedQuarterOverview] = useState("all");
  const [selectedClassOverview, setSelectedClassOverview] = useState("all");
  const [selectedSubjectOverview, setSelectedSubjectOverview] = useState("all");
  const [selectedSummary, setSelectedSummary] = useState<
    "completed" | "scheduled" | "pass" | "attention"
    | null
  >(null);
  useEffect(() => {
    const sync = () => setCalendarSchedules(readCalendarSchedules());
    sync();
    window.addEventListener("storage", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("storage", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const currentMonthPrefix = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const currentMonthSchedules = useMemo(
    () => calendarSchedules.filter((item) => item.examDate.startsWith(currentMonthPrefix)),
    [calendarSchedules, currentMonthPrefix],
  );

  const calendarCompletedExams = useMemo(
    () =>
      [...currentMonthSchedules]
        .filter((item) => getCalendarStatus(item) === "completed")
        .sort((a, b) => {
          const aTs = new Date(`${a.examDate}T${a.startTime}:00`).getTime();
          const bTs = new Date(`${b.examDate}T${b.startTime}:00`).getTime();
          return bTs - aTs;
        }),
    [currentMonthSchedules],
  );

  const completedCount = calendarCompletedExams.length;
  const calendarScheduledExams = useMemo(
    () =>
      [...currentMonthSchedules]
        .filter((item) => getCalendarStatus(item) === "scheduled")
        .sort((a, b) => {
          const aTs = new Date(`${a.examDate}T${a.startTime}:00`).getTime();
          const bTs = new Date(`${b.examDate}T${b.startTime}:00`).getTime();
          return aTs - bTs;
        }),
    [currentMonthSchedules],
  );
  const scheduledCount = calendarScheduledExams.length;
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
      Array.from(new Set(quarterFilteredExams.map((exam) => extractGradeValue(exam.className)))).sort((a, b) => {
        const aNum = Number(a);
        const bNum = Number(b);
        if (Number.isFinite(aNum) && Number.isFinite(bNum)) return bNum - aNum;
        return a.localeCompare(b, "mn");
      }),
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
      const topScorePercent = Math.min(100, scorePercent + 8);

      if (!current) {
        map.set(key, {
          className: exam.className,
          subject: exam.subject,
          totalScorePercent: scorePercent,
          highestScorePercent: topScorePercent,
          examCount: 1,
        });
        return;
      }

      current.totalScorePercent += scorePercent;
      current.highestScorePercent = Math.max(current.highestScorePercent, topScorePercent);
      current.examCount += 1;
    });

    return Array.from(map.values())
      .map((row) => ({
        className: row.className,
        subject: row.subject,
        averagePercent: Math.round(row.totalScorePercent / row.examCount),
        highestScorePercent: row.highestScorePercent,
      }))
      .filter(
        (row) =>
          selectedClassOverview === "all" ||
          extractGradeValue(row.className) === selectedClassOverview,
      )
      .filter((row) => selectedSubjectOverview === "all" || row.subject === selectedSubjectOverview)
      .sort((a, b) => {
        if (a.className !== b.className) return a.className.localeCompare(b.className, "mn");
        return a.subject.localeCompare(b.subject, "mn");
      });
  }, [quarterFilteredExams, selectedClassOverview, selectedSubjectOverview]);
  const averagePassRate = useMemo(() => {
    if (aggregatedByClassSubjectOverview.length === 0) return 0;
    return Math.round(
      aggregatedByClassSubjectOverview.reduce((sum, row) => sum + row.averagePercent, 0) /
        aggregatedByClassSubjectOverview.length,
    );
  }, [aggregatedByClassSubjectOverview]);
  const attentionRows = useMemo(
    () =>
      aggregatedByClassSubjectOverview.filter((row) => row.averagePercent < 80),
    [aggregatedByClassSubjectOverview],
  );
  const attentionClassCount = useMemo(
    () => new Set(attentionRows.map((row) => row.className)).size,
    [attentionRows],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0f172a]">Үр дүн</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Багшийн оруулсан явц, дүн, үнэлгээний статусыг school түвшинд нэгтгэнэ.
        </p>
        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.2fr]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
              onClick={() => setSelectedSummary("scheduled")}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition hover:bg-zinc-100"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Товлогдсон шалгалт</p>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </div>
              <p className="mt-2 text-2xl font-bold">{scheduledCount}</p>
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
              <p className="mt-2 text-2xl font-bold text-red-700">{attentionClassCount} анги</p>
            </button>
          </div>
          <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="text-base font-semibold text-[#0f172a]">Сүүлийн үйл ажиллагаа</h3>
            <ul className="mt-3 space-y-3">
              {recentActivities.map((line) => (
                <li
                  key={line}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700"
                >
                  {line}
                </li>
              ))}
            </ul>
          </article>
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
                    {selectedSummary === "scheduled" ? "Товлогдсон шалгалтын дэлгэрэнгүй" : null}
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
                    {calendarCompletedExams.map((exam) => (
                      <li key={exam.id} className="rounded-md border border-zinc-200 bg-white px-3 py-2">
                        <p className="font-medium text-zinc-900">
                          {exam.className} · {exam.examTitle}
                        </p>
                        <p className="mt-1 text-zinc-600">
                          Огноо: {exam.examDate} · Цаг: {exam.startTime}-{exam.endTime}
                        </p>
                        <p className="mt-1 text-zinc-600">
                          Анги: {exam.className} · Байршил: {formatLocation(exam.location)}
                        </p>
                      </li>
                    ))}
                    {calendarCompletedExams.length === 0 ? (
                      <li className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-500">
                        Календарь дээр дууссан шалгалт алга.
                      </li>
                    ) : null}
                  </ul>
                ) : null}
                {selectedSummary === "scheduled" ? (
                  <ul className="space-y-2 text-sm text-zinc-700">
                    {calendarScheduledExams.map((exam) => (
                      <li key={exam.id} className="rounded-md border border-zinc-200 bg-white px-3 py-2">
                        <p className="font-medium text-zinc-900">
                          {exam.className} · {exam.examTitle}
                        </p>
                        <p className="mt-1 text-zinc-600">
                          Огноо: {exam.examDate} · Цаг: {exam.startTime}-{exam.endTime}
                        </p>
                        <p className="mt-1 text-zinc-600">
                          Анги: {exam.className} · Байршил: {formatLocation(exam.location)}
                        </p>
                      </li>
                    ))}
                    {calendarScheduledExams.length === 0 ? (
                      <li className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-500">
                        Энэ сард товлогдсон шалгалт алга.
                      </li>
                    ) : null}
                  </ul>
                ) : null}
                {selectedSummary === "pass" ? (
                  <ul className="space-y-2 text-sm text-zinc-700">
                    {aggregatedByClassSubjectOverview.map((row) => (
                      <li key={`${row.className}-${row.subject}`} className="rounded-md border border-zinc-200 bg-white px-3 py-2">
                        <p className="font-medium text-zinc-900">
                          {row.className} · {row.subject} · Тэнцэлт {row.averagePercent}%
                        </p>
                        <p className="mt-1 text-zinc-600">Дээд оноо: {row.highestScorePercent}%</p>
                      </li>
                    ))}
                    {aggregatedByClassSubjectOverview.length === 0 ? (
                      <li className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-500">
                        Сонгосон шүүлтүүрт тохирох өгөгдөл алга.
                      </li>
                    ) : null}
                  </ul>
                ) : null}
                {selectedSummary === "attention" ? (
                  <ul className="space-y-2 text-sm text-zinc-700">
                    {attentionRows.map((row) => (
                      <li key={`${row.className}-${row.subject}`} className="rounded-md border border-red-200 bg-white px-3 py-2">
                        <p className="font-medium text-zinc-900">
                          {row.className} · {row.subject}
                        </p>
                        <p className="mt-1 text-zinc-600">
                          Тэнцэлт: {row.averagePercent}% · Дээд оноо: {row.highestScorePercent}%
                        </p>
                      </li>
                    ))}
                    {attentionRows.length === 0 ? (
                      <li className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-500">
                        Дундаж тэнцэлт 80%-аас бага анги алга.
                      </li>
                    ) : null}
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
                {classOptionsOverview.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
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
                    <th className="py-2 pr-3 text-center">Дээд оноо (%)</th>
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
              <div className="mt-3">
                <div className="mb-3 flex items-center gap-4 text-xs text-zinc-600">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    Дундаж
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#69b89a]" />
                    Дээд оноо
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <div className="flex min-w-[560px] items-end gap-4 pb-2">
                    {aggregatedByClassSubjectOverview.map((row) => (
                      <div key={`bar-${row.className}-${row.subject}`} className="w-24 shrink-0">
                        <div className="mx-auto flex h-44 items-end justify-center gap-2">
                          <div className="flex h-full w-7 flex-col justify-end">
                            <p className="mb-1 text-center text-[10px] font-medium text-zinc-600">
                              {row.averagePercent}%
                            </p>
                            <div className="flex h-full items-end rounded-md bg-zinc-200/70">
                              <div
                                className="w-full rounded-md bg-blue-500"
                                style={{ height: `${Math.max(row.averagePercent, 2)}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex h-full w-7 flex-col justify-end">
                            <p className="mb-1 text-center text-[10px] font-medium text-zinc-600">
                              {row.highestScorePercent}%
                            </p>
                            <div className="flex h-full items-end rounded-md bg-zinc-200/70">
                              <div
                                className="w-full rounded-md bg-[#69b89a]"
                                style={{ height: `${Math.max(row.highestScorePercent, 2)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 truncate text-center text-xs font-medium text-zinc-700">{row.className}</p>
                        <p className="truncate text-center text-xs text-zinc-500">{row.subject}</p>
                      </div>
                    ))}
                  </div>
                </div>
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
