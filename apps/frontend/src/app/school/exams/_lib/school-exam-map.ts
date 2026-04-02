/** @format */

import type { ExamStatus, SchoolExam } from "../_types/exam";

export type BackendExamRow = {
  id: string;
  grade: number;
  subjectId: string;
  title: string | null;
  date: string | null;
  location: string | null;
  duration: string;
  isActive: number;
  needpermission: number;
  teacherId: string | null;
  allowedClassIds: string[];
  testIds?: string[];
  openExerciseIds?: string[];
};

export type ClassRowLite = {
  id: string;
  grade: number;
  section: string;
};

export type TeacherRowLite = {
  id: string;
  firstName: string;
  lastName: string;
};

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

export function deriveExamStatus(
  row: Pick<BackendExamRow, "date" | "isActive" | "needpermission">,
  now = new Date(),
): ExamStatus {
  if (row.needpermission === 1 && row.isActive !== 1) return "draft";
  const { date, time } = splitDateAndTime(row.date);
  if (!date) return "scheduled";
  const start = new Date(`${date}T${time}:00`);
  if (Number.isNaN(start.getTime())) return "scheduled";
  if (now < start) return "scheduled";
  if (row.isActive === 1) return "ongoing";
  return "completed";
}

function formatClassLabel(grade: number, section: string) {
  return `${grade}${section.trim().toUpperCase()}`;
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

export function mapExamsToSchoolExams(
  exams: BackendExamRow[],
  subjectNameById: Map<string, string>,
  classById: Map<string, ClassRowLite>,
  teacherById: Map<string, TeacherRowLite>,
): SchoolExam[] {
  return exams.map((exam) => {
    const subject =
      subjectNameById.get(exam.subjectId) ?? exam.subjectId ?? "Хичээл";
    const teacherName = teacherShortLabel(
      exam.teacherId ? teacherById.get(exam.teacherId) : undefined,
    );

    let className = `${exam.grade}`;
    const allowed = exam.allowedClassIds ?? [];
    if (allowed.length > 0) {
      const labels = allowed
        .map((cid) => classById.get(cid))
        .filter(Boolean)
        .map((c) => formatClassLabel(c!.grade, c!.section));
      if (labels.length > 0) className = labels.join(", ");
    }

    const { date, time } = splitDateAndTime(exam.date);
    const dm = parseDurationMinutes(exam.duration);
    const endTime = addMinutesToClock(time, dm);
    const startAt = date ? `${date} ${time}` : "";
    const endAt = date ? `${date} ${endTime}` : "";

    const status = deriveExamStatus(exam);
    const studentCount = 0;
    const submittedCount = 0;

    let risk = "Эрсдэлгүй";
    if ((exam.location ?? "").trim().length === 0) risk = "Байршил оноогдоогүй";
    else if (exam.needpermission === 1) risk = "Зөвшөөрөл шаардлагатай";

    return {
      id: exam.id,
      title: exam.title?.trim() || "Шалгалт",
      subject,
      className,
      teacherName,
      startAt,
      endAt,
      status,
      studentCount,
      submittedCount,
      risk,
    };
  });
}

/** Самбарын хуурай mock-той ижил `stage` талбар (дууссан/товлогдсон тоолох). */
export type DashboardExamStageRow = {
  stage: "completed" | "scheduled" | "ongoing" | "grading" | "draft";
  startAt: string;
  studentCount: number;
  submittedCount: number;
};

export type DashboardSchoolExam = SchoolExam & DashboardExamStageRow;

export function mapExamsToDashboardRows(
  exams: BackendExamRow[],
  subjectNameById: Map<string, string>,
  classById: Map<string, ClassRowLite>,
  teacherById: Map<string, TeacherRowLite>,
): DashboardSchoolExam[] {
  const base = mapExamsToSchoolExams(
    exams,
    subjectNameById,
    classById,
    teacherById,
  );
  return base.map((e, i) => {
    const status = e.status;
    const stage =
      status === "completed"
        ? ("completed" as const)
        : status === "grading"
          ? ("grading" as const)
          : status === "ongoing"
            ? ("ongoing" as const)
            : status === "draft"
              ? ("draft" as const)
              : ("scheduled" as const);
    const startAt =
      e.startAt ||
      (exams[i]?.date ? exams[i]!.date!.slice(0, 16).replace("T", " ") : "");
    return {
      ...e,
      startAt,
      stage,
    };
  });
}
