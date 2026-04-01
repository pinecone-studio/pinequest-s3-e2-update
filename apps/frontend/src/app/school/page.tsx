/** @format */

"use client";

import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getApprovalRequestsClient,
  getApprovalUpdatedEventName,
} from "@/app/lib/exam-approval-store";
import { ExamSmartAlerts } from "@/app/school/exams/_components/ExamSmartAlerts";
import { examAlerts } from "@/app/school/exams/_mock/school-exams";
import {
  pendingActions,
  recentActivities,
  schoolSummary,
  teacherPerformance,
} from "@/app/school/_mock/school-data";

export default function SchoolDashboardPage() {
  const [pendingPage, setPendingPage] = useState(1);
  const [isAlertsDialogOpen, setIsAlertsDialogOpen] = useState(false);
  const [approvalRequests, setApprovalRequests] = useState<
    ReturnType<typeof getApprovalRequestsClient>
  >([]);
  const [attendanceByTeacher, setAttendanceByTeacher] = useState<
    Record<string, number>
  >(() =>
    Object.fromEntries(teacherPerformance.map((row) => [row.teacherName, 85])),
  );
  const sortedTeacherPerformance = useMemo(
    () => [...teacherPerformance].sort((a, b) => b.avgScore - a.avgScore),
    [],
  );
  const topScoreTeachers = useMemo(
    () =>
      sortedTeacherPerformance.filter(
        (row) => row.avgScore >= 80 && row.avgScore <= 100,
      ),
    [sortedTeacherPerformance],
  );
  const lineChartModel = useMemo(() => {
    const items = topScoreTeachers;
    const width = 560;
    const height = 230;
    const paddingX = 28;
    const paddingTop = 22;
    const paddingBottom = 32;
    const plotWidth = width - paddingX * 2;
    const plotHeight = height - paddingTop - paddingBottom;
    const minScore = 80;
    const maxScore = 100;

    if (items.length === 0) {
      return {
        width,
        height,
        items,
        points: [] as { x: number; y: number; item: (typeof items)[number] }[],
        linePath: "",
        areaPath: "",
        highlight: null as null | {
          x: number;
          y: number;
          item: (typeof items)[number];
        },
      };
    }

    const stepX = items.length > 1 ? plotWidth / (items.length - 1) : 0;
    const points = items.map((item, index) => {
      const ratio = (item.avgScore - minScore) / (maxScore - minScore);
      const x = paddingX + stepX * index;
      const y = paddingTop + (1 - ratio) * plotHeight;
      return { x, y, item };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");
    const first = points[0];
    const last = points[points.length - 1];
    const areaPath = `${linePath} L ${last.x} ${height - paddingBottom} L ${first.x} ${height - paddingBottom} Z`;
    const highlight =
      [...points].sort((a, b) => b.item.avgScore - a.item.avgScore)[0] ?? null;

    return { width, height, items, points, linePath, areaPath, highlight };
  }, [topScoreTeachers]);
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{
    x: number;
    y: number;
    teacherName: string;
    avgScore: number;
  } | null>(null);

  useEffect(() => {
    const sync = () => setApprovalRequests(getApprovalRequestsClient());
    sync();
    const eventName = getApprovalUpdatedEventName();
    window.addEventListener(eventName, sync);
    return () => window.removeEventListener(eventName, sync);
  }, []);

  const pendingItems = useMemo(
    () => [
      ...approvalRequests
        .filter((item) => item.status === "pending")
        .map((item) => ({
          id: item.id,
          title: `${item.className} ангийн ${item.subject} шалгалт батлуулах`,
          owner: item.teacherName,
          due: item.sentAt,
          badge: item.unread ? "Шинэ" : "Дунд",
          badgeClass: item.unread
            ? "bg-blue-100 text-blue-700"
            : "bg-amber-100 text-amber-700",
          cardClass: item.unread
            ? "border-blue-200 bg-blue-50"
            : "border-zinc-200 bg-white",
        })),
      ...pendingActions.map((item) => ({
        id: item.id,
        title: item.title,
        owner: item.owner,
        due: item.due,
        badge: item.severity === "high" ? "Яаралтай" : "Дунд",
        badgeClass:
          item.severity === "high"
            ? "bg-red-100 text-red-700"
            : "bg-amber-100 text-amber-700",
        cardClass: "border-zinc-200 bg-white",
      })),
    ],
    [approvalRequests],
  );
  const summaryCards = useMemo(
    () => [
      {
        label: "Нийт ажилчид",
        value: schoolSummary.totalTeachers,
        href: "/school/teachers",
      },
      {
        label: "Нийт анги",
        value: schoolSummary.totalClasses,
        href: "/school/classes?grade=10",
      },
      {
        label: "Сурагчид",
        value: schoolSummary.activeStudents,
        href: "/school/students",
      },
      {
        label: "Энэ сарын шалгалт",
        value: schoolSummary.examsThisWeek,
        href: "/school/exams",
      },
    ],
    [],
  );
  const pageSize = 2;
  const totalPendingPages = Math.max(
    1,
    Math.ceil(pendingItems.length / pageSize),
  );
  const pagedPendingItems = pendingItems.slice(
    (pendingPage - 1) * pageSize,
    pendingPage * pageSize,
  );

  return (
    <div className="space-y-6 text-2">
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3 font-bold text-[#0f172a]">
              Сургуулийн самбар
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsAlertsDialogOpen(true)}
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-2 text-amber-900 transition hover:bg-amber-100"
          >
            ⚠ Давхцлын сануулга: {schoolSummary.conflictAlerts}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-[#e6edf5] bg-[#f8fbff] p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="flex items-center gap-2 text-[20px] font-medium leading-[1.2] text-[#64748b]">
                  <span>{card.label}</span>
                  <span className="text-[25px] font-bold leading-none text-[#0f172a]">
                    {card.value}
                  </span>
                </p>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {isAlertsDialogOpen ? (
        <div
          className="fixed inset-0 z-50 bg-[#0f172a]/35 backdrop-blur-[1px]"
          onClick={() => setIsAlertsDialogOpen(false)}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAlertsDialogOpen(false)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/30 bg-white/90 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-white"
                >
                  <X className="h-4 w-4" />
                  Хаах
                </button>
              </div>
              <ExamSmartAlerts alerts={examAlerts} />
            </div>
          </div>
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-2 font-semibold text-[#0f172a]">
              Хүлээгдэж буй ажил
            </h3>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <Link
                href="/school/requests"
                className="inline-flex w-full items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-2 font-medium text-blue-700 hover:bg-blue-100 sm:w-[250px]"
              >
                Батлуулах хүсэлтүүд →
              </Link>
              <Link
                href="/school/exams"
                className="inline-flex w-full items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-2 font-medium text-blue-700 hover:bg-blue-100 sm:w-[250px]"
              >
                Шалгалт руу очих →
              </Link>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {pagedPendingItems.map((item) => (
              <li
                key={item.id}
                className={`rounded-lg border p-3 ${item.cardClass}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{item.title}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-2 font-semibold ${item.badgeClass}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="mt-1 text-2 text-zinc-600">
                  Хариуцагч: {item.owner} · Хугацаа: {item.due}
                </p>
              </li>
            ))}
            {totalPendingPages > 1 ? (
              <li className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
                  disabled={pendingPage === 1}
                  className="rounded-md border border-zinc-300 px-3 py-1 text-2 text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Өмнөх
                </button>
                <span className="text-2 text-zinc-600">
                  {pendingPage} / {totalPendingPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPendingPage((p) => Math.min(totalPendingPages, p + 1))
                  }
                  disabled={pendingPage === totalPendingPages}
                  className="rounded-md border border-zinc-300 px-3 py-1 text-2 text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Дараагийн
                </button>
              </li>
            ) : null}
          </ul>
        </article>

        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-2 font-semibold text-[#0f172a]">
              Сүүлийн үйл ажиллагаа
            </h3>
            <Link
              href="/school/results"
              className="shrink-0 text-2 font-medium text-blue-700 hover:text-blue-800"
            >
              Үр дүн харах →
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {recentActivities.map((line) => (
              <li
                key={line}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-2 text-zinc-700"
              >
                {line}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section>
        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-balance text-2 font-semibold text-[#0f172a]">
            Багшийн гүйцэтгэлийн үнэлгээ (нийт багш{" "}
            {sortedTeacherPerformance.length})
          </h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="max-h-[260px] overflow-x-auto overflow-y-auto rounded-xl border border-zinc-200 lg:h-[420px] lg:max-h-none">
              <table className="w-full min-w-115 text-2">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="sticky top-0 z-10 bg-white py-2 pl-3">№</th>
                    <th className="sticky top-0 z-10 bg-white py-2">Багш</th>
                    <th className="sticky top-0 z-10 bg-white py-2">Шалгалт</th>
                    <th className="sticky top-0 z-10 bg-white py-2">
                      Дундаж дүн
                    </th>
                    <th className="sticky top-0 z-10 bg-white py-2 pr-3 text-center">
                      Ирц
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTeacherPerformance.map((row, index) => (
                    <tr
                      key={row.teacherName}
                      className="border-b border-zinc-100"
                    >
                      <td className="py-2 pl-3 text-zinc-500">{index + 1}</td>
                      <td className="py-2 font-medium text-zinc-900">
                        {row.teacherName}
                      </td>
                      <td className="py-2">{row.examsThisMonth}</td>
                      <td className="py-2">{row.avgScore}%</td>
                      <td className="py-2 pr-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={attendanceByTeacher[row.teacherName] ?? 0}
                            onChange={(e) => {
                              const raw = Number(e.target.value);
                              const safe = Number.isNaN(raw)
                                ? 0
                                : Math.max(0, Math.min(100, raw));
                              setAttendanceByTeacher((current) => ({
                                ...current,
                                [row.teacherName]: safe,
                              }));
                            }}
                            className="w-[4.5rem] rounded-md border border-zinc-300 px-2 py-1 text-right text-2 text-zinc-900"
                          />
                          <span className="text-zinc-600">%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {sortedTeacherPerformance.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-5 text-center text-zinc-500"
                      >
                        Багшийн үнэлгээний өгөгдөл алга.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col rounded-xl border border-zinc-200 bg-zinc-50 p-4 lg:h-[420px]">
              <p className="font-medium text-zinc-800">
                Багшийн үнэлгээний шугаман график
              </p>
              {lineChartModel.points.length === 0 ? (
                <p className="mt-3 text-2 text-zinc-500">
                  80-100%-ийн багш алга байна.
                </p>
              ) : (
                <div className="relative mt-3 flex-1 rounded-lg border border-zinc-200 bg-white p-3">
                  <svg
                    className="h-auto w-full"
                    viewBox={`0 0 ${lineChartModel.width} ${lineChartModel.height}`}
                    onMouseLeave={() => setHoveredChartPoint(null)}
                  >
                    <defs>
                      <linearGradient
                        id="teacher-score-area"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#4f46e5"
                          stopOpacity="0.32"
                        />
                        <stop
                          offset="100%"
                          stopColor="#4f46e5"
                          stopOpacity="0.06"
                        />
                      </linearGradient>
                    </defs>

                    {[0, 1, 2, 3, 4].map((tick) => {
                      const y = 22 + ((lineChartModel.height - 54) / 4) * tick;
                      return (
                        <line
                          key={`grid-${tick}`}
                          x1={20}
                          x2={lineChartModel.width - 20}
                          y1={y}
                          y2={y}
                          stroke="#e8ecf3"
                          strokeDasharray="3 6"
                        />
                      );
                    })}

                    <path
                      d={lineChartModel.areaPath}
                      fill="url(#teacher-score-area)"
                    />
                    <path
                      d={lineChartModel.linePath}
                      fill="none"
                      stroke="#5b50e6"
                      strokeWidth={2.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {lineChartModel.points.map((point, index) => (
                      <g
                        key={`dot-${point.item.teacherName}`}
                        onMouseEnter={() =>
                          setHoveredChartPoint({
                            x: point.x,
                            y: point.y,
                            teacherName: point.item.teacherName,
                            avgScore: point.item.avgScore,
                          })
                        }
                      >
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={11}
                          fill="transparent"
                        />
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={4.6}
                          fill="#ffffff"
                          stroke="#5b50e6"
                          strokeWidth={2.2}
                        >
                          <title>{`${point.item.teacherName} · ${point.item.avgScore}%`}</title>
                        </circle>
                        <text
                          x={point.x}
                          y={lineChartModel.height - 10}
                          textAnchor="middle"
                          fontSize="10.5"
                          fill="#5f6b7f"
                        >
                          {index + 1}
                        </text>
                      </g>
                    ))}
                  </svg>

                  {hoveredChartPoint ? (
                    <div
                      className="pointer-events-none absolute rounded-lg bg-[#3f46b4] px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg"
                      style={{
                        left: `${(hoveredChartPoint.x / lineChartModel.width) * 100}%`,
                        top: `${(hoveredChartPoint.y / lineChartModel.height) * 100}%`,
                        transform: "translate(-50%, -120%)",
                      }}
                    >
                      {hoveredChartPoint.teacherName} ·{" "}
                      {hoveredChartPoint.avgScore}%
                    </div>
                  ) : null}

                  {lineChartModel.highlight ? (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#eef0ff] px-3 py-2 text-2 text-[#3f46b4]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white font-semibold">
                        1
                      </span>
                      <span>
                        {lineChartModel.highlight.item.teacherName} · Дундаж{" "}
                        {lineChartModel.highlight.item.avgScore}%
                      </span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
