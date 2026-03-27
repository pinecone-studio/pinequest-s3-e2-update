export type TeacherClass = {
  id: string;
  name: string;
  grade: string;
  studentCount: number;
};

export const teacherClasses: TeacherClass[] = [
  { id: "c-6a", name: "6A", grade: "6-р анги", studentCount: 31 },
  { id: "c-7b", name: "7B", grade: "7-р анги", studentCount: 29 },
  { id: "c-8a", name: "8A", grade: "8-р анги", studentCount: 33 },
  { id: "c-9c", name: "9C", grade: "9-р анги", studentCount: 30 },
  { id: "c-10a", name: "10A", grade: "10-р анги", studentCount: 12 },
  { id: "c-11a", name: "11A", grade: "11-р анги", studentCount: 26 },
  { id: "c-12a", name: "12A", grade: "12-р анги", studentCount: 24 },
];
