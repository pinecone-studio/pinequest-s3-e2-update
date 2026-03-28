import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const examTable = sqliteTable("exam", {
    id: text("id").primaryKey(),
    notes: text("notes"),
    title: text("title"),
    duration: text("duration").notNull(),
    isActive: integer("isActive").notNull().default(1),
    variation: text("variation"),
    testIds: text("testIds"),
    openExercises: text("openExercises"),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
  });