import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const examCheatLogTable = sqliteTable("examCheatLog", {
  id: text("id").primaryKey(),
  timestamp: text("timestamp").notNull(),
  studentExamResultId: text("studentExamResultId").notNull(),
  note: text("note"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
