"use client";

import { ArrowLeft, BarChart3, Download, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { store } from "@/app/lib/store";
import { TEACHER_DEMO_CLASS_ID } from "@/app/lib/teacher-demo-class";
import type { Student } from "@/app/lib/types";
import ReviewScreen from "../components/review-screen";

type DemoView = "students" | "stats";

/** Жишээ шалгалтын тоо — нийт сурагч тоотой нийцэх (5) */
const DEMO_EXAM = {
  title: "Нийгмийн ухаан",
  examLabel: "Шалгалт #1",
  date: "2026-03-20",
  passed: 4,
  failed: 1,
  notEvaluated: 0,
  gradeCounts: [
    { grade: "A", count: 2, color: "#26a69a" },
    { grade: "B", count: 2, color: "#4f7fd8" },
    { grade: "C", count: 1, color: "#f2c94c" },
    { grade: "D", count: 0, color: "#8dd3c7" },
    { grade: "F", count: 0, color: "#c3c9d6" },
  ] as const,
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sanitizeFilename(s: string) {
  const t = s.replace(/[^\w\u0400-\u04FF-]+/g, "_").replace(/^_+|_+$/g, "");
  return t.slice(0, 80) || "export";
}

function triggerExcelDownload(filename: string, tableHtml: string) {
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8" /></head>
      <body>${tableHtml}</body>
    </html>`;
  const blob = new Blob([`\ufeff${html}`], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadStudentListXls(className: string, students: Student[]) {
  const rows = students
    .map(
      (s, i) =>
        `<tr><td>${i + 1}</td><td>${escapeHtml(`${s.firstName} ${s.lastName}`)}</td></tr>`,
    )
    .join("");
  const table = `
    <table border="1">
      <tr><th colspan="2">Анги: ${escapeHtml(className)}</th></tr>
      <tr><th>№</th><th>Овог нэр</th></tr>
      ${rows}
    </table>`;
  triggerExcelDownload(`${sanitizeFilename(className)}-suragchid.xls`, table);
}

function downloadExamStatsXls(className: string) {
  const examTotal =
    DEMO_EXAM.passed + DEMO_EXAM.failed + DEMO_EXAM.notEvaluated;
  const passPct = examTotal
    ? Math.round((DEMO_EXAM.passed / examTotal) * 100)
    : 0;
  const gradeRows = DEMO_EXAM.gradeCounts.map(
    (g) => `<tr><td>${g.grade}</td><td>${g.count}</td></tr>`,
  ).join("");
  const table = `
    <table border="1">
      <tr><th colspan="2">Шалгалтын статистик — ${escapeHtml(className)}</th></tr>
      <tr><td>Хичээл</td><td>${escapeHtml(DEMO_EXAM.title)}</td></tr>
      <tr><td>Шалгалт</td><td>${escapeHtml(DEMO_EXAM.examLabel)}</td></tr>
      <tr><td>Огноо</td><td>${escapeHtml(DEMO_EXAM.date)}</td></tr>
      <tr><th colspan="2">Дүн</th></tr>
      <tr><td>Тэнцсэн</td><td>${DEMO_EXAM.passed} / ${examTotal}</td></tr>
      <tr><td>Тэнцээгүй</td><td>${DEMO_EXAM.failed}</td></tr>
      <tr><td>Шалгуулаагүй</td><td>${DEMO_EXAM.notEvaluated}</td></tr>
      <tr><td>Тэнцэлтийн хувь</td><td>${passPct}%</td></tr>
      <tr><th colspan="2">Үнэлгээ</th></tr>
      <tr><th>Үнэлгээ</th><th>Сурагчийн тоо</th></tr>
      ${gradeRows}
    </table>`;
  triggerExcelDownload(`${sanitizeFilename(className)}-shalgalt-statistik.xls`, table);
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function pieSlicePath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function DemoExamStatsChart({
  gradeCounts,
}: {
  gradeCounts: readonly { grade: string; count: number; color: string }[];
}) {
  const total = gradeCounts.reduce((s, g) => s + g.count, 0);
  const chartRadius = 88;
  const chartSize = 220;
  const chartCenter = chartSize / 2;

  const withSlices = useMemo(() => {
    if (!total) {
      return [] as Array<
        (typeof gradeCounts)[number] & {
          path: string;
          labelPosition: { x: number; y: number };
        }
      >;
    }
    let current = 0;
    return gradeCounts
      .filter((g) => g.count > 0)
      .map((item) => {
        const sweep = (item.count / total) * 360;
        const startAngle = current;
        const endAngle = current + sweep;
        current = endAngle;
        const labelAngle = startAngle + sweep / 2;
        return {
          ...item,
          path: pieSlicePath(
            chartCenter,
            chartCenter,
            chartRadius,
            startAngle,
            endAngle,
          ),
          labelPosition: polarToCartesian(
            chartCenter,
            chartCenter,
            chartRadius * 0.58,
            labelAngle,
          ),
        };
      });
  }, [gradeCounts, total]);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:justify-center">
      <div className="relative mx-auto w-full max-w-[220px] shrink-0">
        {total > 0 ? (
          <svg
            className="h-auto w-full"
            viewBox={`0 0 ${chartSize} ${chartSize}`}
            aria-label="Үнэлгээний хуваарилалт"
          >
            {withSlices.map((slice) => (
              <g key={slice.grade}>
                <path
                  d={slice.path}
                  fill={slice.color}
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  fill="#1f2a44"
                  fontSize="13"
                  fontWeight="700"
                  textAnchor="middle"
                  x={slice.labelPosition.x}
                  y={slice.labelPosition.y}
                >
                  {slice.grade} ({slice.count})
                </text>
              </g>
            ))}
          </svg>
        ) : (
          <p className="py-12 text-center text-4 text-[#66789f]">
            Мэдээлэл алга
          </p>
        )}
      </div>
      <ul className="w-full max-w-xs space-y-2">
        {gradeCounts.map((g) => (
          <li
            key={g.grade}
            className="flex items-center justify-between rounded-lg border border-[#e4eaf5] bg-[#f9fbff] px-3 py-2"
          >
            <span className="flex items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: g.color }}
              />
              <span className="text-4 font-bold text-[#34425f]">
                {g.grade}
              </span>
            </span>
            <span className="text-4 font-semibold text-[#4a5875]">
              {g.count} сурагч
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TeacherDemoClassPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentNumber = searchParams.get("student");

  const demoClass = useMemo(
    () => store.getClass(TEACHER_DEMO_CLASS_ID),
    [],
  );
  const students = useMemo(
    () => store.listStudentsInClass(TEACHER_DEMO_CLASS_ID),
    [],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<DemoView>("students");

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedId) ?? null,
    [students, selectedId],
  );

  const classTotal = students.length;
  const examTotal =
    DEMO_EXAM.passed + DEMO_EXAM.failed + DEMO_EXAM.notEvaluated;

  if (studentNumber) {
    return (
      <ReviewScreen
        studentCode={studentNumber}
        onBack={() => router.push("/teacher/demo-class")}
      />
    );
  }

  return (
    <section className="px-4 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm sm:p-8">
          <button
            type="button"
            onClick={() => router.push("/teacher")}
            className="inline-flex items-center gap-2 text-4 font-semibold text-[#2f3c59] transition-colors hover:text-[#4f9dff]"
          >
            <ArrowLeft className="h-5 w-5" />
            Нүүр хуудас руу буцах
          </button>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-[#4f9dff]">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-5 font-extrabold text-[#1f2a44]">
                {demoClass?.name ?? "10А (жишээ)"}
              </h1>
              <p className="mt-2 text-3 text-[#66789f]">
                Доорх товчоор харах хэсгээ сонгоно уу.
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex flex-wrap gap-2 rounded-2xl border border-[#d9dee8] bg-white p-2 shadow-sm"
          role="tablist"
          aria-label="Жишээ ангийн хэсгүүд"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "students"}
            onClick={() => setActiveView("students")}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-4 font-semibold transition-colors sm:flex-none sm:min-w-[200px] ${
              activeView === "students"
                ? "bg-[#4f9dff] text-white shadow-sm"
                : "bg-transparent text-[#2f3c59] hover:bg-[#f6faff] hover:text-[#4f9dff]"
            }`}
          >
            <Users
              className={`h-5 w-5 shrink-0 ${activeView === "students" ? "text-white" : "text-[#4f9dff]"}`}
            />
            Сурагчид
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "stats"}
            onClick={() => setActiveView("stats")}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-4 font-semibold transition-colors sm:flex-none sm:min-w-[220px] ${
              activeView === "stats"
                ? "bg-[#4f9dff] text-white shadow-sm"
                : "bg-transparent text-[#2f3c59] hover:bg-[#f6faff] hover:text-[#4f9dff]"
            }`}
          >
            <BarChart3
              className={`h-5 w-5 shrink-0 ${activeView === "stats" ? "text-white" : "text-[#4f9dff]"}`}
            />
            Шалгалтын статистик
          </button>
        </div>

        {activeView === "students" ? (
          <div className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-5 font-extrabold text-[#1f2a44]">
                  <Users className="h-6 w-6 shrink-0 text-[#4f9dff]" />
                  Сурагчид
                </h2>
                <p className="mt-2 text-4 text-[#64748b]">
                  Мөр дарахад сонгогдож, ангийн нийт тоо харагдана.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  downloadStudentListXls(
                    demoClass?.name ?? "10А-жишээ",
                    students,
                  )
                }
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#4f9dff] px-4 py-2.5 text-3 font-semibold text-white shadow-sm transition hover:bg-[#3f8ff5] sm:text-4"
              >
                <Download className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                Татах
              </button>
            </div>

            {selectedStudent ? (
              <div className="mt-5 rounded-xl border border-[#c8d6ea] bg-[#f6faff] p-4">
                <p className="text-3 font-semibold uppercase tracking-wide text-[#4f9dff]">
                  Сонгогдсон сурагч
                </p>
                <p className="mt-2 text-5 font-extrabold text-[#1f2a44]">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </p>
                <div className="mt-4 rounded-lg bg-white/80 px-4 py-3 text-4 text-[#1f2a44]">
                  <span className="font-semibold text-[#4f9dff]">
                    Энэ ангид нийт {classTotal} сурагч
                  </span>{" "}
                  бүртгэлтэй.
                </div>
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/teacher/demo-class?student=${encodeURIComponent(selectedStudent.studentNumber)}`,
                    )
                  }
                  className="mt-4 w-full rounded-xl bg-[#4f9dff] py-2.5 text-4 font-semibold text-white transition hover:bg-[#3f8ff5] sm:w-auto sm:px-6"
                >
                  Үр дүн дэлгэрэнгүй харах
                </button>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 py-6 text-center text-4 text-[#64748b]">
                Сурагч сонгоогүй байна. Доорх хүснэгтээс мөр дараарай.
                <p className="mt-2 font-semibold text-[#334261]">
                  Ангид одоогоор {classTotal} сурагч байна.
                </p>
              </div>
            )}

            <div className="mt-6 overflow-x-auto rounded-xl border border-[#e2e8f0]">
              <table className="w-full min-w-[320px]">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                    <th className="px-4 py-3 text-left text-4 font-semibold text-[#64748b]">
                      Нэр
                    </th>
                    <th className="px-4 py-3 text-right text-4 font-semibold text-[#64748b]">
                      Дэлгэрэнгүй
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedId(student.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedId(student.id);
                        }
                      }}
                      className={`cursor-pointer border-b border-[#f1f5f9] transition last:border-0 hover:bg-[#f6faff] ${
                        selectedId === student.id
                          ? "bg-[#edf4ff]/90 ring-1 ring-inset ring-[#4f9dff]/35"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-4 font-semibold text-[#1f2a44]">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(student.id);
                            router.push(
                              `/teacher/demo-class?student=${encodeURIComponent(student.studentNumber)}`,
                            );
                          }}
                          className="text-4 font-semibold text-[#4f9dff] transition-colors hover:text-[#3f8ff5] hover:underline"
                        >
                          Үр дүн
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-5 font-extrabold text-[#1f2a44]">
                  <BarChart3 className="h-6 w-6 shrink-0 text-[#4f9dff]" />
                  Шалгалтын статистик
                </h2>
                <p className="mt-2 text-4 text-[#64748b]">
                  {DEMO_EXAM.title} · {DEMO_EXAM.examLabel} · {DEMO_EXAM.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  downloadExamStatsXls(demoClass?.name ?? "10А-жишээ")
                }
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#4f9dff] px-4 py-2.5 text-3 font-semibold text-white shadow-sm transition hover:bg-[#3f8ff5] sm:text-4"
              >
                <Download className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                Татах
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#cde4d8] bg-[#ecfdf5] p-4">
                  <p className="text-3 font-semibold text-[#047857]">Тэнцсэн</p>
                  <p className="mt-1 text-5 font-extrabold text-[#047857]">
                    {DEMO_EXAM.passed}
                    <span className="text-4 font-semibold text-[#64748b]">
                      {" "}
                      / {examTotal}
                    </span>
                  </p>
                </div>
                <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4">
                  <p className="text-3 font-semibold text-[#b91c1c]">Тэнцээгүй</p>
                  <p className="mt-1 text-5 font-extrabold text-[#b91c1c]">
                    {DEMO_EXAM.failed}
                  </p>
                </div>
                <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                  <p className="text-3 font-semibold text-[#64748b]">
                    Шалгуулаагүй
                  </p>
                  <p className="mt-1 text-5 font-extrabold text-[#334261]">
                    {DEMO_EXAM.notEvaluated}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#e2e8f0] bg-[#fafbff] p-5">
                <p className="mb-4 text-4 font-bold text-[#1f2a44]">
                  Үнэлгээний хуваарилалт
                </p>
                <DemoExamStatsChart gradeCounts={DEMO_EXAM.gradeCounts} />
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
                <div
                  className="h-full rounded-full bg-[#4f9dff] transition-all"
                  style={{
                    width: `${examTotal ? (DEMO_EXAM.passed / examTotal) * 100 : 0}%`,
                  }}
                  title="Тэнцсэн хувь"
                />
              </div>
              <p className="text-center text-3 font-semibold text-[#60708f]">
                Тэнцэлтийн хувь:{" "}
                {examTotal
                  ? Math.round((DEMO_EXAM.passed / examTotal) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
