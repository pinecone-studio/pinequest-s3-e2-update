import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const studentTable = sqliteTable("student", {
    id: text("id").primaryKey(),
    schoolId: text("schoolId"),
    classId: text("classId"),
    name: text("name").notNull(),
    studentCode: text("studentCode").notNull(),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
  });
  