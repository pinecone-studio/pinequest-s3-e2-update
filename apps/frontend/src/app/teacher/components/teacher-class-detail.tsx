/** @format */

"use client";

import {
	ArrowLeft,
	BarChart3,
	ChevronDown,
	ChevronUp,
	Download,
	History,
	Search,
	Users,
	X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPastExamsForClass } from "@/app/lib/class-past-exams-mock";
import { store } from "@/app/lib/store";
import { TEACHER_DEMO_CLASS_ID } from "@/app/lib/teacher-demo-class";
import type { Student } from "@/app/lib/types";
import ReviewScreen from "./review-screen";
import { useTeacher } from "../teacher-shell";

type ClassView = "students" | "stats" | "history";

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

function triggerPdfDownload(title: string, bodyHtml: string) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #1f2a44; }
          h1 { margin-bottom: 16px; font-size: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #d9dee8; padding: 8px 10px; text-align: left; }
          th { background: #f6faff; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        ${bodyHtml}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
  printWindow.onafterprint = () => {
    printWindow.close();
  };
}

function buildStudentListTable(className: string, students: Student[]) {
  const rows = students
    .map(
      (s, i) =>
        `<tr><td>${i + 1}</td><td>${escapeHtml(`${s.firstName} ${s.lastName}`)}</td></tr>`,
    )
    .join("");
  return `
    <table border="1">
      <tr><th colspan="2">Анги: ${escapeHtml(className)}</th></tr>
      <tr><th>№</th><th>Овог нэр</th></tr>
      ${rows}
    </table>`;
}

function downloadStudentListXls(className: string, students: Student[]) {
  const table = buildStudentListTable(className, students);
  triggerExcelDownload(`${sanitizeFilename(className)}-suragchid.xls`, table);
}

function downloadStudentListPdf(className: string, students: Student[]) {
  triggerPdfDownload(`${className} - Сурагчдын жагсаалт`, buildStudentListTable(className, students));
}

function sortPastExamStudents(
	scores: ReturnType<typeof getPastExamsForClass>[number]["studentScores"],
) {
  return [...scores].sort(
    (a, b) =>
      a.lastName.localeCompare(b.lastName, "mn", { sensitivity: "base" }) ||
      a.firstName.localeCompare(b.firstName, "mn", { sensitivity: "base" }),
  );
}

function buildPastExamsTable(
  className: string,
  exams: ReturnType<typeof getPastExamsForClass>,
) {
  const summaryRows = exams
    .map(
      (e) =>
        `<tr><td>${escapeHtml(e.date)}</td><td>${escapeHtml(e.subject)}</td><td>${escapeHtml(e.examTitle)}</td><td>${e.avgScore}</td><td>${e.passed}/${e.total}</td></tr>`,
    )
    .join("");
  const detailTables = exams
    .map((e) => {
      const sorted = sortPastExamStudents(e.studentScores);
      const sub = sorted
        .map(
          (s, i) =>
            `<tr><td>${i + 1}</td><td>${escapeHtml(`${s.lastName} ${s.firstName}`)}</td><td>${s.score}/${e.maxScore}</td><td>${s.passed ? "Тийм" : "Үгүй"}</td></tr>`,
        )
        .join("");
      return `
    <table border="1" style="margin-top:14px">
      <tr><th colspan="4">${escapeHtml(e.date)} · ${escapeHtml(e.subject)} · ${escapeHtml(e.examTitle)}</th></tr>
      <tr><th>№</th><th>Овог, нэр</th><th>Оноо</th><th>Тэнцсэн</th></tr>
      ${sub || "<tr><td colspan=\"4\">Сурагч алга</td></tr>"}
    </table>`;
    })
    .join("");
  return `
    <table border="1">
      <tr><th colspan="5">Өмнөх шалгалт — ${escapeHtml(className)} (нийлбэр)</th></tr>
      <tr><th>Огноо</th><th>Хичээл</th><th>Шалгалт</th><th>Дундаж</th><th>Тэнцсэн</th></tr>
      ${summaryRows}
    </table>
    ${detailTables}`;
}

function downloadPastExamsXls(
  className: string,
  exams: ReturnType<typeof getPastExamsForClass>,
) {
  const table = buildPastExamsTable(className, exams);
  triggerExcelDownload(
    `${sanitizeFilename(className)}-umnuh-shalgalt.xls`,
    table,
  );
}

function downloadPastExamsPdf(
  className: string,
  exams: ReturnType<typeof getPastExamsForClass>,
) {
  triggerPdfDownload(`${className} - Өмнөх шалгалт`, buildPastExamsTable(className, exams));
}

function buildExamStatsTable(className: string) {
  const examTotal =
    DEMO_EXAM.passed + DEMO_EXAM.failed + DEMO_EXAM.notEvaluated;
  const passPct = examTotal
    ? Math.round((DEMO_EXAM.passed / examTotal) * 100)
    : 0;
  const gradeRows = DEMO_EXAM.gradeCounts.map(
    (g) => `<tr><td>${g.grade}</td><td>${g.count}</td></tr>`,
  ).join("");
  return `
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
}

function downloadExamStatsXls(className: string) {
  const table = buildExamStatsTable(className);
  triggerExcelDownload(
    `${sanitizeFilename(className)}-shalgalt-statistik.xls`,
    table,
  );
}

function downloadExamStatsPdf(className: string) {
  triggerPdfDownload(`${className} - Шалгалтын статистик`, buildExamStatsTable(className));
}

function DownloadMenu({
  onExcel,
  onPdf,
  disabled,
  label = "Татах",
}: {
  onExcel: () => void;
  onPdf: () => void;
  disabled?: boolean;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#4f9dff] px-4 py-2.5 text-3 font-semibold text-white shadow-sm transition hover:bg-[#3f8ff5] disabled:cursor-not-allowed disabled:opacity-50 sm:text-4"
      >
        <Download className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
        {label}
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 z-20 mt-2 min-w-40 rounded-xl border border-[#d9dee8] bg-white p-1 shadow-md"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onExcel();
              setIsOpen(false);
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-3 font-semibold text-[#1f2a44] hover:bg-[#f1f6ff]"
          >
            Excel татах
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onPdf();
              setIsOpen(false);
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-3 font-semibold text-[#1f2a44] hover:bg-[#f1f6ff]"
          >
            PDF татах
          </button>
        </div>
      ) : null}
    </div>
  );
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
  }, [chartCenter, chartRadius, gradeCounts, total]);

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

export default function TeacherClassDetail({ classId }: { classId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentNumber = searchParams.get("student");
  const teacher = useTeacher();

  const cls = useMemo(() => store.getClass(classId), [classId]);
  const canAccess = useMemo(
    () =>
      store
        .getClassesForTeacherWithDemo(teacher.id)
        .some((c) => c.id === classId),
    [teacher.id, classId],
  );

  const students = useMemo(() => {
    if (!canAccess || !cls) return [];
    return store.listStudentsInClass(classId);
  }, [classId, canAccess, cls]);

  const pastExams = useMemo(
    () => (canAccess && cls ? getPastExamsForClass(classId, students) : []),
    [classId, canAccess, cls, students],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ClassView>("students");
  const [historyQuery, setHistoryQuery] = useState("");
  const [expandedPastExamId, setExpandedPastExamId] = useState<string | null>(
    null,
  );

  const filteredPastExams = useMemo(() => {
    const q = historyQuery.trim().toLowerCase();
    if (!q) return pastExams;
    return pastExams.filter((e) => {
      if (
        e.subject.toLowerCase().includes(q) ||
        e.examTitle.toLowerCase().includes(q) ||
        e.date.toLowerCase().includes(q) ||
        `${e.avgScore}`.includes(q)
      ) {
        return true;
      }
      return e.studentScores.some(
        (s) =>
          s.studentNumber.toLowerCase().includes(q) ||
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          `${s.lastName} ${s.firstName}`.toLowerCase().includes(q),
      );
    });
  }, [pastExams, historyQuery]);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedId) ?? null,
    [students, selectedId],
  );

  const classTotal = students.length;
  const examTotal =
    DEMO_EXAM.passed + DEMO_EXAM.failed + DEMO_EXAM.notEvaluated;

  const classPath = `/teacher/class/${encodeURIComponent(classId)}`;

  if (!canAccess || !cls) {
    return (
      <section className="px-4 py-10 sm:px-10">
        <div className="mx-auto max-w-lg rounded-2xl border border-[#d9dee8] bg-white p-8 text-center shadow-sm">
          <p className="text-4 font-semibold text-[#475569]">
            Энэ ангид хандах эрхгүй эсвэл анги олдсонгүй.
          </p>
          <button
            type="button"
            onClick={() => router.push("/teacher")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4f9dff] px-5 py-2.5 text-4 font-semibold text-white transition hover:bg-[#3f8ff5]"
          >
            <ArrowLeft className="h-5 w-5" />
            Нүүр хуудас
          </button>
        </div>
      </section>
    );
  }

  if (studentNumber) {
    return (
      <ReviewScreen
        studentCode={studentNumber}
        onBack={() => router.push(classPath)}
      />
    );
  }

  const isDemoClass = cls.id === TEACHER_DEMO_CLASS_ID;

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
                {cls.name}
              </h1>
              <p className="mt-2 text-3 text-[#66789f]">
                Сурагчид, статистик, өмнөх шалгалт хайх.
                {isDemoClass ? " (Жишээ анги.)" : ""}
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex flex-wrap justify-center gap-6 rounded-2xl border border-[#d9dee8] bg-white p-2 shadow-sm"
          role="tablist"
          aria-label="Ангийн хэсгүүд"
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
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "history"}
            onClick={() => setActiveView("history")}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-4 font-semibold transition-colors sm:flex-none sm:min-w-[200px] ${
              activeView === "history"
                ? "bg-[#4f9dff] text-white shadow-sm"
                : "bg-transparent text-[#2f3c59] hover:bg-[#f6faff] hover:text-[#4f9dff]"
            }`}
          >
            <History
              className={`h-5 w-5 shrink-0 ${activeView === "history" ? "text-white" : "text-[#4f9dff]"}`}
            />
            Өмнөх шалгалт
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
              <DownloadMenu
                onExcel={() => downloadStudentListXls(cls.name, students)}
                onPdf={() => downloadStudentListPdf(cls.name, students)}
              />
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
                      `${classPath}?student=${encodeURIComponent(selectedStudent.studentNumber)}`,
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
                      № / Нэр
                    </th>
                    <th className="px-8 py-3 text-right text-4 font-semibold text-[#64748b]">
                      Дэлгэрэнгүй
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
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
                      <td className="px-4 py-3 text-[#1f2a44]">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 w-8 shrink-0 text-4 font-semibold text-[#64748b]">
                            {index + 1}.
                          </span>
                          <div>
                            <p className="text-4 font-semibold text-[#1f2a44]">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="mt-1 text-3 text-[#7b8aa3]">
                              {student.studentNumber.toLowerCase()}@gmail.com
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(student.id);
                            router.push(
                              `${classPath}?student=${encodeURIComponent(student.studentNumber)}`,
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
        ) : activeView === "history" ? (
          <div className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-5 font-extrabold text-[#1f2a44]">
                  <History className="h-6 w-6 shrink-0 text-[#4f9dff]" />
                  Өмнөх шалгалт
                </h2>
                <p className="mt-2 text-4 text-[#64748b]">
                  Хичээл, шалгалт, огноо, дүн эсвэл сурагчийн нэрээр хайна уу.
                  Мөр дарахад сурагч тус бүрийн оноо гарна.
                </p>
              </div>
              <DownloadMenu
                label="Татах"
                disabled={filteredPastExams.length === 0}
                onExcel={() =>
                  downloadPastExamsXls(cls.name, filteredPastExams)
                }
                onPdf={() =>
                  downloadPastExamsPdf(cls.name, filteredPastExams)
                }
              />
            </div>

            <div className="relative mt-5">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a96ac]"
                aria-hidden
              />
              <input
                type="search"
                value={historyQuery}
                onChange={(e) => setHistoryQuery(e.target.value)}
                placeholder="Хайх: хичээл, шалгалт, огноо, сурагч…"
                className="w-full rounded-xl border border-[#d9dee8] bg-[#fafbfd] py-3 pl-11 pr-4 text-4 text-[#1f2a44] shadow-inner outline-none transition placeholder:text-[#94a3b8] focus:border-[#4f9dff] focus:bg-white focus:ring-4 focus:ring-[#4f9dff]/15"
                aria-label="Өмнөх шалгалт хайх"
              />
            </div>

            {filteredPastExams.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 py-10 text-center text-4 text-[#64748b]">
                {historyQuery.trim()
                  ? "Хайлтад тохирох шалгалт олдсонгүй."
                  : "Энэ ангийн өмнөх шалгалтын мэдээлэл одоогоор алга."}
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-xl border border-[#e2e8f0]">
                <table className="w-full min-w-[560px]">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                      <th
                        className="w-10 px-2 py-3 text-left text-4 font-semibold text-[#64748b]"
                        aria-label="Дэлгэрэнгүй"
                      />
                      <th className="px-4 py-3 text-left text-4 font-semibold text-[#64748b]">
                        Огноо
                      </th>
                      <th className="px-4 py-3 text-left text-4 font-semibold text-[#64748b]">
                        Хичээл
                      </th>
                      <th className="px-4 py-3 text-left text-4 font-semibold text-[#64748b]">
                        Шалгалт
                      </th>
                      <th className="px-4 py-3 text-right text-4 font-semibold text-[#64748b]">
                        Дундаж
                      </th>
                      <th className="px-4 py-3 text-right text-4 font-semibold text-[#64748b]">
                        Тэнцсэн
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPastExams.map((row) => {
                      const open = expandedPastExamId === row.id;
                      return (
                        <Fragment key={row.id}>
                          <tr
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              setExpandedPastExamId((id) =>
                                id === row.id ? null : row.id,
                              )
                            }
                            onKeyDown={(ev) => {
                              if (ev.key !== "Enter" && ev.key !== " ") return;
                              ev.preventDefault();
                              setExpandedPastExamId((id) =>
                                id === row.id ? null : row.id,
                              );
                            }}
                            className="cursor-pointer border-b border-[#f1f5f9] transition last:border-0 hover:bg-[#f6faff]"
                          >
                            <td className="px-2 py-3 text-[#4f9dff]">
                              {open ? (
                                <ChevronUp className="h-5 w-5" aria-hidden />
                              ) : (
                                <ChevronDown className="h-5 w-5" aria-hidden />
                              )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-4 font-semibold text-[#1f2a44]">
                              {row.date}
                            </td>
                            <td className="px-4 py-3 text-4 text-[#334261]">
                              {row.subject}
                            </td>
                            <td className="max-w-[220px] px-4 py-3 text-4 text-[#334261]">
                              {row.examTitle}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-right text-4 font-semibold text-[#1f2a44]">
                              {row.avgScore} / {row.maxScore}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-right text-4 text-[#4a5875]">
                              {row.passed} / {row.total}
                            </td>
                          </tr>
                          {open ? (
                            <tr className="border-b border-[#e8ecf2] bg-[#fafbfd]">
                              <td colSpan={6} className="px-4 py-4">
                                <p className="mb-3 text-3 font-bold text-[#334261]">
                                  Сурагч бүрийн оноо (дээд {row.maxScore})
                                </p>
                                {row.studentScores.length === 0 ? (
                                  <p className="text-4 text-[#64748b]">
                                    Энэ ангид сурагч алга.
                                  </p>
                                ) : (
                                  <div className="overflow-x-auto rounded-lg border border-[#e2e8f0] bg-white">
                                    <table className="w-full min-w-[320px] text-4">
                                      <thead>
                                        <tr className="border-b border-[#e2e8f0] bg-[#f1f5f9]">
                                          <th className="px-3 py-2 text-left font-semibold text-[#64748b]">
                                            Овог, нэр
                                          </th>
                                          <th className="px-3 py-2 text-right font-semibold text-[#64748b]">
                                            Оноо
                                          </th>
                                          <th className="px-3 py-2 text-right font-semibold text-[#64748b]">
                                            Тэнцсэн
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {sortPastExamStudents(
                                          row.studentScores,
                                        ).map((s) => (
                                          <tr
                                            key={s.studentId}
                                            className="border-b border-[#f1f5f9] last:border-0"
                                          >
                                            <td className="px-3 py-2 text-[#334261]">
                                              {s.lastName} {s.firstName}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2 text-right font-semibold text-[#1f2a44]">
                                              {s.score}{" "}
                                              <span className="font-normal text-[#94a3b8]">
                                                / {row.maxScore}
                                              </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2 text-right">
                                              <span
                                                className={
                                                  s.passed
                                                    ? "font-semibold text-[#2f66b9]"
                                                    : "font-semibold text-[#b91c1c]"
                                                }
                                              >
                                                {s.passed ? "Тийм" : "Үгүй"}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : isDemoClass ? (
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
              <DownloadMenu
                onExcel={() => downloadExamStatsXls(cls.name)}
                onPdf={() => downloadExamStatsPdf(cls.name)}
              />
            </div>

            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#cfe0fb] bg-[#eef6ff] p-4">
                  <p className="text-3 font-semibold text-[#2f66b9]">Тэнцсэн</p>
                  <p className="mt-1 text-5 font-extrabold text-[#2f66b9]">
                    {DEMO_EXAM.passed}
                    <span className="text-4 font-semibold text-[#64748b]">
                      {" "}
                      / {examTotal}
                    </span>
                  </p>
                </div>
                <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4">
                  <p className="text-3 font-semibold text-[#b91c1c]">
                    Тэнцээгүй
                  </p>
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
        ) : (
          <div className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-5 font-extrabold text-[#1f2a44]">
                  <BarChart3 className="h-6 w-6 shrink-0 text-[#4f9dff]" />
                  Шалгалтын статистик
                </h2>
                <p className="mt-2 text-4 text-[#64748b]">
                  Энэ ангийн нэгтгэл статистик удахгүй нэмэгдэнэ. Дэлгэрэнгүй
                  жагсаалтыг «Өмнөх шалгалт» табаас харна уу.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
