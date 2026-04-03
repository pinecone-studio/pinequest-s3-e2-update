"use client";

import { buildPastExamFullStatisticsExportHtml } from "@/app/lib/class-past-exams-export-html";
import type { PastExamRow, PastExamStudentScore } from "@/app/lib/class-past-exams-types";
import type { Student } from "@/app/lib/types";
import { SAVED_EXAMS_STORAGE_KEY } from "@/app/teacher/exam/_lib/constants";
import type { SavedExamRecord } from "@/app/teacher/exam/_lib/types";
import { normalizeSavedExamRecord } from "@/app/teacher/exam/_lib/utils";

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function sanitizeFilename(s: string) {
  const t = s.replace(/[^\w\u0400-\u04FF-]+/g, "_").replace(/^_+|_+$/g, "");
  return t.slice(0, 80) || "export";
}

export function safeExamDateKey(date?: string | null) {
  if (!date) return "";
  return date.trim();
}

export function formatExamDate(date?: string | null) {
  if (!date || !date.trim()) return "Огноо байхгүй";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
}

function escapeCsvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function buildCsvFromTablesHtml(tablesHtml: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    `<html><body>${tablesHtml}</body></html>`,
    "text/html",
  );
  const tableNodes = Array.from(doc.querySelectorAll("table"));
  const csvLines: string[] = [];

  for (const [tableIndex, table] of tableNodes.entries()) {
    const trNodes = Array.from(table.querySelectorAll("tr"));

    for (const tr of trNodes) {
      const cellNodes = Array.from(tr.children).filter(
        (node): node is HTMLTableCellElement =>
          node instanceof HTMLTableCellElement,
      );

      if (cellNodes.length === 0) continue;

      const cells: string[] = [];
      for (const cell of cellNodes) {
        const value = (cell.textContent ?? "").replace(/\u00a0/g, " ").trim();
        cells.push(escapeCsvCell(value));

        const extraColumns = Math.max((cell.colSpan || 1) - 1, 0);
        for (let i = 0; i < extraColumns; i += 1) {
          cells.push(escapeCsvCell(""));
        }
      }

      csvLines.push(cells.join(","));
    }

    if (tableIndex < tableNodes.length - 1) {
      csvLines.push("");
    }
  }

  return csvLines.join("\r\n");
}

export function triggerExcelDownload(filename: string, tableHtml: string) {
  const csv = buildCsvFromTablesHtml(tableHtml);
  const finalFilename = filename.replace(/\.xls$/i, ".csv");
  const blob = new Blob([`\ufeff${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function triggerPdfDownload(title: string, bodyHtml: string) {
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
      <body><h1>${escapeHtml(title)}</h1>${bodyHtml}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
  printWindow.onafterprint = () => printWindow.close();
}

export function buildStudentListTable(className: string, students: Student[]) {
  const rows = students
    .map(
      (s, i) =>
        `<tr><td>${i + 1}</td><td>${escapeHtml(`${s.firstName} ${s.lastName}`)}</td></tr>`,
    )
    .join("");
  return `<table border="1"><tr><th colspan="2">Анги: ${escapeHtml(className)}</th></tr><tr><th>№</th><th>Овог нэр</th></tr>${rows}</table>`;
}

export function downloadStudentListXls(className: string, students: Student[]) {
  triggerExcelDownload(
    `${sanitizeFilename(className)}-suragchid.csv`,
    buildStudentListTable(className, students),
  );
}

export function downloadStudentListPdf(className: string, students: Student[]) {
  triggerPdfDownload(
    `${className} - Сурагчдын жагсаалт`,
    buildStudentListTable(className, students),
  );
}

export function downloadFullExamStatisticsXls(className: string, row: PastExamRow) {
  const base = sanitizeFilename(
    `${className}_${safeExamDateKey(row.date)}_${row.examTitle}_ang_statistik`,
  );
  triggerExcelDownload(
    `${base}.csv`,
    buildPastExamFullStatisticsExportHtml(className, row),
  );
}

export function sortPastExamStudents(scores: PastExamRow["studentScores"]) {
  return [...scores].sort(
    (a, b) =>
      a.lastName.localeCompare(b.lastName, "mn", { sensitivity: "base" }) ||
      a.firstName.localeCompare(b.firstName, "mn", { sensitivity: "base" }),
  );
}

export function buildSingleStudentPastExamTablesHtml(
  className: string,
  exam: PastExamRow,
  student: PastExamStudentScore,
) {
  const summary = `<table border="1"><tr><th colspan="2">Сурагчийн шалгалтын дүн — ${escapeHtml(className)}</th></tr><tr><td>Огноо</td><td>${escapeHtml(formatExamDate(exam.date))}</td></tr><tr><td>Хичээл</td><td>${escapeHtml(exam.subject)}</td></tr><tr><td>Шалгалт</td><td>${escapeHtml(exam.examTitle)}</td></tr><tr><td>Сурагч</td><td>${escapeHtml(`${student.lastName} ${student.firstName}`)}</td></tr><tr><td>Оноо</td><td>${student.score} / ${exam.maxScore}</td></tr><tr><td>Тэнцсэн</td><td>${student.passed ? "Тийм" : "Үгүй"}</td></tr></table>`;
  if (!student.attempts?.length) return summary;

  const attemptRows = student.attempts
    .map(
      (a) =>
        `<tr><td>${a.order}</td><td>${escapeHtml(a.question)}</td><td>${escapeHtml(a.studentAnswer)}</td><td>${a.pointsEarned} / ${a.pointsMax}</td></tr>`,
    )
    .join("");

  return `${summary}<table border="1" style="margin-top:14px"><tr><th colspan="4">Асуулт бүрээр</th></tr><tr><th>№</th><th>Асуулт</th><th>Хариулт</th><th>Оноо</th></tr>${attemptRows}</table>`;
}

export function downloadSingleStudentPastExamXls(
  className: string,
  exam: PastExamRow,
  student: PastExamStudentScore,
) {
  const base = sanitizeFilename(
    `${className}_${student.lastName}_${student.firstName}_${safeExamDateKey(exam.date)}`,
  );
  triggerExcelDownload(
    `${base}.csv`,
    buildSingleStudentPastExamTablesHtml(className, exam, student),
  );
}

export function markSavedExamDelivered(examId: string, classId: string) {
  try {
    const raw = window.localStorage.getItem(SAVED_EXAMS_STORAGE_KEY);
    const savedExams = raw
      ? (JSON.parse(raw) as SavedExamRecord[]).map(normalizeSavedExamRecord)
      : [];
    const nextSavedExams = savedExams.map((item) =>
      item.id === examId
        ? { ...item, sentClassIds: Array.from(new Set([...(item.sentClassIds ?? []), classId])) }
        : item,
    );
    window.localStorage.setItem(SAVED_EXAMS_STORAGE_KEY, JSON.stringify(nextSavedExams));
  } catch {
    // Ignore local persistence issues and keep the class-page flow usable.
  }
}
