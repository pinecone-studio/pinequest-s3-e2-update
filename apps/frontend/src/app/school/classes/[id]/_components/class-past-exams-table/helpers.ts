import { buildPastExamFullStatisticsExportHtml } from "@/app/lib/class-past-exams-export-html";
import type { PastExamRow, PastExamStudentScore } from "@/app/lib/class-past-exams-types";

export type LetterGrade = "A" | "B" | "C" | "D" | "F";

export const LETTER_GRADE_ORDER: LetterGrade[] = ["A", "B", "C", "D", "F"];

export const LETTER_GRADE_STYLES: Record<
  LetterGrade,
  { fill: string; labelMn: string }
> = {
  A: { fill: "#16a34a", labelMn: "Маш сайн (A)" },
  B: { fill: "#4f9dff", labelMn: "Сайн (B)" },
  C: { fill: "#ca8a04", labelMn: "Дунд (C)" },
  D: { fill: "#ea580c", labelMn: "Муу (D)" },
  F: { fill: "#dc2626", labelMn: "Тэнцээгүй (F)" },
};

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

export function downloadFullExamStatisticsXls(
  classNameLabel: string,
  row: PastExamRow,
) {
  const html = buildPastExamFullStatisticsExportHtml(classNameLabel, row);
  const base = sanitizeFilename(
    `${classNameLabel}_${row.date}_${row.examTitle}_ang_statistik`,
  );
  triggerExcelDownload(`${base}.csv`, html);
}

export function buildSingleStudentPastExamTablesHtml(
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

  if (!student.attempts?.length) return summary;

  const attemptRows = student.attempts
    .map(
      (a) =>
        `<tr><td>${a.order}</td><td>${escapeHtml(a.question)}</td><td>${escapeHtml(a.studentAnswer)}</td><td>${a.pointsEarned} / ${a.pointsMax}</td></tr>`,
    )
    .join("");

  return `${summary}
    <table border="1" style="margin-top:14px">
      <tr><th colspan="4">Асуулт бүрээр</th></tr>
      <tr><th>№</th><th>Асуулт</th><th>Хариулт</th><th>Оноо</th></tr>
      ${attemptRows}
    </table>`;
}

export function downloadSingleStudentPastExamXls(
  classNameLabel: string,
  exam: PastExamRow,
  student: PastExamStudentScore,
) {
  const html = buildSingleStudentPastExamTablesHtml(classNameLabel, exam, student);
  const base = sanitizeFilename(
    `${classNameLabel}_${student.lastName}_${student.firstName}_${exam.date}`,
  );
  triggerExcelDownload(`${base}.csv`, html);
}

export function sortPastExamStudents(scores: PastExamStudentScore[]) {
  return [...scores].sort(
    (a, b) =>
      a.lastName.localeCompare(b.lastName, "mn", { sensitivity: "base" }) ||
      a.firstName.localeCompare(b.firstName, "mn", { sensitivity: "base" }),
  );
}

export function letterGradeFromPercent(percent: number): LetterGrade {
  if (percent >= 90) return "A";
  if (percent >= 80) return "B";
  if (percent >= 70) return "C";
  if (percent >= 60) return "D";
  return "F";
}

export function pastExamGradeBuckets(row: PastExamRow): Record<LetterGrade, number> {
  const empty: Record<LetterGrade, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  if (row.maxScore <= 0 || row.studentScores.length === 0) return empty;

  for (const s of row.studentScores) {
    const pct = (s.score / row.maxScore) * 100;
    empty[letterGradeFromPercent(pct)] += 1;
  }
  return empty;
}
