/** @format */

"use client";

import { AlertTriangle, BellRing, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  type ApprovalRequest,
  getApprovalRequestsClient,
  getApprovalUpdatedEventName,
  updateApprovalRequestStatus,
} from "@/app/lib/exam-approval-store";
import { examAlerts } from "@/app/school/exams/_mock/school-exams";
import {
  pendingActions,
  teacherPerformance,
} from "@/app/school/_mock/school-data";

export default function SchoolDashboardPage() {
  const [approvalRequests, setApprovalRequests] = useState<
    ReturnType<typeof getApprovalRequestsClient>
  >([]);
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
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalComments, setApprovalComments] = useState<Record<string, string>>({});
  const [approvalExpanded, setApprovalExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const sync = () => setApprovalRequests(getApprovalRequestsClient());
    sync();
    const eventName = getApprovalUpdatedEventName();
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener(eventName, sync);
      window.removeEventListener("storage", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const isTodayLabel = (value: string) => {
    if (!value) return false;
    if (value.includes("Өнөөдөр")) return true;
    const match = value.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return false;
    const [, year, month, day] = match;
    const now = new Date();
    return (
      Number(year) === now.getFullYear() &&
      Number(month) === now.getMonth() + 1 &&
      Number(day) === now.getDate()
    );
  };

  const parseDueTime = (value: string) => {
    if (!value) return 0;
    if (value.includes("Өнөөдөр")) {
      const now = new Date();
      const match = value.match(/(\d{1,2}):(\d{2})/);
      const hours = match ? Number(match[1]) : 23;
      const minutes = match ? Number(match[2]) : 59;
      const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0,
        0,
      );
      return date.getTime();
    }
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const pendingItems = useMemo(
    () =>
      [
        ...approvalRequests
          .filter((item) => item.status === "pending")
          .map((item) => ({
            id: item.id,
            title: `${item.className} ангийн ${item.subject} шалгалт батлуулах`,
            owner: item.teacherName,
            due: item.sentAt,
            dueTs: parseDueTime(item.sentAt),
            isNew: Boolean(item.unread),
            cardClass: "border-zinc-200 bg-white",
          })),
        ...pendingActions.map((item) => ({
          id: item.id,
          title: item.title,
          owner: item.owner,
          due: item.due,
          dueTs: parseDueTime(item.due),
          isNew: isTodayLabel(item.due),
          cardClass: "border-zinc-200 bg-white",
        })),
      ].sort((a, b) => b.dueTs - a.dueTs),
    [approvalRequests],
  );
  const pendingApprovalRequests = useMemo(
    () =>
      approvalRequests
        .filter((item) => item.status === "pending")
        .sort((a, b) => parseDueTime(b.sentAt) - parseDueTime(a.sentAt)),
    [approvalRequests],
  );

  const approveRequest = (id: string) => {
    updateApprovalRequestStatus(id, "approved");
    setApprovalRequests(getApprovalRequestsClient());
  };

  const rejectRequest = (id: string) => {
    const note = (approvalComments[id] || "").trim();
    if (!note) return;
    updateApprovalRequestStatus(id, "needs_fix", note);
    setApprovalRequests(getApprovalRequestsClient());
  };

  const toggleRequestDetail = (id: string) => {
    setApprovalExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 text-2">
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3 font-bold text-[#0f172a]">
              Сургуулийн самбар
            </h2>
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-2 font-semibold text-[#0f172a]">
                Хүлээгдэж буй ажил
              </h3>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsApprovalModalOpen(true)}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-2 font-medium text-blue-700 hover:bg-blue-100 sm:w-[250px]"
                >
                  Батлуулах хүсэлтүүд →
                </button>
              </div>
            </div>
            <ul className="mt-4 max-h-[250px] space-y-3 overflow-y-auto pr-1">
              {pendingItems.map((item) => (
                <li
                  key={item.id}
                  className={`rounded-lg border p-3 ${item.cardClass}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-zinc-950">{item.title}</p>
                    {item.isNew ? (
                      <span className="text-2 font-semibold text-blue-600">
                        Шинэ
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-2 text-zinc-600">
                    Хариуцагч: {item.owner} · Хугацаа: {item.due}
                  </p>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-2 font-semibold text-[#0f172a]">
                  Анхааруулах зүйлс
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f0] bg-[#f8fbff] px-3 py-1.5 text-2 font-medium text-[#456080]">
                <BellRing className="h-4 w-4" />
                Нээлттэй alert: {examAlerts.length}
              </div>
            </div>
            <div className="mt-4 max-h-[250px] space-y-3 overflow-y-auto pr-1">
              {examAlerts.map((alert) => {
                const isWarning = alert.type === "warning";
                return (
                  <article
                    key={alert.id}
                    className={`rounded-2xl border p-4 ${
                      isWarning
                        ? "border-amber-300 bg-white"
                        : "border-blue-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          isWarning
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                              isWarning
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {alert.type}
                          </span>
                          <h4 className="text-2 font-semibold text-[#0f172a]">
                            {alert.title}
                          </h4>
                        </div>
                        <p className="mt-2 text-2 leading-6 text-[#5c6d87]">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </article>
        </div>
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
                    <th className="sticky top-0 z-10 bg-white py-2">
                      Дундаж дүн
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
                      <td className="py-2">{row.avgScore}%</td>
                    </tr>
                  ))}
                  {sortedTeacherPerformance.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
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
                          stopColor="#3b82f6"
                          stopOpacity="0.28"
                        />
                        <stop
                          offset="100%"
                          stopColor="#3b82f6"
                          stopOpacity="0.08"
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
                      stroke="#3b82f6"
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
                          stroke="#3b82f6"
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
                      className="pointer-events-none absolute rounded-lg bg-[#1d4ed8] px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg"
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
                    <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#eaf2ff] px-3 py-2 text-2 text-[#2563eb]">
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

      {isApprovalModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
          onClick={() => setIsApprovalModalOpen(false)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-3 font-bold text-[#0f172a]">Батлуулах хүсэлтүүд</h3>
                <p className="mt-1 text-2 text-zinc-600">
                  Хүлээгдэж буй хүсэлт: {pendingApprovalRequests.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsApprovalModalOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                aria-label="Хаах"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
              {pendingApprovalRequests.length === 0 ? (
                <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-2 text-zinc-500">
                  Хүлээгдэж буй хүсэлт алга.
                </p>
              ) : (
                pendingApprovalRequests.map((item) => (
                  <ApprovalRequestCard
                    key={item.id}
                    comments={approvalComments}
                    expanded={approvalExpanded}
                    onApprove={approveRequest}
                    onReject={rejectRequest}
                    onToggleDetail={toggleRequestDetail}
                    onUpdateComment={(id, value) =>
                      setApprovalComments((prev) => ({ ...prev, [id]: value }))
                    }
                    request={item}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ApprovalRequestCard({
  request,
  comments,
  expanded,
  onToggleDetail,
  onUpdateComment,
  onApprove,
  onReject,
}: {
  request: ApprovalRequest;
  comments: Record<string, string>;
  expanded: Record<string, boolean>;
  onToggleDetail: (id: string) => void;
  onUpdateComment: (id: string, value: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-semibold text-zinc-900">
        {request.teacherName} · {request.className} · {request.subject}
      </p>
      <div className="mt-2 space-y-1 text-2 text-zinc-700">
        <p>Шалгалт: {request.title}</p>
        <p>Илгээсэн: {request.sentAt}</p>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => onToggleDetail(request.id)}
          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-2 font-medium text-blue-700 hover:bg-blue-100"
        >
          {expanded[request.id] ? "Дэлгэрэнгүйг хаах" : "Дэлгэрэнгүй харах"}
        </button>
      </div>

      {expanded[request.id] ? (
        <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <p className="font-medium text-zinc-800">Асуулт, хариулт ({request.questions.length})</p>
          <div className="mt-2 max-h-60 space-y-2 overflow-y-auto pr-1">
            {request.questions.map((qa) => (
              <div key={`${request.id}-q-${qa.id}`} className="rounded-lg border border-[#c9d5ea] bg-white p-3">
                <p className="text-2 font-semibold text-[#5f739b]">Асуулт {qa.id}</p>
                <p className="mt-1 text-2 font-semibold text-[#24314f]">{qa.question}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-3">
        <label className="block text-2 font-medium text-zinc-600">
          Тайлбар (дутуу бол заавал бичнэ)
          <textarea
            value={comments[request.id] ?? ""}
            onChange={(e) => onUpdateComment(request.id, e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-2 text-zinc-900"
          />
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onApprove(request.id)}
            className="inline-flex items-center rounded-lg border border-emerald-500 bg-white px-3 py-2 text-2 font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Батлах
          </button>
          <button
            type="button"
            onClick={() => onReject(request.id)}
            className="inline-flex items-center rounded-lg border border-red-500 bg-white px-3 py-2 text-2 font-semibold text-red-700 hover:bg-red-50"
          >
            Буцаах
          </button>
        </div>
      </div>
    </article>
  );
}
