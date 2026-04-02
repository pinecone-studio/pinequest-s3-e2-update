/** @format */

import type { ExamDetail } from "../_types/exam";
import type { ExamStatus } from "../../_types/exam";
import {
  deriveExamStatus,
  type BackendExamRow,
  type ClassRowLite,
  type TeacherRowLite,
} from "../../_lib/school-exam-map";

function parseDurationMinutes(duration: string): number {
  const d = duration.trim();
  const n = Number.parseInt(d.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 45;
}

function splitDateAndTime(dateRaw: string | null): { date: string; time: string } {
  if (!dateRaw?.trim()) {
    return { date: "", time: "09:00" };
  }
  const s = dateRaw.trim();
  if (s.includes("T")) {
    const [date, rest] = s.split("T");
    const time = rest?.slice(0, 5) ?? "09:00";
    return { date: date ?? "", time: time.length >= 5 ? time : "09:00" };
  }
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(s)) {
    const [date, hm] = s.split(/\s+/);
    return { date: date ?? "", time: hm?.slice(0, 5) ?? "09:00" };
  }
  return { date: s.slice(0, 10), time: "09:00" };
}

function addMinutesToClock(start: string, mins: number): string {
  const [h, m] = start.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return start;
  let total = h * 60 + m + mins;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function teacherShortLabel(t: TeacherRowLite | undefined): string {
  if (!t) return "—";
  const l = t.lastName.trim();
  const f = t.firstName.trim();
  if (!l && !f) return "—";
  if (!l) return f;
  if (!f) return l;
  return `${l.charAt(0).toUpperCase()}.${f}`;
}

function formatClassLabel(grade: number, section: string) {
  return `${grade}${section.trim().toUpperCase()}`;
}

type ResultRow = {
  studentId: string;
  actualScore: number | null;
  totalScore: number | null;
  status: string | null;
};

export function mapGqlExamToExamDetail(
  exam: BackendExamRow & { testIds?: string[]; openExerciseIds?: string[] },
  subjectName: string,
  classById: Map<string, ClassRowLite>,
  teacherById: Map<string, TeacherRowLite>,
  results: ResultRow[],
  rosterStudentCount: number,
): ExamDetail {
  const testIds = exam.testIds ?? [];
  const openExerciseIds = exam.openExerciseIds ?? [];
  const questionCount = testIds.length + openExerciseIds.length;

  const allowed = exam.allowedClassIds ?? [];
  let className = `${exam.grade}`;
  if (allowed.length > 0) {
    const labels = allowed
      .map((cid) => classById.get(cid))
      .filter(Boolean)
      .map((c) => formatClassLabel(c!.grade, c!.section));
    if (labels.length > 0) className = labels.join(", ");
  }

  const teacherName = teacherShortLabel(
    exam.teacherId ? teacherById.get(exam.teacherId) : undefined,
  );

  const { date, time: startTime } = splitDateAndTime(exam.date);
  const dm = parseDurationMinutes(exam.duration);
  const endTime = addMinutesToClock(startTime, dm);

  const distinctResultStudents = new Set(results.map((r) => r.studentId)).size;
  const studentCount = Math.max(rosterStudentCount, distinctResultStudents);
  const submittedCount = results.filter(
    (r) =>
      r.actualScore != null ||
      r.totalScore != null ||
      (r.status && !/pending/i.test(r.status)),
  ).length;
  const notStartedCount = Math.max(0, studentCount - submittedCount);

  const uiStatus = deriveExamStatus(exam) as ExamStatus;

  const notes: ExamDetail["notes"] = [];
  if (!(exam.location ?? "").trim()) {
    notes.push({
      id: "n-loc",
      type: "warning",
      text: "Байршил оноогдоогүй байна.",
    });
  }
  if ((exam.notes ?? "").trim()) {
    notes.push({
      id: "n-db",
      type: "info",
      text: exam.notes!.trim(),
    });
  }

  return {
    id: exam.id,
    title: exam.title?.trim() || "Шалгалт",
    subject: subjectName,
    status: uiStatus,
    className,
    teacherName,
    date: date || "—",
    startTime,
    endTime,
    durationMinutes: dm,
    room: (exam.location ?? "").trim() || "—",
    examType: "Холимог",
    totalScore: exam.score ?? questionCount * 5,
    studentCount,
    submittedCount,
    notStartedCount,
    questionCount,
    multipleChoiceCount: testIds.length,
    essayCount: openExerciseIds.length,
    autoGradedCount: testIds.length,
    manualReviewCount: openExerciseIds.length,
    autoGradingStatus:
      testIds.length > 0 ? "Тест — автомат" : "Тест алга",
    manualGradingStatus:
      openExerciseIds.length > 0 ? "Нээлттэй — багш" : "Нээлттэй алга",
    finalResultStatus: uiStatus === "completed" ? "Нийтлэсэн" : "Хүлээгдэж буй",
    notes,
  };
}
