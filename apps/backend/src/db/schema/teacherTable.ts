import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const teacherTable = sqliteTable("teacher", {
    id: text("id").primaryKey(),
    clerkId: text("clerkId"),
    email: text("email").notNull(),
    classId: text("classId"),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    schoolId: text("schoolId").notNull(),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
  });   