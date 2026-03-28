import type {
  ExamScheduleStatus,
  TeacherExamSchedule,
  TeacherExamScheduleFormValues,
  TeacherExamScheduleInput,
} from "../_types/exam-schedule";

export const scheduleStatuses: ExamScheduleStatus[] = [
  "scheduled",
  "completed",
  "cancelled",
];

export const statusLabels: Record<ExamScheduleStatus, string> = {
  scheduled: "Товлогдсон",
  completed: "Дууссан",
  cancelled: "Цуцлагдсан",
};

export const statusBadgeClassNames: Record<ExamScheduleStatus, string> = {
  scheduled: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

export function getEmptyScheduleValues(
  teacherId: string,
  className = "",
): TeacherExamScheduleFormValues {
  return {
    teacherId,
    subject: "",
    className,
    examDate: "",
    startTime: "",
    endTime: "",
    status: "scheduled",
    notes: "",
  };
}

export function calculateDuration(startTime: string, endTime: string) {
  const minutes = toMinutes(endTime) - toMinutes(startTime);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours && rest) return `${hours} цаг ${rest} мин`;
  if (hours) return `${hours} цаг`;
  return `${rest} мин`;
}

export function formatExamDate(date: string) {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${year}.${month}.${day}`;
}

export function validateSchedule(
  input: TeacherExamScheduleInput,
  schedules: TeacherExamSchedule[],
  editingId?: string,
) {
  const values = normalizeValues(input);
  if (
    !values.teacherId ||
    !values.subject ||
    !values.className ||
    !values.examDate ||
    !values.startTime ||
    !values.endTime
  ) {
    return "Шаардлагатай бүх талбарыг бөглөнө үү.";
  }

  if (toDate(values.examDate) < startOfToday()) {
    return "Шалгалтын өдөр өнгөрсөн огноо байж болохгүй.";
  }

  if (toMinutes(values.endTime) <= toMinutes(values.startTime)) {
    return "Дуусах цаг эхлэх цагаас хойш байх ёстой.";
  }

  const collisions = schedules.filter((item) => {
    if (item.id === editingId || item.examDate !== values.examDate) return false;
    return hasTimeOverlap(
      values.startTime,
      values.endTime,
      item.startTime,
      item.endTime,
    );
  });

  if (collisions.some((item) => item.teacherId === values.teacherId)) {
    return "Энэ багш давхцсан шалгалтын цагтай байна.";
  }

  if (
    collisions.some(
      (item) =>
        item.className.trim().toLowerCase() === values.className.toLowerCase(),
    )
  ) {
    return "Энэ анги дээр тухайн цагт өөр шалгалт товлогдсон байна.";
  }

  return null;
}

function normalizeValues(input: TeacherExamScheduleInput) {
  return {
    ...input,
    subject: input.subject.trim(),
    className: input.className.trim(),
    examDate: input.examDate.trim(),
    startTime: input.startTime.trim().slice(0, 5),
    endTime: input.endTime.trim().slice(0, 5),
    notes: input.notes?.trim() ?? "",
  };
}

function hasTimeOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
) {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(endA) > toMinutes(startB);
}

function toMinutes(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function toDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

function startOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}
