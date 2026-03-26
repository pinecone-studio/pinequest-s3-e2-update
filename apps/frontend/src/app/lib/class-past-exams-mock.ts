import type { Student } from "./types";

/** Нэг сурагчийн нэг шалгалтын оноо */
export type PastExamStudentScore = {
  studentId: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  score: number;
  passed: boolean;
};

/** Жишээ өмнөх шалгалтын мөр — анги бүрийн сурагчдаар тооцоолсон дүн */
export type PastExamRow = {
  id: string;
  subject: string;
  examTitle: string;
  date: string;
  avgScore: number;
  maxScore: number;
  passed: number;
  total: number;
  studentScores: PastExamStudentScore[];
};

/** Дээд онооны тодорхой хувь — түүнээс дээш оноотойг тэнцсэн гэж үзнэ */
const PASS_FRACTION = 0.5;

function scoreHash(studentId: string, examSeed: string): number {
  let h = 2166136261;
  const s = `${examSeed}\0${studentId}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildStudentScores(
  roster: Student[],
  examSeed: string,
  maxScore: number,
): PastExamStudentScore[] {
  const passLine = Math.max(1, Math.ceil(maxScore * PASS_FRACTION));
  return roster.map((st) => {
    const h = scoreHash(st.id, examSeed);
    const score = Math.round(((h % 10_000) / 10_000) * maxScore);
    return {
      studentId: st.id,
      studentNumber: st.studentNumber,
      firstName: st.firstName,
      lastName: st.lastName,
      score,
      passed: score >= passLine,
    };
  });
}

const BASE_EXAMS: Array<
  Pick<PastExamRow, "subject" | "examTitle" | "date" | "maxScore"> & {
    id: string;
  }
> = [
  {
    id: "pe-1",
    subject: "Нийгмийн ухаан",
    examTitle: "Шалгалт #1 — Үндсэн хууль",
    date: "2026-03-20",
    maxScore: 20,
  },
  {
    id: "pe-2",
    subject: "Нийгмийн ухаан",
    examTitle: "Улирлын дүн — 2-р улирал",
    date: "2026-02-08",
    maxScore: 20,
  },
  {
    id: "pe-3",
    subject: "Түүх",
    examTitle: "Богино шалгалт",
    date: "2026-01-15",
    maxScore: 15,
  },
  {
    id: "pe-4",
    subject: "Математик",
    examTitle: "Алгебрын шалгалт",
    date: "2025-12-20",
    maxScore: 100,
  },
  {
    id: "pe-5",
    subject: "Англи хэл",
    examTitle: "Vocabulary & reading",
    date: "2025-11-28",
    maxScore: 25,
  },
];

export function getPastExamsForClass(
  classId: string,
  roster: Student[],
): PastExamRow[] {
  return BASE_EXAMS.map((e) => {
    const examSeed = `${e.id}-${classId}`;
    const studentScores = buildStudentScores(roster, examSeed, e.maxScore);
    const total = studentScores.length;
    const passed = studentScores.filter((s) => s.passed).length;
    const avgScore =
      total === 0
        ? 0
        : Math.round(
            (studentScores.reduce((sum, s) => sum + s.score, 0) / total) * 10,
          ) / 10;

    return {
      id: `${e.id}-${classId}`,
      subject: e.subject,
      examTitle: e.examTitle,
      date: e.date,
      avgScore,
      maxScore: e.maxScore,
      passed,
      total,
      studentScores,
    };
  });
}
