import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { studentTable } from "./studentTable";
import { teacherTable } from "./teacherTable";
import { examTable } from "./examTable";

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