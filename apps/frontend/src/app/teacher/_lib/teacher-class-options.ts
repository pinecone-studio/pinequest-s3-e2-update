/** @format */

export type TeacherClassOption = {
  id: string;
  name: string;
  grade: string;
  studentCount: number;
  routeId: string;
};

export function mapGqlTeacherClasses(
  rows: Array<{ id: string; grade: number; section: string }>,
): TeacherClassOption[] {
  return rows.map((r) => ({
    id: r.id,
    name: `${r.grade}${r.section}`,
    grade: `${r.grade}-р анги`,
    studentCount: 0,
    routeId: r.id,
  }));
}
