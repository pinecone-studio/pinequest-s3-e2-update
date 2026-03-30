import type { Student } from "@/app/lib/types";
import type { PastExamRow, PastExamStudentScore } from "@/app/lib/class-past-exams-mock";

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

function triggerExcelDownload(filename: string, tableHtml: string) {
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charSet="UTF-8" /></head><body>${tableHtml}</body></html>`;
  const blob = new Blob([`\ufeff${html}`], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
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
  triggerExcelDownload(`${base}.xls`, html);
}
