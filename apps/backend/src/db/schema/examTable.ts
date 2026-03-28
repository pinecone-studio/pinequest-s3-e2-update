import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const examTable = sqliteTable("exam", {
    id: text("id").primaryKey(),
    grade: integer("grade").notNull(),
    subjectId: text("subjectId").notNull(),
    topic: text("topic"),
    title: text("title"),
    date: text("date"),
    location: text("location"),
    duration: text("duration").notNull(),
    variation: text("variation"),
    testIds: text("testIds"),
    openExerciseIds: text("openExerciseIds"),
    notes: text("notes"),
    score: integer("score"),
    usageCount: integer("usageCount").notNull().default(0),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
  });