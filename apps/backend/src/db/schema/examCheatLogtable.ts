import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { teacherTable } from "./teacherTable"

export const examCheatLogTable = sqliteTable("examCheatLog", {
    id: text("id").primaryKey(),
    timestamp: text("timestamp").notNull(),
    studentExamResultId: text("studentExamResultId").notNull(),
    note: text("note"),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
  });