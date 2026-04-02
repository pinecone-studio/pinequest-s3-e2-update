/** @format */

import type { PastExamRow, PastExamStudentScore } from "./class-past-exams-types";
import type { Student } from "./types";

export type ApiStudentExamResult = {
  id: string;
  examId: string;
  studentId: string;
  totalScore: number | null;
  actualScore: number | null;
  status: string | null;
};

export type ApiExamSummary = {
  id: string;
  subjectId: string;
  title: string | null;
  date: string | null;
  score: number | null;
  grade: number;
};

function pickScore(r: ApiStudentExamResult): number {
  const a = r.actualScore;
  const t = r.totalScore;
  if (typeof a === "number" && Number.isFinite(a)) return a;
  if (typeof t === "number" && Number.isFinite(t)) return t;
  return 0;
}

/**
 * D1 `studentExamResult` + `exam` → PastExamRow (асуулт бүрээр нь raw data байхгүй тул attempts хоосон).
 */
export function buildPastExamRowsFromApi(
  classId: string,
  roster: Student[],
  results: ApiStudentExamResult[],
  exams: ApiExamSummary[],
  subjectNameById: Map<string, string>,
): PastExamRow[] {
  const studentById = new Map(roster.map((s) => [s.id, s]));
  const examById = new Map(exams.map((e) => [e.id, e]));

  const byExam = new Map<string, ApiStudentExamResult[]>();
  for (const r of results) {
    const list = byExam.get(r.examId) ?? [];
    list.push(r);
    byExam.set(r.examId, list);
  }

  const rows: PastExamRow[] = [];

  for (const [examId, examResults] of byExam) {
    const exam = examById.get(examId);
    if (!exam) continue;

    const maxScore = Math.max(1, exam.score ?? 100);
    const passLine = maxScore * 0.5;
    const subject =
      subjectNameById.get(exam.subjectId) ?? exam.subjectId ?? "Хичээл";

    const studentScores: PastExamStudentScore[] = examResults.map((r) => {
      const st = studentById.get(r.studentId);
      const score = pickScore(r);
      return {
        studentId: r.studentId,
        studentNumber: st?.studentNumber ?? r.studentId.slice(0, 8),
        firstName: st?.firstName ?? "—",
        lastName: st?.lastName ?? "—",
        score,
        passed: score >= passLine,
        attempts: [],
      };
    });

    const passed = studentScores.filter((s) => s.passed).length;

    rows.push({
      id: `${examId}-${classId}`,
      blueprintId: examId,
      subject,
      examTitle: exam.title?.trim() || "Шалгалт",
      date: exam.date?.trim() || "—",
      maxScore,
      passed,
      total: studentScores.length,
      studentScores,
      mostFailedQuestion: null,
    });
  }

  return rows.sort((a, b) => safeDateKey(b.date).localeCompare(safeDateKey(a.date)));
}

function safeDateKey(d: string): string {
  if (!d || d === "—") return "";
  return d.slice(0, 10);
}
