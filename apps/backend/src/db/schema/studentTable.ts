import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const studentTable = sqliteTable(
  "student",
  {
  id: text("id").primaryKey(),
  email: text("email"),
  classId: text("classId").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  studentCode: text("studentCode"),
  studentExamResultIds: text("studentExamResultIds"),
  studentStatus: text("studentStatus").notNull().default("active"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
  },
  (t) => ({
    studentCodeUnique: uniqueIndex("student_studentCode_unique").on(t.studentCode),
  }),
);
