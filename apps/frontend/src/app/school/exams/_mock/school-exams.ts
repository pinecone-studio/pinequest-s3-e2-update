import type { ExamAlert, ExamStatus, SchoolExam } from "../_types/exam";

export const examStatusMeta: Record<
  ExamStatus,
  {
    label: string;
    badgeClassName: string;
    cardTintClassName: string;
  }
> = {
  draft: {
    label: "Ноорог",
    badgeClassName: "border border-zinc-200 bg-zinc-100 text-zinc-700",
    cardTintClassName: "from-zinc-50 to-white",
  },
  scheduled: {
    label: "Товлогдсон",
    badgeClassName: "border border-blue-200 bg-blue-100 text-blue-700",
    cardTintClassName: "from-blue-50 to-white",
  },
  ongoing: {
    label: "Явагдаж буй",
    badgeClassName: "border border-emerald-200 bg-emerald-100 text-emerald-700",
    cardTintClassName: "from-emerald-50 to-white",
  },
  grading: {
    label: "Шалгаж буй",
    badgeClassName: "border border-amber-200 bg-amber-100 text-amber-700",
    cardTintClassName: "from-amber-50 to-white",
  },
  completed: {
    label: "Дууссан",
    badgeClassName: "border border-violet-200 bg-violet-100 text-violet-700",
    cardTintClassName: "from-violet-50 to-white",
  },
};

export const schoolExams: SchoolExam[] = [
  {
    id: "exam-201",
    title: "Алгебр II улирлын сорил",
    subject: "Математик",
    className: "10А",
    teacherName: "Б.Эрдэнэ",
    startAt: "2026-03-29 09:00",
    endAt: "2026-03-29 09:45",
    status: "scheduled",
    studentCount: 41,
    submittedCount: 0,
    risk: "Англи хэлний шалгалттай 15 мин ойр төлөвлөгдсөн",
  },
  {
    id: "exam-202",
    title: "Эх бичиг ба найруулга",
    subject: "Монгол хэл",
    className: "9Б",
    teacherName: "О.Наранзул",
    startAt: "2026-03-28 11:00",
    endAt: "2026-03-28 11:35",
    status: "ongoing",
    studentCount: 41,
    submittedCount: 26,
    risk: "5 сурагч нэвтрээгүй хэвээр байна",
  },
  {
    id: "exam-203",
    title: "Хүч ба хөдөлгөөн",
    subject: "Физик",
    className: "11Б",
    teacherName: "С.Тэмүүлэн",
    startAt: "2026-03-28 08:30",
    endAt: "2026-03-28 09:20",
    status: "grading",
    studentCount: 35,
    submittedCount: 35,
    risk: "Эсээ хэсэгт гараар шалгалт хүлээгдэж байна",
  },
  {
    id: "exam-204",
    title: "Дэлхийн түүхийн нэгж шалгалт",
    subject: "Түүх",
    className: "12А",
    teacherName: "М.Батчимэг",
    startAt: "2026-03-27 13:00",
    endAt: "2026-03-27 13:45",
    status: "completed",
    studentCount: 32,
    submittedCount: 32,
    risk: "Эрсдэлгүй",
  },
  {
    id: "exam-205",
    title: "Геометрийн төсөлт үнэлгээ",
    subject: "Математик",
    className: "10В",
    teacherName: "Д.Эрдэнэсайхан",
    startAt: "2026-03-31 10:00",
    endAt: "2026-03-31 10:50",
    status: "draft",
    studentCount: 36,
    submittedCount: 0,
    risk: "Өрөө оноогдоогүй",
  },
  {
    id: "exam-206",
    title: "Reading Comprehension Benchmark",
    subject: "Англи хэл",
    className: "11А",
    teacherName: "Ц.Саруул",
    startAt: "2026-03-29 09:20",
    endAt: "2026-03-29 10:00",
    status: "scheduled",
    studentCount: 39,
    submittedCount: 0,
    risk: "10А ангитай компьютерийн лаборатори давхцах магадлалтай",
  },
  {
    id: "exam-207",
    title: "Химийн урвалын сорил",
    subject: "Хими",
    className: "10Б",
    teacherName: "Г.Отгонтуяа",
    startAt: "2026-03-28 14:00",
    endAt: "2026-03-28 14:40",
    status: "ongoing",
    studentCount: 34,
    submittedCount: 18,
    risk: "Интернет тасалдсан 1 өрөө хяналтад байна",
  },
];

export const examAlerts: ExamAlert[] = [
  {
    id: "alert-1",
    type: "warning",
    title: "Шалгалтын цаг давхцах магадлал",
    description:
      "10А Математик болон 11А Англи хэлний шалгалтууд нэг лабораторийн нөөц дээр давхар төлөвлөгдсөн байна.",
  },
  {
    id: "alert-2",
    type: "warning",
    title: "Багшаар шалгагдах хүлээгдэж буй шалгалт",
    description:
      "Физик, Нийгмийн ухааны нийт 3 шалгалт багшийн гар шалгалтын дараалалд байна.",
  },
  {
    id: "alert-3",
    type: "info",
    title: "Маргааш эхлэх шалгалт",
    description:
      "Маргааш 6 шалгалт эхлэхээр товлогдсон тул өрөө, төхөөрөмжийн бэлэн байдлыг өнөөдөр баталгаажуулна уу.",
  },
  {
    id: "alert-4",
    type: "warning",
    title: "Өрөө оноогдоогүй шалгалт",
    description:
      "10В Геометрийн төсөлт үнэлгээнд өрөө болон supervising teacher хараахан оноогдоогүй байна.",
  },
];

export function getExamLifecycleSummary(exams: SchoolExam[]) {
  return (Object.keys(examStatusMeta) as ExamStatus[]).map((status) => ({
    status,
    label: examStatusMeta[status].label,
    count: exams.filter((exam) => exam.status === status).length,
  }));
}
