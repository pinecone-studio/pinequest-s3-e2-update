import type { School, SchoolClass, Student, User } from "./types";
import {
  TEACHER_DEMO_CLASS_ID,
  TEACHER_DEMO_CLASS_IDS,
} from "./teacher-demo-class";

const SCHOOL_ID = "school-1";

let school: School = {
  id: SCHOOL_ID,
  name: "Дэлгэр мөрөн сургууль",
  address: "Улаанбаатар хот, Сүхбаатар дүүрэг, Жишээ гудамж 15",
  phone: "+976 11 321456",
};

let users: User[] = [
  {
    id: "user-admin",
    email: "zahiragch@demo.mn",
    name: "Батбаяр Эрдэнэ",
    role: "school_admin",
  },
  {
    id: "user-teacher-1",
    email: "saraa@demo.mn",
    name: "Наранцэцэг Содном",
    role: "teacher",
    specialty: "Математик",
  },
  {
    id: "user-teacher-2",
    email: "enkhbat@demo.mn",
    name: "Энхбат Дорж",
    role: "teacher",
    specialty: "Нийгэм, түүх",
  },
  {
    id: "user-teacher-3",
    email: "oyuntsetseg@demo.mn",
    name: "Оюунцэцэг Болд",
    role: "teacher",
    specialty: "Англи хэл",
  },
];

let classes: SchoolClass[] = [
  {
    id: "class-1",
    name: "12a",
    teacherIds: ["user-teacher-1", "user-teacher-2"],
    studentIds: ["stu-1", "stu-2", "stu-3"],
  },
  {
    id: "class-2",
    name: "12b",
    teacherIds: ["user-teacher-2"],
    studentIds: ["stu-4", "stu-5"],
  },
  {
    id: "class-3",
    name: "12c",
    teacherIds: ["user-teacher-3"],
    studentIds: ["stu-6"],
  },
  {
    id: "class-4",
    name: "12d",
    teacherIds: ["user-teacher-1", "user-teacher-3"],
    studentIds: ["stu-7", "stu-8"],
  },
  {
    id: "class-mock-9b",
    name: "9Б",
    teacherIds: ["user-teacher-1", "user-teacher-2", "user-teacher-3"],
    studentIds: [
      "stu-mock-9b-1",
      "stu-mock-9b-2",
      "stu-mock-9b-3",
      "stu-mock-9b-4",
      "stu-mock-9b-5",
      "stu-mock-9b-6",
      "stu-mock-9b-7",
      "stu-mock-9b-8",
      "stu-mock-9b-9",
      "stu-mock-9b-10",
      "stu-mock-9b-11",
      "stu-mock-9b-12",
    ],
  },
  {
    id: TEACHER_DEMO_CLASS_ID,
    name: "10А",
    teacherIds: ["user-teacher-1", "user-teacher-2", "user-teacher-3"],
    studentIds: [
      "stu-mock-10a-1",
      "stu-mock-10a-2",
      "stu-mock-10a-3",
      "stu-mock-10a-4",
      "stu-mock-10a-5",
      "stu-mock-10a-6",
      "stu-mock-10a-7",
      "stu-mock-10a-8",
      "stu-mock-10a-9",
      "stu-mock-10a-10",
      "stu-mock-10a-11",
      "stu-mock-10a-12",
    ],
  },
  {
    id: "class-mock-11a",
    name: "11А",
    teacherIds: ["user-teacher-1", "user-teacher-2", "user-teacher-3"],
    studentIds: [
      "stu-mock-11a-1",
      "stu-mock-11a-2",
      "stu-mock-11a-3",
      "stu-mock-11a-4",
      "stu-mock-11a-5",
      "stu-mock-11a-6",
      "stu-mock-11a-7",
      "stu-mock-11a-8",
      "stu-mock-11a-9",
      "stu-mock-11a-10",
      "stu-mock-11a-11",
      "stu-mock-11a-12",
    ],
  },
];

