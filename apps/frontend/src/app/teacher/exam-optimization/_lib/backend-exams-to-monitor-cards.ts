import type { MonitorExamCardItem } from "./monitoring";

/** GraphQL `Exam` row shape from `getExamBySchoolId` (subset). */
export type BackendExamMonitorRow = {
  id: string;
  grade: number;
  subjectId: string;
  topic: string | null;
  title: string | null;
  duration: string | null;
  testIds: string[] | null;
  openExerciseIds: string[] | null;
  score: number | null;
  needpermission: number | null;
  isActive: number | null;
  createdAt: string;
};

function parseDurationMinutes(duration: string | null | undefined): number {
  if (!duration) return 40;
  const n = Number.parseInt(String(duration), 10);
  return Number.isFinite(n) && n > 0 ? n : 40;
}

function gradeLabel(grade: number): string {
  if (grade >= 1 && grade <= 12) return `${grade}-р анги`;
  return "";
}

export function formatMonitorSavedAt(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${month}/${day} өдөр, ${hour}:${minute} цаг`;
}

/**
 * D1-д анги хавсаргаагүй үед ч хяналтын UI (Эхлүүлэх) ажиллахаар
 * teacher демо ангийн жагсаалтаас classOptions өгнө.
 */
export function mapBackendExamsToMonitorCards(
  rows: BackendExamMonitorRow[],
  subjectNameById: Map<string, string>,
  demoClassOptions: Array<{ id: string; label: string }>,
): MonitorExamCardItem[] {
  const sorted = [...rows].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  let assignedOngoing = false;

  return sorted.map((row) => {
    const testIds = Array.isArray(row.testIds) ? row.testIds : [];
    const openIds = Array.isArray(row.openExerciseIds)
      ? row.openExerciseIds
      : [];
    const questionCount = testIds.length + openIds.length;
    const subject =
      subjectNameById.get(row.subjectId) ?? row.subjectId ?? "";
    const needPerm = Boolean(row.needpermission);

    let status: MonitorExamCardItem["status"];
    if (needPerm) {
      status = "approval_pending";
    } else if (questionCount === 0) {
      status = "draft";
    } else if (!assignedOngoing && (row.isActive ?? 0) === 1) {
      status = "ongoing";
      assignedOngoing = true;
    } else {
      status = "completed";
    }

    const classOptions = demoClassOptions;
    const classLabels = classOptions.map((c) => c.label);
    const classLabel =
      classLabels.length === 0
        ? "Анги оноогоогүй"
        : classLabels.length > 1
          ? "олон"
          : (classLabels[0] ?? "Анги оноогоогүй");

    return {
      id: row.id,
      title: row.title?.trim() || "Шалгалт",
      grade: gradeLabel(row.grade),
      subject,
      topic: row.topic?.trim() || "",
      status,
      durationInMinutes: parseDurationMinutes(row.duration),
      questionCount,
      totalPoints: row.score ?? 0,
      classLabel,
      classLabels,
      classOptions,
      savedAtLabel: formatMonitorSavedAt(row.createdAt),
    };
  });
}
