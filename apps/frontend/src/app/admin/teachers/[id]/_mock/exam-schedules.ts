import { calculateDuration } from "../_utils/exam-schedule";
import type {
  TeacherExamSchedule,
  TeacherExamScheduleInput,
} from "../_types/exam-schedule";

let examSchedules: TeacherExamSchedule[] = [
  {
    id: "exam-1",
    teacherId: "user-teacher-1",
    subject: "Алгебр",
    className: "12a",
    examDate: "2026-04-03",
    startTime: "09:00",
    endTime: "10:20",
    duration: "1 цаг 20 мин",
    status: "scheduled",
    notes: "2-р давхрын 204 тоотод авна.",
  },
  {
    id: "exam-2",
    teacherId: "user-teacher-2",
    subject: "Монголын түүх",
    className: "12b",
    examDate: "2026-04-05",
    startTime: "11:30",
    endTime: "12:30",
    duration: "1 цаг",
    status: "scheduled",
  },
];

function toSchedule(id: string, input: TeacherExamScheduleInput): TeacherExamSchedule {
  return {
    id,
    teacherId: input.teacherId,
    subject: input.subject.trim(),
    className: input.className.trim(),
    examDate: input.examDate.trim(),
    startTime: input.startTime.trim().slice(0, 5),
    endTime: input.endTime.trim().slice(0, 5),
    duration: calculateDuration(input.startTime, input.endTime),
    status: input.status,
    notes: input.notes?.trim() || undefined,
  };
}

export const examSchedulesMock = {
  listAll() {
    return examSchedules.map((item) => ({ ...item }));
  },

  listByTeacher(teacherId: string) {
    return examSchedules
      .filter((item) => item.teacherId === teacherId)
      .sort((a, b) =>
        `${a.examDate}-${a.startTime}`.localeCompare(`${b.examDate}-${b.startTime}`),
      )
      .map((item) => ({ ...item }));
  },

  create(input: TeacherExamScheduleInput) {
    const schedule = toSchedule(`exam-${crypto.randomUUID().slice(0, 8)}`, input);
    examSchedules.push(schedule);
    return { ...schedule };
  },

  update(id: string, input: TeacherExamScheduleInput) {
    const index = examSchedules.findIndex((item) => item.id === id);
    if (index === -1) return null;
    examSchedules[index] = toSchedule(id, input);
    return { ...examSchedules[index] };
  },

  remove(id: string) {
    const exists = examSchedules.some((item) => item.id === id);
    if (!exists) return false;
    examSchedules = examSchedules.filter((item) => item.id !== id);
    return true;
  },
};
