import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const schoolTable = sqliteTable("school", {
  id: text("id").primaryKey(),
  clerkId: text("clerkId").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  register: integer("register").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const classTable = sqliteTable("class", {
  id: text("id").primaryKey(),
  schoolId: text("schoolId").references(() => schoolTable.id).notNull(),
  studentIds: text("studentIds").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const studentTable = sqliteTable("student", {
  id: text("id").primaryKey(),
  schoolId: text("schoolId").references(() => schoolTable.id).notNull(),
  gradeId: text("gradeId").references(() => gradeTable.id).notNull(),
  name: text("name").notNull(),
  studentCode: text("studentCode").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const teacherTable = sqliteTable("teacher", {
  id: text("id").primaryKey(),
  schoolId: text("schoolId").references(() => schoolTable.id).notNull(),
  name: text("name").notNull(),
});

export const subjectTable = sqliteTable("subject", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const gradeTable = sqliteTable("grade", {
  id: text("id").primaryKey(),
  teacherId: text("teacherId").references(() => teacherTable.id),
  subjectId: text("subjectId").references(() => subjectTable.id).notNull(),
  studentIds: text("studentIds"),
  grade: integer("grade"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const examTable = sqliteTable("exam", {
  id: text("id").primaryKey(),
  notes: text("notes"),
  duration: text("duration").notNull(),
  isActive: integer("isActive").notNull().default(1),
  variation: text("variation").notNull(),
  tests: text("tests"),
  openExercises: text("openExercises"),
  gradeId: text("gradeId").references(() => gradeTable.id),
  date: text("date"),
  location: text("location"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const examCheatLogTable = sqliteTable("examCheatLog", {
  id: text("id").primaryKey(),
  examId: text("examId").references(() => examTable.id).notNull(),
  timestamp: text("timestamp").notNull(),
  studentId: text("studentId").references(() => studentTable.id).notNull(),
  tab: text("tab").notNull(),
  note: text("note"),
  teacherId: text("teacherId").references(() => teacherTable.id),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});