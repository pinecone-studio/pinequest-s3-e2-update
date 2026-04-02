/** @format */

"use client";

import { ArrowUpRight, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
	type ApprovalRequest,
	getApprovalRequestsClient,
	getApprovalUpdatedEventName,
	updateApprovalRequestStatus,
} from "@/app/lib/exam-approval-store";
import {
  pendingActions,
  schoolExams,
  teacherPerformance,
} from "@/app/school/_mock/school-data";

function extractGradeValue(className: string) {
  const match = className.match(/\d+/);
  return match ? match[0] : className;
}

function quarterOf(startAt: string) {
  const month = Number(startAt.slice(5, 7));
  if (Number.isNaN(month) || month < 1 || month > 12) return "Q1";
  if (month <= 3) return "Q1";
  if (month <= 6) return "Q2";
  if (month <= 9) return "Q3";
  return "Q4";
}

export default function SchoolDashboardPage() {
  const [approvalRequests, setApprovalRequests] = useState<
    ReturnType<typeof getApprovalRequestsClient>
  >([]);
  const [performanceView, setPerformanceView] = useState<"class" | "teacher">(
    "class",
  );
  const [selectedQuarterFilter, setSelectedQuarterFilter] = useState("all");
  const [selectedClassFilter, setSelectedClassFilter] = useState("all");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");
  const sortedTeacherPerformance = useMemo(
    () => [...teacherPerformance].sort((a, b) => b.avgScore - a.avgScore),
    [],
  );
  const quarterFilteredExams = useMemo(() => {
    if (selectedQuarterFilter === "all") return schoolExams;
    return schoolExams.filter((exam) => quarterOf(exam.startAt) === selectedQuarterFilter);
  }, [selectedQuarterFilter]);
  const classOptions = useMemo(
    () =>
      Array.from(
        new Set(quarterFilteredExams.map((exam) => extractGradeValue(exam.className))),
      ).sort((a, b) => {
        const aNum = Number(a);
        const bNum = Number(b);
        if (Number.isFinite(aNum) && Number.isFinite(bNum)) return bNum - aNum;
        return a.localeCompare(b, "mn");
      }),
    [quarterFilteredExams],
  );
  const subjectOptions = useMemo(
    () =>
      Array.from(new Set(quarterFilteredExams.map((exam) => exam.subject))).sort(
        (a, b) => a.localeCompare(b, "mn"),
      ),
    [quarterFilteredExams],
  );
  const classPerformanceRows = useMemo(() => {
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
      current.highestScorePercent = Math.max(
        current.highestScorePercent,
        topScorePercent,
      );
      current.examCount += 1;
    });

    return Array.from(map.values())
      .map((row) => ({
        id: `${row.className}-${row.subject}`,
        primary: row.className,
        secondary: row.subject,
        averagePercent: Math.round(row.totalScorePercent / row.examCount),
        highestScorePercent: row.highestScorePercent,
      }))
      .filter(
        (row) =>
          selectedClassFilter === "all" ||
          extractGradeValue(row.primary) === selectedClassFilter,
      )
      .filter(
        (row) =>
          selectedSubjectFilter === "all" || row.secondary === selectedSubjectFilter,
      )
      .sort((a, b) => {
        if (a.primary !== b.primary) return a.primary.localeCompare(b.primary, "mn");
        return a.secondary.localeCompare(b.secondary, "mn");
      });
  }, [quarterFilteredExams, selectedClassFilter, selectedSubjectFilter]);
  const teacherPerformanceRows = useMemo(
    () => {
      const classesByTeacher = new Map<string, string>();
      const fallbackClassPool = Array.from(
        new Set(schoolExams.map((exam) => exam.className)),
      ).sort((a, b) => a.localeCompare(b, "mn"));

      sortedTeacherPerformance.forEach((teacher) => {
        const classes = Array.from(
          new Set(
            schoolExams
              .filter((exam) => exam.teacherName === teacher.teacherName)
              .map((exam) => exam.className),
          ),
        ).sort((a, b) => a.localeCompare(b, "mn"));

        if (classes.length > 0) {
          classesByTeacher.set(teacher.teacherName, classes.join(", "));
          return;
        }

        const fallbackClass =
          fallbackClassPool.length > 0
            ? fallbackClassPool[
                sortedTeacherPerformance.findIndex(
                  (item) => item.teacherName === teacher.teacherName,
                ) % fallbackClassPool.length
              ]
            : "10A";
        classesByTeacher.set(teacher.teacherName, fallbackClass);
      });

      return sortedTeacherPerformance.slice(0, 10).map((row) => ({
        id: row.teacherName,
        primary: row.teacherName,
        secondary: classesByTeacher.get(row.teacherName) ?? "10A",
        averagePercent: row.avgScore,
        highestScorePercent: Math.min(100, row.avgScore + 5),
      }));
    },
    [sortedTeacherPerformance],
  );
  const performanceRows = useMemo(
    () => (performanceView === "class" ? classPerformanceRows : teacherPerformanceRows),
    [classPerformanceRows, teacherPerformanceRows, performanceView],
  );
  const teacherLineChartModel = useMemo(() => {
    const items = teacherPerformanceRows;
    const width = 560;
    const height = 230;
    const paddingX = 56;
    const paddingTop = 20;
    const paddingBottom = 34;
    const plotWidth = width - paddingX * 2;
    const plotHeight = height - paddingTop - paddingBottom;
    const minScore = 60;
    const maxScore = 100;

    if (items.length === 0) {
      return {
        width,
        height,
        minScore,
        maxScore,
        paddingTop,
        paddingBottom,
        points: [] as { x: number; y: number; item: (typeof items)[number] }[],
        linePath: "",
        areaPath: "",
      };
    }

    const stepX = items.length > 1 ? plotWidth / (items.length - 1) : 0;
    const points = items.map((item, index) => {
      const ratio = (item.averagePercent - minScore) / (maxScore - minScore || 1);
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

    return {
      width,
      height,
      minScore,
      maxScore,
      paddingTop,
      paddingBottom,
      points,
      linePath,
      areaPath,
    };
  }, [teacherPerformanceRows]);
  const topTeacher = teacherPerformanceRows[0] ?? null;
  const [hoveredTeacherPoint, setHoveredTeacherPoint] = useState<{
    x: number;
    y: number;
    teacherName: string;
    avgScore: number;
  } | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalComments, setApprovalComments] = useState<
    Record<string, string>
  >({});
  const [approvalExpanded, setApprovalExpanded] = useState<
    Record<string, boolean>
  >({});

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
  const completedCount = useMemo(
    () => schoolExams.filter((exam) => exam.stage === "completed").length,
    [],
  );
  const scheduledCount = useMemo(
    () => schoolExams.filter((exam) => exam.stage === "scheduled").length,
    [],
  );
  const averagePassRate = useMemo(() => {
    if (schoolExams.length === 0) return 0;
    return Math.round(
      schoolExams.reduce((sum, exam) => {
        const pass =
          exam.studentCount > 0
            ? Math.round((exam.submittedCount / exam.studentCount) * 100)
            : 0;
        return sum + pass;
      }, 0) / schoolExams.length,
    );
  }, []);
  const attentionClassCount = useMemo(() => {
    const rows = schoolExams
      .map((exam) =>
        exam.studentCount > 0
          ? Math.round((exam.submittedCount / exam.studentCount) * 100)
          : 0,
      )
      .filter((score) => score < 80);
    return rows.length;
  }, []);
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
                  className="inline-flex w-full items-center justify-center rounded-lg border border-[#B8DCFF] bg-[#EDF6FF] px-1 py-1.5 text-2 font-medium text-[#122459] hover:bg-[#E3F1FF] sm:w-[220px]"
                >
                  <span>Батлуулах хүсэлтүүд</span>
                  <ChevronRight className="ml-2 flex justify-center items-center h-3 w-3 text-[#122459]" />
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
            <h3 className="text-3 font-bold text-[#0f172a]">Үр дүн</h3>
            <p className="mt-1 mb-[3px] text-2 text-zinc-600">
              Багшийн оруулсан явц, дүн, үнэлгээний статусыг сургуулийн түвшинд
              нэгтгэнэ.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition hover:bg-zinc-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Дууссан шалгалт
                  </p>
                  <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                </div>
                <p className="mt-2 text-2xl font-bold">{completedCount}</p>
              </button>
              <button
                type="button"
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition hover:bg-zinc-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Товлогдсон шалгалт
                  </p>
                  <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                </div>
                <p className="mt-2 text-2xl font-bold">{scheduledCount}</p>
              </button>
              <button
                type="button"
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition hover:bg-zinc-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Дундаж тэнцэлт
                  </p>
                  <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                </div>
                <p className="mt-2 text-2xl font-bold">{averagePassRate}%</p>
              </button>
              <button
                type="button"
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition hover:bg-zinc-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs uppercase tracking-wide text-red-600">
                    Анхаарах
                  </p>
                  <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                </div>
                <p className="mt-2 text-2xl font-bold text-red-700">
                  {attentionClassCount} анги
                </p>
              </button>
            </div>
          </article>
        </div>
      </section>

      <section>
        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-balance text-2 font-semibold text-[#0f172a]">
              Гүйцэтгэлийн нэгдсэн тойм
            </h3>
            <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1">
              <button
                type="button"
                onClick={() => setPerformanceView("class")}
                className={`rounded-md px-3 py-1 text-2 font-medium transition ${
                  performanceView === "class"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                Анги
              </button>
              <button
                type="button"
                onClick={() => setPerformanceView("teacher")}
                className={`rounded-md px-3 py-1 text-2 font-medium transition ${
                  performanceView === "teacher"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                Багш
              </button>
            </div>
          </div>
          {performanceView === "class" ? (
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <label className="block text-2 font-medium text-zinc-600">
                Улирал
                <select
                  value={selectedQuarterFilter}
                  onChange={(e) => setSelectedQuarterFilter(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-2 text-zinc-900"
                >
                  <option value="all">Бүх улирал</option>
                  <option value="Q1">I улирал</option>
                  <option value="Q2">II улирал</option>
                  <option value="Q3">III улирал</option>
                  <option value="Q4">IV улирал</option>
                </select>
              </label>
              <label className="block text-2 font-medium text-zinc-600">
                Анги
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-2 text-zinc-900"
                >
                  <option value="all">Бүх анги</option>
                  {classOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-2 font-medium text-zinc-600">
                Хичээл
                <select
                  value={selectedSubjectFilter}
                  onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-2 text-zinc-900"
                >
                  <option value="all">Бүх хичээл</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="max-h-[260px] overflow-x-auto overflow-y-auto rounded-xl border border-zinc-200 lg:h-[420px] lg:max-h-none">
              <table className="w-full min-w-115 text-2">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="sticky top-0 z-10 bg-white py-2 pl-3">№</th>
                    <th className="sticky top-0 z-10 bg-white py-2">
                      {performanceView === "class" ? "Анги" : "Багш"}
                    </th>
                    <th className="sticky top-0 z-10 bg-white py-2">
                      {performanceView === "class" ? "Хичээл" : "Даасан анги"}
                    </th>
                    <th className="sticky top-0 z-10 bg-white py-2">Дундаж</th>
                    <th className="sticky top-0 z-10 bg-white py-2">Дээд оноо</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceRows.map((row, index) => (
                    <tr key={row.id} className="border-b border-zinc-100">
                      <td className="py-2 pl-3 text-zinc-500">{index + 1}</td>
                      <td className="py-2 font-medium text-zinc-900">
                        {row.primary}
                      </td>
                      <td className="py-2 text-zinc-600">{row.secondary}</td>
                      <td className="py-2">{row.averagePercent}%</td>
                      <td className="py-2">{row.highestScorePercent}%</td>
                    </tr>
                  ))}
                  {performanceRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-5 text-center text-zinc-500"
                      >
                        Сонгосон шүүлтүүрт тохирох өгөгдөл алга.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="font-medium text-zinc-800">График</p>
              {performanceView === "teacher" ? (
                <div className="mt-3">
                  <div className="mb-3 flex items-center gap-4 text-xs text-zinc-600">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      Дундаж
                    </span>
                  </div>
                  {teacherLineChartModel.points.length === 0 ? (
                    <p className="text-sm text-zinc-500">График харуулах өгөгдөл алга.</p>
                  ) : (
                    <div className="relative rounded-lg border border-zinc-200 bg-white p-3">
                      <svg
                        className="h-auto w-full"
                        viewBox={`0 0 ${teacherLineChartModel.width} ${teacherLineChartModel.height}`}
                        onMouseLeave={() => setHoveredTeacherPoint(null)}
                      >
                        <defs>
                          <linearGradient id="teacher-avg-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.24" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.08" />
                          </linearGradient>
                        </defs>

                        {[100, 90, 80, 70, 60].map((value, index) => {
                          const y =
                            teacherLineChartModel.paddingTop +
                            ((teacherLineChartModel.maxScore - value) /
                              (teacherLineChartModel.maxScore -
                                teacherLineChartModel.minScore || 1)) *
                              (teacherLineChartModel.height -
                                teacherLineChartModel.paddingTop -
                                teacherLineChartModel.paddingBottom);
                          return (
                            <g key={`teacher-grid-${index}`}>
                              <line
                                x1={46}
                                x2={teacherLineChartModel.width - 20}
                                y1={y}
                                y2={y}
                                stroke="#e8ecf3"
                                strokeDasharray="3 6"
                              />
                              <text
                                x={40}
                                y={y + 3}
                                textAnchor="end"
                                fontSize="10"
                                fill="#7b8798"
                              >
                                {value}%
                              </text>
                            </g>
                          );
                        })}

                        <path d={teacherLineChartModel.areaPath} fill="url(#teacher-avg-area)" />
                        <path
                          d={teacherLineChartModel.linePath}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth={2.6}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {teacherLineChartModel.points.map((point, index) => (
                          <g
                            key={`teacher-dot-${point.item.id}`}
                            onMouseEnter={() =>
                              setHoveredTeacherPoint({
                                x: point.x,
                                y: point.y,
                                teacherName: point.item.primary,
                                avgScore: point.item.averagePercent,
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
                              r={4.8}
                              fill="#ffffff"
                              stroke="#3b82f6"
                              strokeWidth={2.2}
                            />
                            <text
                              x={point.x}
                              y={point.y - 10}
                              textAnchor="middle"
                              fontSize="10.5"
                              fill="#5f6b7f"
                            >
                              {point.item.averagePercent}%
                            </text>
                            <text
                              x={point.x}
                              y={teacherLineChartModel.height - 10}
                              textAnchor="middle"
                              fontSize="10.5"
                              fill="#5f6b7f"
                            >
                              {index + 1}
                            </text>
                          </g>
                        ))}
                      </svg>
                      {hoveredTeacherPoint ? (
                        <div
                          className="pointer-events-none absolute rounded-lg bg-[#1d4ed8] px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg"
                          style={{
                            left: `${(hoveredTeacherPoint.x / teacherLineChartModel.width) * 100}%`,
                            top: `${(hoveredTeacherPoint.y / teacherLineChartModel.height) * 100}%`,
                            transform: "translate(-50%, -120%)",
                          }}
                        >
                          {hoveredTeacherPoint.teacherName}
                        </div>
                      ) : null}
                      {topTeacher ? (
                        <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#eaf2ff] px-3 py-2 text-2 text-[#2563eb]">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white font-semibold">
                            1
                          </span>
                          <span>
                            {topTeacher.primary} · Дундаж {topTeacher.averagePercent}%
                          </span>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
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
                      {performanceRows.map((row) => (
                        <div key={`bar-${row.id}`} className="w-24 shrink-0">
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
                          <p className="mt-2 truncate text-center text-xs font-medium text-zinc-700">
                            {row.primary}
                          </p>
                          <p className="truncate text-center text-xs text-zinc-500">
                            {row.secondary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {performanceRows.length === 0 ? (
                    <p className="text-sm text-zinc-500">График харуулах өгөгдөл алга.</p>
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
                <h3 className="text-3 font-bold text-[#0f172a]">
                  Батлуулах хүсэлтүүд
                </h3>
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
          <p className="font-medium text-zinc-800">
            Асуулт, хариулт ({request.questions.length})
          </p>
          <div className="mt-2 max-h-60 space-y-2 overflow-y-auto pr-1">
            {request.questions.map((qa) => (
              <div
                key={`${request.id}-q-${qa.id}`}
                className="rounded-lg border border-[#c9d5ea] bg-white p-3"
              >
                <p className="text-2 font-semibold text-[#5f739b]">
                  Асуулт {qa.id}
                </p>
                <p className="mt-1 text-2 font-semibold text-[#24314f]">
                  {qa.question}
                </p>
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
