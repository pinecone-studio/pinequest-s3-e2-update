/** @format */

"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getApprovalRequestsClient,
  getApprovalUpdatedEventName,
} from "@/app/lib/exam-approval-store";
import { RequestApprovalDialog } from "@/app/school/_components/request-approval-dialog";
import {
  pendingActions,
  recentActivities,
  schoolExams,
  schoolSummary,
} from "@/app/school/_mock/school-data";

const summaryCards = [
  { label: "Нийт ажилчид", value: schoolSummary.totalTeachers, href: "/school/teachers" },
  { label: "Нийт анги", value: schoolSummary.totalClasses, href: "/school/classes" },
  { label: "Идэвхтэй сурагч", value: schoolSummary.activeStudents, href: "/school/students" },
  { label: "Энэ сарын шалгалт", value: schoolSummary.examsThisWeek, href: "/school/exams" },
  { label: "Өнөөдрийн шалгалт", value: schoolSummary.ongoingExams, href: "/school/exams" },
];

export default function SchoolDashboardPage() {
  const [selectedQuarter, setSelectedQuarter] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [pendingPage, setPendingPage] = useState(1);
  const [approvalRequests, setApprovalRequests] = useState<
    ReturnType<typeof getApprovalRequestsClient>
  >([]);

  const quarterOf = (startAt: string) => {
    const month = Number(startAt.slice(5, 7));
    if (Number.isNaN(month) || month < 1 || month > 12) return "Q1";
    if (month <= 3) return "Q1";
    if (month <= 6) return "Q2";
    if (month <= 9) return "Q3";
    return "Q4";
  };

  const quarterFilteredExams = useMemo(() => {
    if (selectedQuarter === "all") return schoolExams;
    return schoolExams.filter((exam) => quarterOf(exam.startAt) === selectedQuarter);
  }, [selectedQuarter]);

  const classOptions = useMemo(
    () =>
      Array.from(new Set(quarterFilteredExams.map((exam) => exam.className))).sort((a, b) =>
        a.localeCompare(b, "mn")
      ),
    [quarterFilteredExams]
  );

  const subjectOptions = useMemo(
    () =>
      Array.from(new Set(quarterFilteredExams.map((exam) => exam.subject))).sort((a, b) =>
        a.localeCompare(b, "mn")
      ),
    [quarterFilteredExams]
  );

  const aggregatedByClassSubject = useMemo(() => {
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
      .filter((row) => selectedClass === "all" || row.className === selectedClass)
      .filter((row) => selectedSubject === "all" || row.subject === selectedSubject)
      .sort((a, b) => {
        if (a.className !== b.className) return a.className.localeCompare(b.className, "mn");
        return a.subject.localeCompare(b.subject, "mn");
      });
  }, [quarterFilteredExams, selectedClass, selectedSubject]);

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
    [approvalRequests]
  );
  const pageSize = 3;
  const totalPendingPages = Math.max(1, Math.ceil(pendingItems.length / pageSize));
  const pagedPendingItems = pendingItems.slice(
    (pendingPage - 1) * pageSize,
    pendingPage * pageSize
  );

  return (
    <div className="space-y-6 text-2">
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3 font-bold text-[#0f172a]">Сургуулийн самбар</h2>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-2 text-amber-900">
            ⚠ Давхцлын сануулга: {schoolSummary.conflictAlerts}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {summaryCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-[#e6edf5] bg-[#f8fbff] p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-2 font-medium text-[#64748b]">{card.label}</p>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" />
              </div>
              <p className="mt-2 text-4 font-bold text-[#0f172a]">
                {card.value}
              </p>
            </Link>
          ))}
          <RequestApprovalDialog />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-2 font-semibold text-[#0f172a]">
              Хүлээгдэж буй ажил
            </h3>
            <div className="flex items-center gap-3">
              <Link
                href="/school/requests"
                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-2 font-medium text-blue-700 hover:bg-blue-100"
              >
                Батлуулах хүсэлтүүдийг харах
              </Link>
              <Link
                href="/school/exams"
                className="text-2 font-medium text-blue-700 hover:text-blue-800"
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
                  <span className={`rounded-full px-2 py-0.5 text-2 font-semibold ${item.badgeClass}`}>
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
                  onClick={() => setPendingPage((p) => Math.min(totalPendingPages, p + 1))}
                  disabled={pendingPage === totalPendingPages}
                  className="rounded-md border border-zinc-300 px-3 py-1 text-2 text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Дараагийн хуудас
                </button>
              </li>
            ) : null}
          </ul>
        </article>

        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-2 font-semibold text-[#0f172a]">
              Сүүлийн үйл ажиллагаа
            </h3>
            <Link
              href="/school/results"
              className="text-2 font-medium text-blue-700 hover:text-blue-800"
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
        <article className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
          <h3 className="text-2 font-semibold text-[#0f172a]">
            Гүйцэтгэлийн тойм (анги)
          </h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <label className="block text-2 font-medium text-zinc-600">
              Улирал
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
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
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-2 text-zinc-900"
              >
                <option value="all">Бүх анги</option>
                {classOptions.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-2 font-medium text-zinc-600">
              Хичээл
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
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

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full min-w-115 text-2">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-2 pl-3">№</th>
                    <th className="py-2">Анги</th>
                    <th className="py-2">Хичээл</th>
                    <th className="py-2">Дундаж хувь</th>
                    <th className="py-2 pr-3 text-center">Дээд хувь</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedByClassSubject.map((row, index) => (
                    <tr key={`${row.className}-${row.subject}`} className="border-b border-zinc-100">
                      <td className="py-2 pl-3 text-zinc-500">{index + 1}</td>
                      <td className="py-2 font-medium text-zinc-900">{row.className}</td>
                      <td className="py-2 text-amber-700">{row.subject}</td>
                      <td className="py-2">{row.averagePercent}%</td>
                      <td className="py-2 pr-3 text-center">{row.highestScorePercent}%</td>
                    </tr>
                  ))}
                  {aggregatedByClassSubject.length === 0 ? (
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
                {aggregatedByClassSubject.map((row) => {
                  return (
                    <div key={`bar-${row.className}-${row.subject}`}>
                      <div className="mb-1 flex items-center justify-between text-2 text-zinc-600">
                        <span>
                          {row.className} · {row.subject}
                        </span>
                        <span>
                          Дундаж {row.averagePercent}% · Дээд {row.highestScorePercent}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-200">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${row.averagePercent}%` }}
                        />
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-zinc-200">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${row.highestScorePercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {aggregatedByClassSubject.length === 0 ? (
                  <p className="text-2 text-zinc-500">График харуулах өгөгдөл алга.</p>
                ) : null}
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