let students: Student[] = [
  {
    id: "stu-1",
    studentNumber: "СУ-1001",
    firstName: "Төмөр",
    lastName: "Батбаяр",
    classId: "class-1",
  },
  {
    id: "stu-2",
    studentNumber: "СУ-1002",
    firstName: "Мөнхзул",
    lastName: "Ганбат",
    classId: "class-1",
  },
  {
    id: "stu-3",
    studentNumber: "СУ-1003",
    firstName: "Анужин",
    lastName: "Эрдэнэ",
    classId: "class-1",
  },
  {
    id: "stu-4",
    studentNumber: "СУ-1004",
    firstName: "Номин",
    lastName: "Чулуунбат",
    classId: "class-2",
  },
  {
    id: "stu-5",
    studentNumber: "СУ-1005",
    firstName: "Амарсанаа",
    lastName: "Болд",
    classId: "class-2",
  },
  {
    id: "stu-6",
    studentNumber: "СУ-1006",
    firstName: "Сараа",
    lastName: "Мөнхбат",
    classId: "class-3",
  },
  {
    id: "stu-7",
    studentNumber: "СУ-1007",
    firstName: "Баттулга",
    lastName: "Ганбаатар",
    classId: "class-4",
  },
  {
    id: "stu-8",
    studentNumber: "СУ-1008",
    firstName: "Энхжин",
    lastName: "Сүхбаатар",
    classId: "class-4",
  },
  {
    id: "stu-mock-9b-1",
    studentNumber: "9B-001",
    firstName: "Тэмүүлэн",
    lastName: "Батболд",
    classId: "class-mock-9b",
  },
  {
    id: "stu-mock-9b-2",
    studentNumber: "9B-002",
    firstName: "Ануужин",
    lastName: "Ганзориг",
    classId: "class-mock-9b",
  },
  {
    id: "stu-mock-9b-3",
    studentNumber: "9B-003",
    firstName: "Энх-Амгалан",
    lastName: "Чинбат",
    classId: "class-mock-9b",
  },
  {
    id: "stu-mock-9b-4",
    studentNumber: "9B-004",
    firstName: "Мишээл",
    lastName: "Доржсүрэн",
    classId: "class-mock-9b",
  },
  {
    id: "stu-mock-9b-5",
    studentNumber: "9B-005",
    firstName: "Золбаяр",
    lastName: "Төмөрсүх",
    classId: "class-mock-9b",
  },
  {
    id: "stu-mock-9b-6",
    studentNumber: "9B-006",
    firstName: "Уянга",
    lastName: "Бат-Эрдэнэ",
    classId: "class-mock-9b",
  },
  {
    id: "stu-mock-9b-7",
    studentNumber: "9B-007",
    firstName: "Ринчино",
    lastName: "Дамдин",
    classId: "class-mock-9b",
  },
  {
    id: "stu-mock-9b-8",
    studentNumber: "9B-008",
    firstName: "Түмэннаст",
    lastName: "Ганбаатар",
    classId: "class-mock-9b",
  },
  {
    id: "stu-mock-9b-9",
    studentNumber: "9B-009",
    firstName: "Алтаншагай",
    lastName: "Мөнх-Очир",
    classId: "class-mock-9b",
  },
  {
    id: "stu-mock-9b-10",
    studentNumber: "9B-010",
    firstName: "Энэрэл",
    lastName: "Баттулга",
    classId: "class-mock-9b",
  },
  {
    id: "stu-mock-9b-11",
    studentNumber: "9B-011",
    firstName: "Бямбацогт",
    lastName: "Норовсүрэн",
    classId: "class-mock-9b",
  },
  {
    id: "stu-mock-9b-12",
    studentNumber: "9B-012",
    firstName: "Дөлгөөн",
    lastName: "Алтангэрэл",
    classId: "class-mock-9b",
  },
  {
    id: "stu-mock-10a-1",
    studentNumber: "10A-001",
    firstName: "Батбаяр",
    lastName: "Доржсүрэн",
    classId: TEACHER_DEMO_CLASS_ID,
  },
  {
    id: "stu-mock-10a-2",
    studentNumber: "10A-002",
    firstName: "Сарнай",
    lastName: "Батмөнх",
    classId: TEACHER_DEMO_CLASS_ID,
  },
  {
    id: "stu-mock-10a-3",
    studentNumber: "10A-003",
    firstName: "Ганболд",
    lastName: "Эрдэнэ",
    classId: TEACHER_DEMO_CLASS_ID,
  },
  {
    id: "stu-mock-10a-4",
    studentNumber: "10A-004",
    firstName: "Нандин",
    lastName: "Эрдэнэ",
    classId: TEACHER_DEMO_CLASS_ID,
  },
  {
    id: "stu-mock-10a-5",
    studentNumber: "10A-005",
    firstName: "Эрдэнэбат",
    lastName: "Болд",
    classId: TEACHER_DEMO_CLASS_ID,
  },
  {
    id: "stu-mock-10a-6",
    studentNumber: "10A-006",
    firstName: "Цогзолмаа",
    lastName: "Батзаяа",
    classId: TEACHER_DEMO_CLASS_ID,
  },
  {
    id: "stu-mock-10a-7",
    studentNumber: "10A-007",
    firstName: "Мөнхзул",
    lastName: "Ганхуяг",
    classId: TEACHER_DEMO_CLASS_ID,
  },
  {
    id: "stu-mock-10a-8",
    studentNumber: "10A-008",
    firstName: "Одбаяр",
    lastName: "Жаргалсайхан",
    classId: TEACHER_DEMO_CLASS_ID,
  },
  {
    id: "stu-mock-10a-9",
    studentNumber: "10A-009",
    firstName: "Энхмэнд",
    lastName: "Цэнд-Аюуш",
    classId: TEACHER_DEMO_CLASS_ID,
  },
  {
    id: "stu-mock-10a-10",
    studentNumber: "10A-010",
    firstName: "Номин-Эрдэнэ",
    lastName: "Бадамхатан",
    classId: TEACHER_DEMO_CLASS_ID,
  },
  {
    id: "stu-mock-10a-11",
    studentNumber: "10A-011",
    firstName: "Хонгорзул",
    lastName: "Дашцэрэн",
    classId: TEACHER_DEMO_CLASS_ID,
  },
  {
    id: "stu-mock-10a-12",
    studentNumber: "10A-012",
    firstName: "Тэргэл",
    lastName: "Батнасан",
    classId: TEACHER_DEMO_CLASS_ID,
  },
  {
    id: "stu-mock-11a-1",
    studentNumber: "11A-001",
    firstName: "Ариунболд",
    lastName: "Нарангэрэл",
    classId: "class-mock-11a",
  },
  {
    id: "stu-mock-11a-2",
    studentNumber: "11A-002",
    firstName: "Оюунэрдэнэ",
    lastName: "Сүхбаатар",
    classId: "class-mock-11a",
  },
  {
    id: "stu-mock-11a-3",
    studentNumber: "11A-003",
    firstName: "Билэгт",
    lastName: "Энхтайван",
    classId: "class-mock-11a",
  },
  {
    id: "stu-mock-11a-4",
    studentNumber: "11A-004",
    firstName: "Энхцэцэг",
    lastName: "Мөнхбат",
    classId: "class-mock-11a",
  },
  {
    id: "stu-mock-11a-5",
    studentNumber: "11A-005",
    firstName: "Ганзориг",
    lastName: "Батсуурь",
    classId: "class-mock-11a",
  },
  {
    id: "stu-mock-11a-6",
    studentNumber: "11A-006",
    firstName: "Саруул",
    lastName: "Чулуунбат",
    classId: "class-mock-11a",
  },
  {
    id: "stu-mock-11a-7",
    studentNumber: "11A-007",
    firstName: "Мишээл",
    lastName: "Доржоо",
    classId: "class-mock-11a",
  },
  {
    id: "stu-mock-11a-8",
    studentNumber: "11A-008",
    firstName: "Төгөлдөр",
    lastName: "Энхбат",
    classId: "class-mock-11a",
  },
  {
    id: "stu-mock-11a-9",
    studentNumber: "11A-009",
    firstName: "Чинзориг",
    lastName: "Лувсан",
    classId: "class-mock-11a",
  },
  {
    id: "stu-mock-11a-10",
    studentNumber: "11A-010",
    firstName: "Азжаргал",
    lastName: "Галбадрах",
    classId: "class-mock-11a",
  },
  {
    id: "stu-mock-11a-11",
    studentNumber: "11A-011",
    firstName: "Батцэцэг",
    lastName: "Дарьсүрэн",
    classId: "class-mock-11a",
  },
  {
    id: "stu-mock-11a-12",
    studentNumber: "11A-012",
    firstName: "Намуун",
    lastName: "Шаравням",
    classId: "class-mock-11a",
  },
];

