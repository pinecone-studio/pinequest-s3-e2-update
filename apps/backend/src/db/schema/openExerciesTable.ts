import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const openExerciesTable = sqliteTable("openExercies", {
  id: text("id").primaryKey(),
  grade: integer("grade").notNull(),
  subjectId: text("subjectId").notNull(),
  topic: text("topic"),
  title: text("title"),
  question: text("question"),
  answer: text("answer"),
  imageUrl: text("imageUrl"),
  difficulty: text("difficulty"),
  score: integer("score").notNull(),
  notes: text("notes"),
  teacherId: text("teacherId").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
