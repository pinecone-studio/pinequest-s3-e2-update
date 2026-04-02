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
  testIds?: string[] | null;
  openExerciseIds?: string[] | null;
};

export type ApiExamQuestionSummary = {
  id: string;
  question: string;
  score: number;
  correctAnswer?: string;
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
  questionById: Map<string, ApiExamQuestionSummary>,
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
    const questionIds = [
      ...(Array.isArray(exam.testIds) ? exam.testIds : []),
      ...(Array.isArray(exam.openExerciseIds) ? exam.openExerciseIds : []),
    ].filter(Boolean);
    const singleQuestion =
      questionIds.length === 1 ? questionById.get(questionIds[0]) : null;
    const singleQuestionMaxScore = Math.max(
      1,
      singleQuestion?.score ?? maxScore,
    );

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
        attempts: singleQuestion
          ? [
              {
                questionId: singleQuestion.id,
                order: 1,
                question: singleQuestion.question,
                correctAnswer: singleQuestion.correctAnswer,
                studentAnswer: "—",
                pointsEarned: Math.max(
                  0,
                  Math.min(singleQuestionMaxScore, score),
                ),
                pointsMax: singleQuestionMaxScore,
              },
            ]
          : [],
      };
    });

    const passed = studentScores.filter((s) => s.passed).length;
    const failedOnSingleQuestion = singleQuestion
      ? studentScores.filter(
          (student) => student.attempts[0]?.pointsEarned < singleQuestionMaxScore,
        ).length
      : 0;

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
      mostFailedQuestion:
        singleQuestion && failedOnSingleQuestion > 0
          ? {
              order: 1,
              question: singleQuestion.question,
              correctAnswer: singleQuestion.correctAnswer ?? "-",
              failCount: failedOnSingleQuestion,
              totalStudents: studentScores.length,
            }
          : null,
    });
  }

  return rows.sort((a, b) => safeDateKey(b.date).localeCompare(safeDateKey(a.date)));
}

function safeDateKey(d: string): string {
  if (!d || d === "—") return "";
  return d.slice(0, 10);
}
