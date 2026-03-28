import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const studentTable = sqliteTable("student", {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    classId: text("classId").notNull(),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    studentCode: text("studentCode"),
    studentExamResultId: text("studentExamResultIds"),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
  });
  