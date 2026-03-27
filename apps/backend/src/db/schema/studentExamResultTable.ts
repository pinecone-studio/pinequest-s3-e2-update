import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { examTable } from "./examtable";
import { studentTable } from "./studentTable";

export const studentExamResultTable = sqliteTable("studentExamResult", {
    id: text("id").primaryKey(),
    examId: text("examId").references(() => examTable.id).notNull(),
    studentId: text("studentId").references(() => studentTable.id).notNull(),
    status: text("status").notNull().default("pending"),
    score: integer("score"),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
  });