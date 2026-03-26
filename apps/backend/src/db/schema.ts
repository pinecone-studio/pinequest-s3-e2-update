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
  variation: text("variation").notNull(),
  teacherId: text("teacherId").references(() => teacherTable.id),
  subjectId: text("subjectId").references(() => subjectTable.id).notNull(),
  grade: integer("grade"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const examTable = sqliteTable("exam", {
  id: text("id").primaryKey(),
  subjectId: text("subjectId").references(() => subjectTable.id).notNull(),
  gradeId: text("gradeId").references(() => gradeTable.id),
  teacherId: text("teacherId").references(() => teacherTable.id),
  tests: text("tests").notNull(),
  openExercises: text("openExercises").notNull(),
  date: text("date"),
  duration: text("duration").notNull(),
  location: text("location").notNull(),
  notes: text("notes").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});