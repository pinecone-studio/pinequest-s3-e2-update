/** @format */

import type {
  PastExamQuestionAggregate,
  PastExamRow,
  PastExamStudentScore,
} from "./class-past-exams-types";

function escapeHtmlCell(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * API-аас ирсэн PastExamRow-д асуулт бүрээр нарийвчилсан blueprint байхгүй тул хоосон буцаана.
 */
export function getPastExamQuestionAggregates(
  row: PastExamRow,
): PastExamQuestionAggregate[] {
  void row;
  return [];
}

function sortPastExamStudentsForExport(
  scores: PastExamStudentScore[],
): PastExamStudentScore[] {
  return [...scores].sort(
    (a, b) =>
      a.lastName.localeCompare(b.lastName, "mn", { sensitivity: "base" }) ||
      a.firstName.localeCompare(b.firstName, "mn", { sensitivity: "base" }),
  );
}

/**
 * Excel-д нээх HTML хүснэгт — шалгалтын бүрэн ангийн статистик.
 */
export function buildPastExamFullStatisticsExportHtml(
  className: string,
  row: PastExamRow,
): string {
  const aggregates = getPastExamQuestionAggregates(row);
  const sortedByFail = [...aggregates].sort(
    (a, b) => b.failedCount - a.failedCount || b.order - a.order,
  );
  const total = row.total;
  const passed = row.passed;
  const failedStudents = total - passed;
  const passPct = total > 0 ? Math.round((passed / total) * 100) : 0;

  const most = row.mostFailedQuestion;

  const summaryRows = `
      <tr><th colspan="2">Шалгалтын бүрэн статистик — ${escapeHtmlCell(className)}</th></tr>
      <tr><td>Огноо</td><td>${escapeHtmlCell(row.date)}</td></tr>
      <tr><td>Хичээл</td><td>${escapeHtmlCell(row.subject)}</td></tr>
      <tr><td>Шалгалт</td><td>${escapeHtmlCell(row.examTitle)}</td></tr>
      <tr><td>Нийт сурагч</td><td>${total}</td></tr>
      <tr><td>Тэнцсэн</td><td>${passed} (${passPct}%)</td></tr>
      <tr><td>Тэнцээгүй</td><td>${failedStudents}</td></tr>
      <tr><td>Дээд оноо (шалгалт)</td><td>${row.maxScore}</td></tr>
      ${
        most
          ? `<tr><td>Хамгийн олон алдсан асуулт</td><td>№${most.order} — ${most.failCount}/${most.totalStudents} сурагч</td></tr>`
          : ""
      }`;

  const questionHeader = `
    <table border="1" style="margin-top:16px">
      <tr><th colspan="8">Асуулт бүрийн статистик</th></tr>
      <tr>
        <th>№</th>
        <th>Асуулт</th>
        <th>Дээд оноо</th>
        <th>Бүрэн оноо</th>
        <th>Хэсэгчилсэн</th>
        <th>Тэг оноо</th>
        <th>Бүрэн биш (нийт)</th>
        <th>Зөв хариулт (загвар)</th>
      </tr>`;

  const questionBody = sortedByFail
    .map(
      (q) =>
        `<tr>
        <td>${q.order}</td>
        <td>${escapeHtmlCell(q.question)}</td>
        <td>${q.pointsMax}</td>
        <td>${q.fullCreditCount}</td>
        <td>${q.partialCreditCount}</td>
        <td>${q.zeroCount}</td>
        <td>${q.failedCount}</td>
        <td>${escapeHtmlCell(q.correctAnswer)}</td>
      </tr>`,
    )
    .join("");

  const studentRows = sortPastExamStudentsForExport(row.studentScores)
    .map(
      (s, idx) =>
        `<tr><td>${idx + 1}</td><td>${escapeHtmlCell(`${s.lastName} ${s.firstName}`)}</td><td>${escapeHtmlCell(s.studentNumber)}</td><td>${s.score} / ${row.maxScore}</td><td>${s.passed ? "Тийм" : "Үгүй"}</td></tr>`,
    )
    .join("");

  const studentTable = `
    <table border="1" style="margin-top:16px">
      <tr><th colspan="5">Сурагч бүрийн оноо</th></tr>
      <tr><th>№</th><th>Овог нэр</th><th>Код</th><th>Оноо</th><th>Тэнцсэн</th></tr>
      ${studentRows}
    </table>`;

  return `
    <table border="1">${summaryRows}
    </table>
    ${questionHeader}
      ${questionBody}
    </table>
    ${studentTable}`;
}
