/** @format */

import {
  deriveExamStatus,
  type BackendExamRow,
  type ClassRowLite,
} from "@/app/school/exams/_lib/school-exam-map";
import type { TeacherExamSchedule } from "../_types/exam-schedule";

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

function formatClassLabel(grade: number, section: string) {
  return `${grade}${section.trim().toUpperCase()}`;
}

export function examsForTeacherToSchedules(
  exams: BackendExamRow[],
  teacherId: string,
  subjectNameById: Map<string, string>,
  classById: Map<string, ClassRowLite>,
): TeacherExamSchedule[] {
  return exams
    .filter((e) => e.teacherId === teacherId)
    .map((exam) => {
      const subject =
        subjectNameById.get(exam.subjectId) ?? exam.subjectId ?? "Хичээл";
      const allowed = exam.allowedClassIds ?? [];
      let className = `${exam.grade}`;
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
      const st = deriveExamStatus(exam);
      const status: TeacherExamSchedule["status"] =
        st === "completed" ? "completed" : "scheduled";

      return {
        id: exam.id,
        teacherId,
        subject,
        className,
        examDate: date || "—",
        startTime: time,
        endTime,
        duration: `${dm} мин`,
        status,
        notes: exam.notes ?? "",
      };
    })
    .sort((a, b) => b.examDate.localeCompare(a.examDate));
}
