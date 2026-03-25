export type TeacherExamSchedule = {
  id: string;
  teacherId: string;
  subject: string;
  examDate: string;
  startTime: string;
};

let teacherExamSchedules: TeacherExamSchedule[] = [
  {
    id: "exam-user-teacher-1-1",
    teacherId: "user-teacher-1",
    subject: "Алгебр",
    examDate: "2026-04-03",
    startTime: "09:00",
  },
  {
    id: "exam-user-teacher-2-1",
    teacherId: "user-teacher-2",
    subject: "Монголын түүх",
    examDate: "2026-04-05",
    startTime: "11:30",
  },
];

function normalizeDate(value: string) {
  return value.trim();
}

function normalizeTime(value: string) {
  return value.trim().slice(0, 5);
}

export const teacherExamScheduleStore = {
  listByTeacher(teacherId: string): TeacherExamSchedule[] {
    return teacherExamSchedules
      .filter((item) => item.teacherId === teacherId)
      .sort((a, b) => {
        const left = `${a.examDate}T${a.startTime}`;
        const right = `${b.examDate}T${b.startTime}`;
        return left.localeCompare(right);
      })
      .map((item) => ({ ...item }));
  },

  create(input: Omit<TeacherExamSchedule, "id">) {
    const subject = input.subject.trim();
    const examDate = normalizeDate(input.examDate);
    const startTime = normalizeTime(input.startTime);
    if (!input.teacherId || !subject || !examDate || !startTime) return null;

    const item: TeacherExamSchedule = {
      id: `exam-${crypto.randomUUID().slice(0, 8)}`,
      teacherId: input.teacherId,
      subject,
      examDate,
      startTime,
    };
    teacherExamSchedules.push(item);
    return item.id;
  },

  remove(id: string) {
    const exists = teacherExamSchedules.some((item) => item.id === id);
    if (!exists) return false;
    teacherExamSchedules = teacherExamSchedules.filter((item) => item.id !== id);
    return true;
  },
};
