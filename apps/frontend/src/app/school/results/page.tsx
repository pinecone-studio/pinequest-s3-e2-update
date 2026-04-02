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
    <div className="mx-auto min-w-0 max-w-[1200px] space-y-5 sm:space-y-6">
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
        <h2 className="text-xl font-bold text-[#0f172a] sm:text-2xl">Үр дүн</h2>
        <p className="mt-1 text-xs leading-relaxed text-zinc-600 sm:text-sm">
          Багшийн оруулсан явц, дүн, үнэлгээний статусыг school түвшинд нэгтгэнэ.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSelectedSummary("completed")}
              className="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left transition hover:bg-zinc-100 sm:p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] uppercase leading-snug tracking-wide text-zinc-500 sm:text-xs">
                  Дууссан шалгалт
                </p>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" />
              </div>
              <p className="mt-2 text-xl font-bold tabular-nums sm:text-2xl">{completedCount}</p>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSummary("scheduled")}
              className="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left transition hover:bg-zinc-100 sm:p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] uppercase leading-snug tracking-wide text-zinc-500 sm:text-xs">
                  Товлогдсон шалгалт
                </p>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" />
              </div>
              <p className="mt-2 text-xl font-bold tabular-nums sm:text-2xl">{scheduledCount}</p>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSummary("pass")}
              className="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left transition hover:bg-zinc-100 sm:p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] uppercase leading-snug tracking-wide text-zinc-500 sm:text-xs">
                  Дундаж тэнцэлт
                </p>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" />
              </div>
              <p className="mt-2 text-xl font-bold tabular-nums sm:text-2xl">{averagePassRate}%</p>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSummary("attention")}
              className="min-w-0 rounded-xl border border-red-200 bg-red-50 p-3 text-left transition hover:bg-red-100 sm:p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] uppercase leading-snug tracking-wide text-red-600 sm:text-xs">
                  Анхаарах
                </p>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-red-400" />
              </div>
              <p className="mt-2 text-xl font-bold tabular-nums text-red-700 sm:text-2xl">
                {attentionClassCount} анги
              </p>
            </button>
          </div>
          <article className="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 p-3 sm:p-4">
            <h3 className="text-sm font-semibold text-[#0f172a] sm:text-base">Сүүлийн үйл ажиллагаа</h3>
            <ul className="mt-3 space-y-3">
              {recentActivities.map((line) => (
                <li
                  key={line}
                  className="break-words rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 sm:text-sm"
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
          <div className="flex min-h-full items-end justify-center p-3 sm:items-center sm:p-4">
            <div
              className="flex max-h-[min(92dvh,900px)] w-full max-w-[min(100vw-1.5rem,48rem)] flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl sm:max-h-[85vh] sm:p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 pr-2">
                  <p className="text-base font-semibold leading-snug text-zinc-900 sm:text-lg">
                    {selectedSummary === "completed" ? "Дууссан шалгалтын дэлгэрэнгүй" : null}
                    {selectedSummary === "scheduled" ? "Товлогдсон шалгалтын дэлгэрэнгүй" : null}
                    {selectedSummary === "pass" ? "Дундаж тэнцэлтийн дэлгэрэнгүй" : null}
                    {selectedSummary === "attention" ? "Анхаарах ангийн дэлгэрэнгүй" : null}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSummary(null)}
                  className="-mr-1 -mt-1 shrink-0 self-end rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 sm:self-start"
                  aria-label="Хаах"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 sm:max-h-[65vh]">
                {selectedSummary === "completed" ? (
                  <ul className="space-y-2 text-sm text-zinc-700">
                    {calendarCompletedExams.map((exam) => (
                      <li
                        key={exam.id}
                        className="break-words rounded-md border border-zinc-200 bg-white px-3 py-2"
                      >
                        <p className="font-medium text-zinc-900">
                          {exam.className} · {exam.examTitle}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600 sm:text-sm">
                          Огноо: {exam.examDate} · Цаг: {exam.startTime}-{exam.endTime}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600 sm:text-sm">
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
                      <li
                        key={exam.id}
                        className="break-words rounded-md border border-zinc-200 bg-white px-3 py-2"
                      >
                        <p className="font-medium text-zinc-900">
                          {exam.className} · {exam.examTitle}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600 sm:text-sm">
                          Огноо: {exam.examDate} · Цаг: {exam.startTime}-{exam.endTime}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600 sm:text-sm">
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

              <div className="mt-4 flex justify-stretch sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedSummary(null)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 sm:w-auto"
                >
                  Хаах
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section>
        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-base font-semibold text-[#0f172a] sm:text-lg">Гүйцэтгэлийн тойм (анги)</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
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
            <div className="space-y-3 sm:hidden">
              {aggregatedByClassSubjectOverview.map((row, index) => (
                <div
                  key={`m-${row.className}-${row.subject}`}
                  className="rounded-xl border border-zinc-200 bg-white p-3 text-sm shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-zinc-500">№ {index + 1}</span>
                  </div>
                  <p className="mt-2 font-medium text-zinc-900">{row.className}</p>
                  <p className="mt-0.5 text-amber-800">{row.subject}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-100 pt-3 text-xs text-zinc-600">
                    <span>
                      <span className="text-zinc-500">Дундаж:</span> {row.averagePercent}%
                    </span>
                    <span>
                      <span className="text-zinc-500">Дээд:</span> {row.highestScorePercent}%
                    </span>
                  </div>
                </div>
              ))}
              {aggregatedByClassSubjectOverview.length === 0 ? (
                <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
                  Сонгосон шүүлтүүрт тохирох шалгалт алга.
                </p>
              ) : null}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-zinc-200 sm:block">
              <table className="w-full min-w-[520px] text-sm">
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

            <div className="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 p-3 sm:p-4">
              <p className="text-sm font-medium text-zinc-800 sm:text-base">График</p>
              <div className="mt-3">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-zinc-600 sm:gap-4">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    Дундаж
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#69b89a]" />
                    Дээд оноо
                  </span>
                </div>
                <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                  <div className="flex flex-wrap items-end justify-center gap-3 pb-2 sm:min-w-[520px] sm:flex-nowrap sm:justify-start sm:gap-4">
                    {aggregatedByClassSubjectOverview.map((row) => (
                      <div
                        key={`bar-${row.className}-${row.subject}`}
                        className="w-[5.25rem] shrink-0 sm:w-24"
                      >
                        <div className="mx-auto flex h-36 items-end justify-center gap-1.5 sm:h-44 sm:gap-2">
                          <div className="flex h-full w-6 flex-col justify-end sm:w-7">
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
                          <div className="flex h-full w-6 flex-col justify-end sm:w-7">
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
                        <p className="mt-2 line-clamp-2 text-center text-[11px] font-medium leading-tight text-zinc-700 sm:text-xs">
                          {row.className}
                        </p>
                        <p className="line-clamp-2 text-center text-[10px] text-zinc-500 sm:text-xs">{row.subject}</p>
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
