import { TEACHER_DEMO_CLASS_ID } from "@/app/lib/teacher-demo-class";

export type TeacherClass = {
  id: string;
  name: string;
  grade: string;
  studentCount: number;
  routeId?: string;
};

export const teacherClasses: TeacherClass[] = [
  { id: "c-6a", name: "6A", grade: "6-р анги", studentCount: 31 },
  { id: "c-6b", name: "6B", grade: "6-р анги", studentCount: 28 },
  { id: "c-7a", name: "7A", grade: "7-р анги", studentCount: 30 },
  { id: "c-7b", name: "7B", grade: "7-р анги", studentCount: 29 },
  { id: "c-8a", name: "8A", grade: "8-р анги", studentCount: 33 },
  { id: "c-8b", name: "8B", grade: "8-р анги", studentCount: 31 },
  { id: "c-9a", name: "9A", grade: "9-р анги", studentCount: 32 },
  { id: "c-9b", name: "9B", grade: "9-р анги", studentCount: 30, routeId: "class-mock-9b" },
  { id: "c-10a", name: "10A", grade: "10-р анги", studentCount: 34, routeId: TEACHER_DEMO_CLASS_ID },
  { id: "c-10b", name: "10B", grade: "10-р анги", studentCount: 33 },
  { id: "c-11a", name: "11A", grade: "11-р анги", studentCount: 30, routeId: "class-mock-11a" },
  { id: "c-11b", name: "11B", grade: "11-р анги", studentCount: 29 },
  { id: "c-12a", name: "12A", grade: "12-р анги", studentCount: 28 },
  { id: "c-12b", name: "12B", grade: "12-р анги", studentCount: 27 },
];
