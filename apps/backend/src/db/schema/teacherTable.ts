import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const teacherTable = sqliteTable("teacher", {
    id: text("id").primaryKey(),
    schoolId: text("schoolId"),
    name: text("name").notNull(),
  });   