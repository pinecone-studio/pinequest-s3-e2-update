import type { Student } from "@/app/lib/types";
import type { PastExamRow, PastExamStudentScore } from "@/app/lib/class-past-exams-types";

export function shortStudentName(student: Student) {
  const last = student.lastName.trim();
  const first = student.firstName.trim();
  if (!first) return last;
  if (!last) return first;
  return `${last.charAt(0).toUpperCase()}.${first}`;
}

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

function triggerExcelDownload(filename: string, tableHtml: string) {
  const csv = buildCsvFromTablesHtml(tableHtml);
  const finalFilename = filename.replace(/\.xls$/i, ".csv");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadSingleStudentPastExamXls(
  classNameLabel: string,
  exam: PastExamRow,
  student: PastExamStudentScore,
) {
  const summary = `
    <table border="1">
      <tr><th colspan="2">Сурагчийн шалгалтын дүн — ${escapeHtml(classNameLabel)}</th></tr>
      <tr><td>Огноо</td><td>${escapeHtml(exam.date)}</td></tr>
      <tr><td>Хичээл</td><td>${escapeHtml(exam.subject)}</td></tr>
      <tr><td>Шалгалт</td><td>${escapeHtml(exam.examTitle)}</td></tr>
      <tr><td>Сурагч</td><td>${escapeHtml(`${student.lastName} ${student.firstName}`)}</td></tr>
      <tr><td>Оноо</td><td>${student.score} / ${exam.maxScore}</td></tr>
      <tr><td>Тэнцсэн</td><td>${student.passed ? "Тийм" : "Үгүй"}</td></tr>
    </table>`;

  const details = student.attempts?.length
    ? `<table border="1" style="margin-top:14px"><tr><th colspan="4">Асуулт бүрээр</th></tr><tr><th>№</th><th>Асуулт</th><th>Хариулт</th><th>Оноо</th></tr>${student.attempts
        .map(
          (a) =>
            `<tr><td>${a.order}</td><td>${escapeHtml(a.question)}</td><td>${escapeHtml(a.studentAnswer)}</td><td>${a.pointsEarned} / ${a.pointsMax}</td></tr>`,
        )
        .join("")}</table>`
    : "";

  const html = `${summary}${details}`;
  const base = sanitizeFilename(
    `${classNameLabel}_${student.lastName}_${student.firstName}_${exam.date}`,
  );
  triggerExcelDownload(`${base}.csv`, html);
}
