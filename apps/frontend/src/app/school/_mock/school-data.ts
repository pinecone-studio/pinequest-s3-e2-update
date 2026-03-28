export type ExamStage = "draft" | "scheduled" | "ongoing" | "grading" | "completed";

export type SchoolExam = {
  id: string;
  title: string;
  className: string;
  teacherName: string;
  subject: string;
  startAt: string;
  endAt: string;
  stage: ExamStage;
  studentCount: number;
  submittedCount: number;
  issues?: string[];
};

export const schoolSummary = {
  totalTeachers: 28,
  totalClasses: 34,
  activeStudents: 1264,
  examsThisWeek: 17,
  ongoingExams: 4,
  gradingPending: 6,
  conflictAlerts: 2,
};

export const pendingActions = [
  {
    id: "pa-1",
    title: "11Б ангийн шалгалтын хуваарь батлах",
    owner: "Сургалтын менежер",
    due: "Өнөөдөр 15:00",
    severity: "high",
  },
  {
    id: "pa-2",
    title: "Математикийн үнэлгээ хоцролтын сануулга илгээх",
    owner: "Академик алба",
    due: "Маргааш 10:00",
    severity: "medium",
  },
  {
    id: "pa-3",
    title: "9А ангийн багш-хичээлийн зөрчил шалгах",
    owner: "Хуваарь хариуцагч",
    due: "Маргааш 12:00",
    severity: "medium",
  },
];

export const recentActivities = [
  "Багш О.Наранзул Нийгмийн ухааны шинэ шалгалт хадгаллаа",
  "10А ангид Математикийн шалгалт 62% явцтай үргэлжилж байна",
  "8Б ангийн шалгалтын дүн бүрэн баталгаажлаа",
  "11А ангид давхцсан хуваарь илэрч AI сануулга гарлаа",
];

export const schoolExams: SchoolExam[] = [
  {
    id: "ex-101",
    title: "Алгебр I улирал",
    className: "10А",
    teacherName: "Б.Эрдэнэ",
    subject: "Математик",
    startAt: "2026-03-29 09:00",
    endAt: "2026-03-29 09:40",
    stage: "scheduled",
    studentCount: 38,
    submittedCount: 0,
    issues: ["11А ангийн Англи хэлтэй 10 мин давхцаж магадгүй"],
  },
  {
    id: "ex-102",
    title: "Монгол хэл - Эх бичиг",
    className: "9Б",
    teacherName: "О.Наранзул",
    subject: "Монгол хэл",
    startAt: "2026-03-28 11:00",
    endAt: "2026-03-28 11:35",
    stage: "ongoing",
    studentCount: 41,
    submittedCount: 26,
  },
  {
    id: "ex-103",
    title: "Физик - Хүч",
    className: "11Б",
    teacherName: "С.Тэмүүлэн",
    subject: "Физик",
    startAt: "2026-03-28 08:30",
    endAt: "2026-03-28 09:20",
    stage: "grading",
    studentCount: 35,
    submittedCount: 35,
  },
  {
    id: "ex-104",
    title: "Дэлхийн түүх",
    className: "12А",
    teacherName: "М.Батчимэг",
    subject: "Түүх",
    startAt: "2026-03-27 13:00",
    endAt: "2026-03-27 13:45",
    stage: "completed",
    studentCount: 32,
    submittedCount: 32,
  },
  {
    id: "ex-105",
    title: "Геометр - Төсөл",
    className: "10В",
    teacherName: "Д.Эрдэнэсайхан",
    subject: "Математик",
    startAt: "2026-03-31 10:00",
    endAt: "2026-03-31 10:50",
    stage: "draft",
    studentCount: 36,
    submittedCount: 0,
  },
];

export const classPerformance = [
  { className: "10А", averageScore: 74, passRate: 82, weakSubject: "Математик" },
  { className: "9Б", averageScore: 68, passRate: 71, weakSubject: "Монгол хэл" },
  { className: "11Б", averageScore: 79, passRate: 88, weakSubject: "Физик" },
  { className: "12А", averageScore: 84, passRate: 93, weakSubject: "Англи хэл" },
];

export const teacherPerformance = [
  { teacherName: "О.Наранзул", gradingDelayHours: 2, avgScore: 76, examsThisMonth: 8 },
  { teacherName: "Б.Эрдэнэ", gradingDelayHours: 11, avgScore: 71, examsThisMonth: 10 },
  { teacherName: "С.Тэмүүлэн", gradingDelayHours: 6, avgScore: 80, examsThisMonth: 6 },
];

export const aiSuggestions = [
  {
    id: "ai-1",
    title: "Хуваарийн зөрчил илрүүлэлт",
    problem: "Нэг ангид ижил өдөр давхар шалгалт таарч орох эрсдэл",
    user: "Сургуулийн админ",
    stage: "MVP",
  },
  {
    id: "ai-2",
    title: "Сул анги илрүүлэлт",
    problem: "Дундаж дүн огцом буурч буй ангиудыг эрт илрүүлэх",
    user: "Сургуулийн админ",
    stage: "MVP",
  },
  {
    id: "ai-3",
    title: "Шалгалт бүрдүүлэлтийн туслах",
    problem: "Шалгалт бүрдүүлэхэд цаг их алдах",
    user: "Багш",
    stage: "V2",
  },
  {
    id: "ai-4",
    title: "Эссэ үнэлгээний туслах",
    problem: "Урт хариулт шалгах хугацаа урт байх",
    user: "Багш",
    stage: "Future",
  },
];

export function groupExamStages(exams: SchoolExam[]) {
  return {
    draft: exams.filter((x) => x.stage === "draft"),
    scheduled: exams.filter((x) => x.stage === "scheduled"),
    ongoing: exams.filter((x) => x.stage === "ongoing"),
    grading: exams.filter((x) => x.stage === "grading"),
    completed: exams.filter((x) => x.stage === "completed"),
  };
}