function slugEmail(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "");
  if (base.length >= 2) return `${base}@demo.mn`;
  return `bagsh.${crypto.randomUUID().slice(0, 8)}@demo.mn`;
}

export const store = {
  getSchool(): School {
    return { ...school };
  },

  updateSchool(input: Partial<Pick<School, "name" | "address" | "phone">>) {
    school = { ...school, ...input };
  },

  listUsers(): User[] {
    return users.map((u) => ({ ...u }));
  },

  listTeachers(): User[] {
    return users.filter((u) => u.role === "teacher").map((u) => ({ ...u }));
  },

  getUser(id: string): User | undefined {
    const u = users.find((x) => x.id === id);
    return u ? { ...u } : undefined;
  },

  getUserByEmail(email: string): User | undefined {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return undefined;
    const u = users.find((x) => x.email.toLowerCase() === normalized);
    return u ? { ...u } : undefined;
  },

  createTeacher(name: string, email?: string, specialty?: string) {
    const id = `user-teacher-${crypto.randomUUID().slice(0, 8)}`;
    const e = email?.trim() || slugEmail(name);
    const spec = specialty?.trim();
    users.push({
      id,
      email: e,
      name: name.trim(),
      role: "teacher",
      ...(spec ? { specialty: spec } : {}),
    });
    return id;
  },

  updateTeacher(id: string, name: string, email: string, specialty: string) {
    const i = users.findIndex((u) => u.id === id && u.role === "teacher");
    if (i === -1) return false;
    const spec = specialty.trim();
    const next: User = {
      ...users[i],
      name: name.trim(),
      email: email.trim(),
    };
    if (spec) next.specialty = spec;
    else delete next.specialty;
    users[i] = next;
    return true;
  },

  deleteTeacher(id: string) {
    const u = users.find((x) => x.id === id);
    if (!u || u.role !== "teacher") return false;
    users = users.filter((x) => x.id !== id);
    classes = classes.map((c) => ({
      ...c,
      teacherIds: c.teacherIds.filter((tid) => tid !== id),
    }));
    return true;
  },

  listClasses(): SchoolClass[] {
    return classes.map((c) => ({
      ...c,
      teacherIds: [...c.teacherIds],
      studentIds: [...c.studentIds],
    }));
  },

  getClass(id: string): SchoolClass | undefined {
    const c = classes.find((x) => x.id === id);
    if (!c) return undefined;
    return {
      ...c,
      teacherIds: [...c.teacherIds],
      studentIds: [...c.studentIds],
    };
  },

  createClass(name: string) {
    const id = `class-${crypto.randomUUID().slice(0, 8)}`;
    classes.push({ id, name: name.trim(), teacherIds: [], studentIds: [] });
    return id;
  },

  updateClassName(id: string, name: string) {
    const c = classes.find((x) => x.id === id);
    if (!c) return false;
    c.name = name.trim();
    return true;
  },

  deleteClass(id: string) {
    const exists = classes.some((c) => c.id === id);
    if (!exists) return false;
    students = students.filter((s) => s.classId !== id);
    classes = classes.filter((c) => c.id !== id);
    return true;
  },

  setClassTeachers(classId: string, teacherIds: string[]) {
    const c = classes.find((x) => x.id === classId);
    if (!c) return false;
    const valid = new Set(
      users.filter((u) => u.role === "teacher").map((u) => u.id),
    );
    c.teacherIds = teacherIds.filter((id) => valid.has(id));
    return true;
  },

  listStudentsInClass(classId: string): Student[] {
    return students
      .filter((s) => s.classId === classId)
      .map((s) => ({ ...s }));
  },

  addStudent(
    classId: string,
    input: { studentNumber: string; firstName: string; lastName: string },
  ) {
    const c = classes.find((x) => x.id === classId);
    if (!c) return null;
    const id = `stu-${crypto.randomUUID().slice(0, 8)}`;
    const st: Student = {
      id,
      studentNumber: input.studentNumber.trim(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      classId,
    };
    students.push(st);
    c.studentIds.push(id);
    return id;
  },

  updateStudent(
    id: string,
    input: Partial<
      Pick<Student, "studentNumber" | "firstName" | "lastName" | "classId">
    >,
  ) {
    const s = students.find((x) => x.id === id);
    if (!s) return false;
    if (input.classId && input.classId !== s.classId) {
      const oldC = classes.find((c) => c.id === s.classId);
      const newC = classes.find((c) => c.id === input.classId);
      if (!oldC || !newC) return false;
      oldC.studentIds = oldC.studentIds.filter((sid) => sid !== id);
      newC.studentIds.push(id);
    }
    Object.assign(s, {
      ...input,
      studentNumber: input.studentNumber?.trim() ?? s.studentNumber,
      firstName: input.firstName?.trim() ?? s.firstName,
      lastName: input.lastName?.trim() ?? s.lastName,
      classId: input.classId ?? s.classId,
    });
    return true;
  },

  removeStudent(id: string) {
    const s = students.find((x) => x.id === id);
    if (!s) return false;
    const c = classes.find((x) => x.id === s.classId);
    if (c) c.studentIds = c.studentIds.filter((sid) => sid !== id);
    students = students.filter((x) => x.id !== id);
    return true;
  },

  getClassesForTeacher(teacherId: string): SchoolClass[] {
    return classes
      .filter((c) => c.teacherIds.includes(teacherId))
      .map((c) => ({
        ...c,
        teacherIds: [...c.teacherIds],
        studentIds: [...c.studentIds],
      }));
  },

  /** Нүүр болон анги-д нэмэлт ангийг (store-д бүртгээгүй багшид) нэмж харуулах */
  getClassesForTeacherWithDemo(teacherId: string): SchoolClass[] {
    const base = this.getClassesForTeacher(teacherId);
    const have = new Set(base.map((c) => c.id));
    const extras: SchoolClass[] = [];
    for (const demoId of TEACHER_DEMO_CLASS_IDS) {
      if (have.has(demoId)) continue;
      const demo = classes.find((c) => c.id === demoId);
      if (!demo) continue;
      extras.push({
        ...demo,
        teacherIds: [...demo.teacherIds],
        studentIds: [...demo.studentIds],
      });
      have.add(demoId);
    }
    return extras.length === 0 ? base : [...base, ...extras];
  },

  teacherAssignedToClass(teacherId: string, classId: string): boolean {
    const c = classes.find((x) => x.id === classId);
    return !!c?.teacherIds.includes(teacherId);
  },

  getStudentByNumber(studentNumber: string) {
    const n = studentNumber.trim();
    const s = students.find((x) => x.studentNumber === n);
    return s ? { ...s } : undefined;
  },
};
