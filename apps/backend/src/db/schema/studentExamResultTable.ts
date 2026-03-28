import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const studentExamResultTable = sqliteTable("studentExamResult", {
    id: text("id").primaryKey(),
    examId: text("examId").notNull(),
    studentId: text("studentId").notNull(),
    teacherId: text("teacherId").notNull(),
    status: text("status").notNull().default("pending"),
    notes:text("notes"),
    testScore: integer("testScore"),
    openExerciseScore: integer("openExerciseScore"),
    totalScore: integer("totalScore"),
    actualScore: integer("actualScore"),
    examCheatLogIds: text("examCheatLogIds"),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
  });