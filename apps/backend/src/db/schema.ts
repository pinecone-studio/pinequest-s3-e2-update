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

export const subjectTable = sqliteTable("subject", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const studentTable = sqliteTable("student", {
  id: text("id").primaryKey(),
  schoolId: text("schoolId").references(() => schoolTable.id).notNull(),
  grade: integer("grade"),
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

export const classTable = sqliteTable("class", {
  id: text("id").primaryKey(),
  schoolId: text("schoolId").references(() => schoolTable.id).notNull(),
  studentIds: text("studentIds").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const testTable = sqliteTable("test", {
  id: text("id").primaryKey(),
  grade: integer("grade"),
  subjectId: text("subjectId").references(() => subjectTable.id).notNull(),
  topic: text("topic").notNull(),
  title: text("title"),
  questionType: text("questionType"),
  question: text("question").notNull(),
  subtopic: text("subtopic"),
  rubric: text("rubric"),
  formulaRaw: text("formulaRaw"),
  imageUrl: text("imageUrl"),
  fileUploadConfig: text("fileUploadConfig"),
  answers: text("answers").notNull(),
  rightAnswer: text("rightAnswer").notNull(),
  notes: text("notes"),
  questionNote: text("questionNote"),
  difficulty: text("difficulty"),
  score: integer("score").notNull(),
  usageCount: integer("usageCount").notNull().default(0),
  isActive: integer("isActive").notNull().default(1),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const examTable = sqliteTable("exam", {
  id: text("id").primaryKey(),
  notes: text("notes"),
  title: text("title"),
  duration: text("duration").notNull(),
  isActive: integer("isActive").notNull().default(1),
  variation: text("variation"),
  testIds: text("testIds"),
  openExercises: text("openExercises"),
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

export const studentExamResultTable = sqliteTable("studentExamResult", {
  id: text("id").primaryKey(),
  examId: text("examId").references(() => examTable.id).notNull(),
  studentId: text("studentId").references(() => studentTable.id).notNull(),
  status: text("status").notNull().default("pending"),
  score: integer("score"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
